import asyncio
import logging
import os
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, Optional

# Pinterest SDK Integration (from __init__.py client)
try:
    from pinterest import PinterestSDKClient
except ImportError:
    # Fallback/mock structure if sdk is not locally pre-installed in runtime
    PinterestSDKClient = None

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] CINIS-ENGINE: %(message)s"
)
logger = logging.getLogger("CINIS_Orchestrator")


class TriggerType(Enum):
    NEW_VISITOR = "TRIGGER_A_NEW_VISITOR"
    FORM_SUBMISSION = "TRIGGER_B_FORM_SUBMISSION"
    NEW_PURCHASE = "TRIGGER_C_NEW_PURCHASE"
    ABANDONED_CHECKOUT = "TRIGGER_D_ABANDONED_CHECKOUT"
    BOOKING_REQUEST = "TRIGGER_F_BOOKING_REQUEST"


@dataclass(order=True)
class EventPayload:
    priority: int
    trigger_type: TriggerType = field(compare=False)
    data: Dict[str, Any] = field(compare=False)


class CINISAutomationEngine:
    def __init__(self):
        self.event_queue: asyncio.PriorityQueue = asyncio.PriorityQueue()
        self.pinterest_client: Optional[Any] = None
        self._init_pinterest_sdk()

    def _init_pinterest_sdk(self):
        """Initializes Pinterest Client from environment variables."""
        access_token = os.getenv("PINTEREST_ACCESS_TOKEN")
        refresh_token = os.getenv("PINTEREST_REFRESH_ACCESS_TOKEN")
        app_id = os.getenv("PINTEREST_APP_ID")
        app_secret = os.getenv("PINTEREST_APP_SECRET")

        if PinterestSDKClient:
            if access_token:
                self.pinterest_client = PinterestSDKClient.create_client_with_token(access_token)
                logger.info("Pinterest SDK client initialized with Access Token.")
            elif refresh_token and app_id and app_secret:
                self.pinterest_client = PinterestSDKClient.create_client_with_refresh_token(
                    refresh_token=refresh_token,
                    app_id=app_id,
                    app_secret=app_secret
                )
                logger.info("Pinterest SDK client initialized with Refresh Token.")
            else:
                logger.warning("Pinterest credentials not found in env. Social syndication will run in simulation mode.")
        else:
            logger.warning("Pinterest SDK module not loaded. Running in standalone mode.")

    async def enqueue_event(self, trigger_type: TriggerType, data: Dict[str, Any], priority: int = 5):
        """Pushes an incoming webhook/event into the non-blocking async priority queue."""
        event = EventPayload(priority=priority, trigger_type=trigger_type, data=data)
        await self.event_queue.put(event)
        logger.info(f"Enqueued event [{trigger_type.value}] with priority {priority}")

    async def start_worker(self):
        """Asynchronous stream processing worker routine."""
        logger.info("CINIS Orchestration Processing Core Active...")
        while True:
            event: EventPayload = await self.event_queue.get()
            try:
                await self._dispatch_trigger(event)
            except Exception as e:
                logger.error(f"Error processing event {event.trigger_type}: {str(e)}")
            finally:
                self.event_queue.task_done()

    async def _dispatch_trigger(self, event: EventPayload):
        """Routes trigger events to their defined execution chains."""
        ttype = event.trigger_type
        payload = event.data

        if ttype == TriggerType.NEW_VISITOR:
            await self._handle_trigger_a(payload)
        elif ttype == TriggerType.FORM_SUBMISSION:
            await self._handle_trigger_b(payload)
        elif ttype == TriggerType.NEW_PURCHASE:
            await self._handle_trigger_c(payload)
        elif ttype == TriggerType.ABANDONED_CHECKOUT:
            await self._handle_trigger_d(payload)
        elif ttype == TriggerType.BOOKING_REQUEST:
            await self._handle_trigger_f(payload)

    # -------------------------------------------------------------------------
    # TRIGGER EXECUTION CHAINS
    # -------------------------------------------------------------------------

    async def _handle_trigger_a(self, data: Dict[str, Any]):
        """Trigger A: New Website Visitor (Netlify Traffic Node)"""
        logger.info(f"[Trigger A] Tagging traffic channel: {data.get('source', 'Direct')}")
        logger.info(f"[Trigger A] Capturing contact: {data.get('email') or data.get('phone')}")
        logger.info(f"[Trigger A] Delivering free lead asset to: {data.get('email')}")

    async def _handle_trigger_b(self, data: Dict[str, Any]):
        """Trigger B: Lead Form Submission (Netlify Custom Forms)"""
        email = data.get("email")
        intent_tier = data.get("intent_score", "Warm")
        logger.info(f"[Trigger B] Adding {email} to Central CRM Pipeline.")
        logger.info(f"[Trigger B] Assigned Intent Tier: {intent_tier}")
        logger.info(f"[Trigger B] Starting 5-Message Nurture Sequence for {email}.")

    async def _handle_trigger_c(self, data: Dict[str, Any]):
        """Trigger C: New Shopify Purchase (Order Complete Event)"""
        order_id = data.get("order_id")
        customer = data.get("email")
        asset_url = data.get("digital_asset_url", "https://cdn.cinis.ai/assets/download")

        logger.info(f"[Trigger C] Order Confirmed: {order_id} for {customer}")
        logger.info(f"[Trigger C] Executing Instant Digital Fulfillment: {asset_url}")
        logger.info(f"[Trigger C] Tagging contact as 'Active Buyer' in CRM.")
        logger.info(f"[Trigger C] Triggering Post-Purchase Upsell & WhatsApp Opt-in Sequence.")

        # Optional Social Content Syndication on Purchase Milestone
        if self.pinterest_client:
            logger.info("[Trigger C] Syncing conversion metric to Pinterest Analytics pipeline.")

    async def _handle_trigger_d(self, data: Dict[str, Any]):
        """Trigger D: Abandoned Checkout (Cart Recovery Engine)"""
        checkout_id = data.get("checkout_id")
        email = data.get("email")
        phone = data.get("phone")

        logger.info(f"[Trigger D] Initiating Recovery Flow for Checkout ID: {checkout_id}")
        logger.info(f"[Trigger D] Dispatching Recovery Email to {email}")
        if phone:
            logger.info(f"[Trigger D] Sending WhatsApp Ping (Opt-in) to {phone}")
        logger.info(f"[Trigger D] Routing custom upgrade offer to recover checkout.")

    async def _handle_trigger_f(self, data: Dict[str, Any]):
        """Trigger F: High-Intent Booking Request (Netlify Discovery Node)"""
        budget = data.get("budget", 0)
        email = data.get("email")

        logger.info(f"[Trigger F] Running Qualification Scoring for {email} (Budget: ${budget})")
        if budget >= 2500:
            logger.info(f"[Trigger F] QUALIFIED -> Creating CRM Deal & Dispatching Calendar Invite to {email}.")
        else:
            logger.info(f"[Trigger F] UNQUALIFIED -> Routing {email} to standard nurture sequence.")


# -------------------------------------------------------------------------
# VERIFICATION & TEST DRIVER
# -------------------------------------------------------------------------

async def main():
    engine = CINISAutomationEngine()

    # Launch worker loop in background
    worker_task = asyncio.create_task(engine.start_worker())

    # Simulate Incoming Events Across Channels
    await engine.enqueue_event(
        TriggerType.NEW_VISITOR,
        {"email": "visitor@example.com", "source": "TikTok"},
        priority=3
    )

    await engine.enqueue_event(
        TriggerType.FORM_SUBMISSION,
        {"email": "lead@company.com", "intent_score": "High-Ticket"},
        priority=2
    )

    await engine.enqueue_event(
        TriggerType.NEW_PURCHASE,
        {"order_id": "SHOP-9821", "email": "buyer@domain.com", "digital_asset_url": "https://assets.cinis.ai/pkg_v1.zip"},
        priority=1  # Highest Priority
    )

    await engine.enqueue_event(
        TriggerType.ABANDONED_CHECKOUT,
        {"checkout_id": "CART-4401", "email": "cart@domain.com", "phone": "+1234567890"},
        priority=2
    )

    await engine.enqueue_event(
        TriggerType.BOOKING_REQUEST,
        {"email": "enterprise@partner.com", "budget": 5000},
        priority=1
    )

    # Allow queue to process all events
    await engine.event_queue.join()
    worker_task.cancel()

if __name__ == "__main__":
    asyncio.run(main())
