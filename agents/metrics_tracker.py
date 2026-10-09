#!/usr/bin/env python3
"""
Metrics Tracker — Autonomous tracking of content performance, conversions, and revenue.

Feeds into Platform Pulse (metrics-dashboard.html).

Metrics tracked:
- podcast listens (content-output/podcast/listen_events.json)
- documentary views (content-output/documentary/view_events.json)
- offer clicks (content-output/events/offer_clicks.json)
- paystack conversions (content-output/events/paystack_conversions.json)
- member retention (content-output/events/member_retention.json)
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, List


class MetricsTracker:
    """Autonomous content + revenue metrics tracking."""

    def __init__(self):
        self.brand = "Cortex Intelligence Nexus"
        self.metrics_root = Path(__file__).parent.parent / "content-output" / "metrics"
        self.metrics_root.mkdir(parents=True, exist_ok=True)

    def log_listen_event(self, episode_id: str, user_email: str, duration_seconds: int):
        """Log a podcast listen event."""
        event = {
            "type": "podcast_listen",
            "episode_id": episode_id,
            "user_email": user_email,
            "duration_seconds": duration_seconds,
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
        self._append_event("podcast_listens.json", event)

    def log_view_event(self, content_id: str, content_type: str, user_email: str):
        """Log a documentary or media view."""
        event = {
            "type": f"{content_type}_view",
            "content_id": content_id,
            "content_type": content_type,
            "user_email": user_email,
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
        self._append_event("content_views.json", event)

    def log_offer_click(self, offer_id: str, source: str, user_email: Optional[str] = None):
        """Log an offer CTA click."""
        event = {
            "type": "offer_click",
            "offer_id": offer_id,
            "source": source,  # podcast_teaser, media_post, email, etc.
            "user_email": user_email or "anonymous",
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
        self._append_event("offer_clicks.json", event)

    def log_conversion(self, paystack_reference: str, amount_ngn: int, email: str, product: str):
        """Log a successful Paystack conversion."""
        event = {
            "type": "paystack_conversion",
            "reference": paystack_reference,
            "amount_ngn": amount_ngn,
            "email": email,
            "product": product,
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
        self._append_event("conversions.json", event)

    def log_member_retention(self, email: str, days_active: int):
        """Log member retention snapshot."""
        event = {
            "type": "member_retention",
            "email": email,
            "days_active": days_active,
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
        self._append_event("member_retention.json", event)

    def _append_event(self, filename: str, event: Dict[str, Any]):
        """Append event to JSON log."""
        filepath = self.metrics_root / filename
        if filepath.exists():
            events = json.loads(filepath.read_text())
        else:
            events = []
        events.append(event)
        filepath.write_text(json.dumps(events, indent=2))

    def get_metrics_summary(self, days: int = 7) -> Dict[str, Any]:
        """
        Return a metrics summary for the last N days.
        Feeds into Platform Pulse dashboard.
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)

        summary = {
            "period_days": days,
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "podcast_listens": 0,
            "content_views": 0,
            "offer_clicks": 0,
            "conversions": 0,
            "total_revenue_ngn": 0,
            "unique_members": set(),
            "conversion_rate": 0.0,
        }

        # Count podcast listens
        listens_file = self.metrics_root / "podcast_listens.json"
        if listens_file.exists():
            events = json.loads(listens_file.read_text())
            for event in events:
                if self._is_in_period(event["timestamp"], cutoff_date):
                    summary["podcast_listens"] += 1
                    summary["unique_members"].add(event["user_email"])

        # Count content views
        views_file = self.metrics_root / "content_views.json"
        if views_file.exists():
            events = json.loads(views_file.read_text())
            for event in events:
                if self._is_in_period(event["timestamp"], cutoff_date):
                    summary["content_views"] += 1
                    summary["unique_members"].add(event["user_email"])

        # Count offer clicks
        clicks_file = self.metrics_root / "offer_clicks.json"
        if clicks_file.exists():
            events = json.loads(clicks_file.read_text())
            for event in events:
                if self._is_in_period(event["timestamp"], cutoff_date):
                    summary["offer_clicks"] += 1

        # Count conversions and revenue
        conversions_file = self.metrics_root / "conversions.json"
        if conversions_file.exists():
            events = json.loads(conversions_file.read_text())
            for event in events:
                if self._is_in_period(event["timestamp"], cutoff_date):
                    summary["conversions"] += 1
                    summary["total_revenue_ngn"] += event["amount_ngn"]
                    summary["unique_members"].add(event["email"])

        summary["unique_members"] = len(summary["unique_members"])

        # Calculate conversion rate
        if summary["offer_clicks"] > 0:
            summary["conversion_rate"] = round(
                (summary["conversions"] / summary["offer_clicks"]) * 100, 2
            )

        return summary

    def _is_in_period(self, timestamp_str: str, cutoff_date) -> bool:
        """Check if timestamp is within the period."""
        event_date = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
        return event_date >= cutoff_date.replace(tzinfo=None)

    def export_to_platform_pulse(self) -> Dict[str, Any]:
        """
        Export metrics for Platform Pulse (metrics-dashboard.html).
        """
        summary_7d = self.get_metrics_summary(days=7)
        summary_30d = self.get_metrics_summary(days=30)
        summary_all = self.get_metrics_summary(days=365)

        return {
            "brand": self.brand,
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "periods": {
                "week": summary_7d,
                "month": summary_30d,
                "year": summary_all,
            },
            "health_status": self._calculate_health_status(summary_30d),
        }

    def _calculate_health_status(self, metrics: Dict) -> Dict[str, str]:
        """Determine platform health status."""
        status = {}

        # Member growth
        if metrics["unique_members"] > 50:
            status["member_growth"] = "strong"
        elif metrics["unique_members"] > 10:
            status["member_growth"] = "growing"
        else:
            status["member_growth"] = "early"

        # Engagement
        if metrics["podcast_listens"] > metrics["conversions"] * 5:
            status["engagement"] = "strong"
        elif metrics["podcast_listens"] > 0:
            status["engagement"] = "active"
        else:
            status["engagement"] = "warming_up"

        # Revenue
        if metrics["total_revenue_ngn"] > 500000:  # ₦500k+
            status["revenue"] = "strong"
        elif metrics["total_revenue_ngn"] > 100000:  # ₦100k+
            status["revenue"] = "growing"
        else:
            status["revenue"] = "early"

        # Conversion efficiency
        if metrics["conversion_rate"] > 10:
            status["conversion_efficiency"] = "excellent"
        elif metrics["conversion_rate"] > 2:
            status["conversion_efficiency"] = "healthy"
        else:
            status["conversion_efficiency"] = "optimize"

        return status


from typing import Optional

def main():
    """Example: Log events and export metrics."""
    tracker = MetricsTracker()

    print("\n📊 Metrics Tracker\n" + "=" * 60)

    # Simulate events
    print("\nLogging sample events...\n")

    tracker.log_listen_event("ep_1", "user1@example.com", 1800)
    tracker.log_listen_event("ep_1", "user2@example.com", 1750)
    tracker.log_view_event("doc_1", "documentary", "user1@example.com")
    tracker.log_offer_click("offer_1", "podcast_teaser", "user1@example.com")
    tracker.log_offer_click("offer_1", "media_post", "user3@example.com")
    tracker.log_conversion("ref_1234567890", 2200000, "user1@example.com", "30-Day AI Content System")

    print("✓ Events logged")

    # Export metrics
    print("\nExporting metrics for Platform Pulse...\n")
    pulse_data = tracker.export_to_platform_pulse()
    print(json.dumps(pulse_data, indent=2))


if __name__ == "__main__":
    main()
