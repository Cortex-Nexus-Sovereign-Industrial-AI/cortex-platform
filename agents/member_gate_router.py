#!/usr/bin/env python3
"""
Member Gate Router — Connects content to Paystack payment + member access.

Workflow:
1. Content agent generates asset
2. Router checks if access_grant exists for user
3. If yes: serve full content to member-dashboard.html
4. If no: serve public teaser + CTA to offers.html

Revenue integration:
- Paystack reference → access_grant creation
- access_grant → member content unlock
- Member dashboard reads access_grants from backend
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, Optional


class MemberGateRouter:
    """Routes content based on member access grants."""

    def __init__(self):
        self.brand = "Cortex Intelligence Nexus"
        self.site = "https://cortex-platforms.netlify.app"
        self.offer_url = f"{self.site}/offers.html"
        self.member_dashboard_url = f"{self.site}/member-dashboard.html"
        self.db_dir = Path(__file__).parent.parent / "content-output" / "access-grants"
        self.db_dir.mkdir(parents=True, exist_ok=True)

    def create_access_grant(
        self,
        user_email: str,
        product_name: str,
        paystack_reference: str,
        days_valid: int = 30,
    ) -> Dict[str, Any]:
        """
        Create an access grant after successful Paystack payment.

        In production, this is triggered by webhook from backend/paystack webhook handler.
        For now, we store grants as JSON for member-dashboard.html to read.
        """
        grant = {
            "user_email": user_email,
            "product_name": product_name,
            "paystack_reference": paystack_reference,
            "granted_at": datetime.utcnow().isoformat() + "Z",
            "expires_at": (datetime.utcnow() + timedelta(days=days_valid)).isoformat() + "Z",
            "status": "active",
            "access_level": "member",
        }

        grant_file = self.db_dir / f"{user_email}_{product_name}.json"
        grant_file.write_text(json.dumps(grant, indent=2))

        return grant

    def check_access(
        self, user_email: str, product_name: str
    ) -> Optional[Dict[str, Any]]:
        """
        Check if a user has valid access to a product.
        """
        grant_file = self.db_dir / f"{user_email}_{product_name}.json"
        if not grant_file.exists():
            return None

        grant = json.loads(grant_file.read_text())

        # Check expiration
        expires_at = datetime.fromisoformat(grant["expires_at"].replace("Z", "+00:00"))
        if datetime.utcnow().replace(tzinfo=None) > expires_at:
            grant["status"] = "expired"
            return grant

        return grant

    def route_content(
        self, user_email: str, content_id: str, content_type: str
    ) -> Dict[str, Any]:
        """
        Route to full member content or public teaser based on access.
        """
        product_map = {
            "podcast": "30-Day AI Content System",
            "documentary": "DARKTRONIX Technical Education",
            "media": "Public",
        }
        product = product_map.get(content_type, "Unknown")

        access = self.check_access(user_email, product)

        if access and access["status"] == "active":
            return {
                "route": "member_content",
                "destination": self.member_dashboard_url,
                "content_id": content_id,
                "user_email": user_email,
                "product": product,
                "access_grant": access,
                "message": f"Access granted. Serving full {content_type} content.",
            }
        else:
            return {
                "route": "public_teaser_and_cta",
                "destination": self.offer_url,
                "content_id": content_id,
                "user_email": user_email,
                "product": product,
                "message": f"No active access. Serving public teaser and conversion CTA.",
                "cta_button_text": f"Unlock for ₦22,000",
                "cta_link": self.offer_url,
            }

    def export_access_grants_for_member_dashboard(self, user_email: str) -> list:
        """
        Export all access grants for a user as JSON payload for member-dashboard.html.
        The dashboard will read this and render available content.
        """
        grants = []
        for grant_file in self.db_dir.glob(f"{user_email}_*.json"):
            grant = json.loads(grant_file.read_text())
            if grant["status"] == "active":
                grants.append(grant)
        return grants

    def create_paystack_webhook_payload(
        self, reference: str, status: str, amount: int, email: str
    ) -> Dict[str, Any]:
        """
        Example webhook payload from Paystack for backend/paystack webhook handler.
        This would be sent to /api/webhooks/paystack (from backend/README.md).
        """
        if status == "success":
            grant = self.create_access_grant(
                user_email=email,
                product_name="30-Day AI Content System",
                paystack_reference=reference,
                days_valid=30,
            )
            return {
                "success": True,
                "webhook_reference": reference,
                "amount": amount,
                "email": email,
                "access_grant_created": grant,
            }
        else:
            return {
                "success": False,
                "webhook_reference": reference,
                "amount": amount,
                "email": email,
                "reason": "Payment failed or pending",
            }


class MemberDashboardPayloadBuilder:
    """
    Builds the JSON payload for member-dashboard.html to render.
    This is what the frontend reads to display gated content.
    """

    def __init__(self, user_email: str):
        self.user_email = user_email
        self.router = MemberGateRouter()

    def build_payload(self) -> Dict[str, Any]:
        """
        Build complete member dashboard payload.
        """
        access_grants = self.router.export_access_grants_for_member_dashboard(
            self.user_email
        )

        # Load available content from content-output/podcast/registry.json
        podcast_registry_path = (
            Path(__file__).parent.parent / "content-output" / "podcast" / "registry.json"
        )
        podcasts = []
        if podcast_registry_path.exists():
            podcasts = json.loads(podcast_registry_path.read_text())

        # Filter podcasts to those the user has access to
        accessible_content = []
        for podcast in podcasts:
            has_access = any(
                g["product_name"] == "30-Day AI Content System" and g["status"] == "active"
                for g in access_grants
            )
            if has_access:
                accessible_content.append(
                    {
                        "type": "podcast",
                        "id": podcast["episode_id"],
                        "title": podcast["title"],
                        "slug": podcast["slug"],
                        "path": f"/content-output/podcast/{podcast['filename']}",
                        "created_at": podcast["created_at"],
                    }
                )

        return {
            "user_email": self.user_email,
            "member_since": datetime.utcnow().isoformat() + "Z",
            "access_grants": access_grants,
            "content": accessible_content,
            "message": f"Welcome to {self.router.brand}. Explore your member content below.",
        }


def main():
    """Example: Create access grant and route content."""
    router = MemberGateRouter()

    # Simulate Paystack webhook
    print("\n🔐 Member Gate Router\n" + "=" * 60)
    print("\nSimulating Paystack webhook for successful payment...\n")

    webhook_result = router.create_paystack_webhook_payload(
        reference="ref_1234567890",
        status="success",
        amount=2200000,  # ₦22,000 in kobo
        email="user@example.com",
    )
    print(f"✓ Webhook processed: {webhook_result}")

    # Route content for this user
    print("\nRouting podcast content for user...\n")
    route = router.route_content(
        user_email="user@example.com",
        content_id="ep_1",
        content_type="podcast",
    )
    print(f"✓ Route result:\n{json.dumps(route, indent=2)}")

    # Build member dashboard payload
    print("\nBuilding member dashboard payload...\n")
    builder = MemberDashboardPayloadBuilder("user@example.com")
    payload = builder.build_payload()
    print(f"✓ Member dashboard payload:\n{json.dumps(payload, indent=2)}")


if __name__ == "__main__":
    main()
