"""
Mike Complex AI (CINIS AI) — operational agent.

Identity source of truth: ../IDENTITY.md
Scope: Netlify deployment monitoring + incoming workflow/payload processing.
Google Business Profile is exposed as static reference data only — no live
GBP API client exists in this repository (no credentials configured).
"""

import json
import logging
import os
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] CINIS-ENGINE: %(message)s",
)
logger = logging.getLogger("MikeComplexAI")

IDENTITY = {
    "ai_name": "Mike Complex AI",
    "product": "CINIS AI",
    "parent_brand": "Cortex Intelligence Nexus Intel Solution",
    "founder": "Michael Ujuku Morim",
}

# Static reference data mirroring IDENTITY.md. Read-only — there is no
# Google Business Profile API client here, so nothing in this module can
# create, verify, or modify the listing. Update IDENTITY.md first, then
# mirror any change here.
GOOGLE_BUSINESS_PROFILE = {
    "listing_name": "Cortex Intelligence Nexus",
    "maps_profile_url": "https://maps.google.com/maps?cid=2073161413550473641",
    "review_url": "https://search.google.com/local/writereview?placeid=ChIJu_fwtQXAO6gRqQG5UFJZxRw",
    "place_id": "ChIJu_fwtQXAO6gRqQG5UFJZxRw",
    "cid": "2073161413550473641",
    "note": (
        "Reference data only, mirrored from IDENTITY.md. No live Google "
        "Business Profile API integration is configured in this repository."
    ),
}

NETLIFY_API_BASE = "https://api.netlify.com/api/v1"


class MikeComplexAI:
    """Bridges Netlify deployment status with incoming workflow payloads."""

    def __init__(self, site_id: Optional[str] = None):
        self.site_id = site_id or os.getenv("NETLIFY_SITE_ID") or os.getenv("SITE_ID")
        self._auth_token = os.getenv("NETLIFY_AUTH_TOKEN")
        logger.info(f"[{IDENTITY['ai_name']} · {IDENTITY['product']}] agent initialized.")

    # -- Identity -----------------------------------------------------

    def describe_identity(self) -> Dict[str, str]:
        """Returns the canonical identity block for this agent."""
        return dict(IDENTITY)

    # -- Netlify deployment monitoring ---------------------------------

    def _netlify_request(self, path: str) -> Dict[str, Any]:
        if not self._auth_token:
            return {"ok": False, "error": "NETLIFY_AUTH_TOKEN not set in environment."}
        if not self.site_id:
            return {"ok": False, "error": "No site id configured."}

        request = urllib.request.Request(
            f"{NETLIFY_API_BASE}{path}",
            headers={"Authorization": f"Bearer {self._auth_token}"},
        )
        try:
            with urllib.request.urlopen(request, timeout=10) as response:
                return {"ok": True, "data": json.loads(response.read())}
        except urllib.error.HTTPError as exc:
            return {"ok": False, "error": f"Netlify API returned HTTP {exc.code}"}
        except urllib.error.URLError as exc:
            return {"ok": False, "error": f"Netlify API unreachable: {exc.reason}"}

    def check_site_status(self) -> Dict[str, Any]:
        """Fetches current site state (published deploy, URL) from the Netlify API."""
        result = self._netlify_request(f"/sites/{self.site_id}")
        if not result["ok"]:
            logger.warning(f"Site status check failed: {result['error']}")
            return result

        site = result["data"]
        return {
            "ok": True,
            "site_id": site.get("id"),
            "name": site.get("name"),
            "url": site.get("url"),
            "published_deploy_id": (site.get("published_deploy") or {}).get("id"),
            "published_at": (site.get("published_deploy") or {}).get("published_at"),
        }

    def list_recent_deploys(self, limit: int = 5) -> Dict[str, Any]:
        """Fetches the most recent deploys for the configured site."""
        result = self._netlify_request(f"/sites/{self.site_id}/deploys?per_page={limit}")
        if not result["ok"]:
            logger.warning(f"Deploy list fetch failed: {result['error']}")
            return result

        deploys = [
            {
                "id": d.get("id"),
                "state": d.get("state"),
                "branch": d.get("branch"),
                "created_at": d.get("created_at"),
            }
            for d in result["data"]
        ]
        return {"ok": True, "deploys": deploys}

    # -- Workflow / payload processing ---------------------------------

    def process_workflow_payload(self, payload: Dict[str, Any], required_fields: Optional[List[str]] = None) -> Dict[str, Any]:
        """Validates and normalizes an incoming workflow/technical payload."""
        required_fields = required_fields or []
        missing = [field_name for field_name in required_fields if field_name not in payload]
        if missing:
            logger.error(f"Rejected payload, missing fields: {missing}")
            return {"ok": False, "error": f"missing required fields: {missing}"}

        received_at = datetime.now(timezone.utc).isoformat()
        logger.info(f"Processed workflow payload with keys: {list(payload.keys())}")
        return {"ok": True, "received_at": received_at, "payload": payload}

    # -- Google Business Profile (reference only) -----------------------

    def google_business_profile_info(self) -> Dict[str, Any]:
        """Returns static, documented Google Business Profile references.

        No live GBP API calls are made — see GOOGLE_BUSINESS_PROFILE note.
        """
        return dict(GOOGLE_BUSINESS_PROFILE)


if __name__ == "__main__":
    agent = MikeComplexAI()
    logger.info(f"Identity: {agent.describe_identity()}")
    logger.info(f"Site status: {agent.check_site_status()}")
    logger.info(f"Google Business Profile (reference only): {agent.google_business_profile_info()}")
