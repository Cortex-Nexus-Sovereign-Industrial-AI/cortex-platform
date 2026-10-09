#!/usr/bin/env python3
"""
Podcast Agent — autonomous content generator for Cortex Intelligence Nexus.

Operates under IDENTITY.md rules:
- Brand: Cortex Intelligence Nexus
- No fake promises
- Problem-to-outcome framework
- Verified, operational content only

Output: Structured podcast scripts ready for recording, transcription, and member delivery.
Revenue: Part of 30-Day AI Content System (₦22,000 via Paystack)
"""

import json
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, Any


class PodcastAgent:
    """Autonomous podcast content generator."""

    def __init__(self):
        self.brand = "Cortex Intelligence Nexus"
        self.founder = "Michael Ujuku Morim"
        self.site = "https://cortex-platforms.netlify.app"
        self.output_dir = Path(__file__).parent.parent / "content-output" / "podcast"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.registry = self.output_dir / "registry.json"

    def _load_registry(self) -> list:
        if self.registry.exists():
            return json.loads(self.registry.read_text())
        return []

    def _save_registry(self, data: list):
        self.registry.write_text(json.dumps(data, indent=2))

    def generate_episode(
        self,
        title: str,
        problem: str,
        solution: str,
        action: str,
        duration_min: int = 30,
    ) -> Dict[str, Any]:
        """
        Generate a complete podcast episode structure.

        Args:
            title: Episode name
            problem: What problem is being solved?
            solution: How is it solved?
            action: What should listeners do next?
            duration_min: Target duration in minutes

        Returns:
            Episode metadata + full script
        """
        episode_id = hashlib.md5(f"{title}{datetime.utcnow().isoformat()}".encode()).hexdigest()[:8]
        slug = title.lower().replace(" ", "-").replace(":", "").replace(",", "")
        filename = f"{episode_id}_{slug}.md"

        script = self._build_script(title, problem, solution, action, duration_min)
        output_path = self.output_dir / filename
        output_path.write_text(script, encoding="utf-8")

        metadata = {
            "episode_id": episode_id,
            "title": title,
            "slug": slug,
            "filename": filename,
            "path": str(output_path),
            "brand": self.brand,
            "founder": self.founder,
            "site": self.site,
            "duration_minutes": duration_min,
            "problem": problem,
            "solution": solution,
            "action": action,
            "created_at": datetime.utcnow().isoformat() + "Z",
            "status": "ready_for_recording",
            "revenue_model": "30-Day AI Content System (₦22,000 Paystack)",
            "gate": "member_dashboard",
            "public_teaser_available": True,
        }

        registry = self._load_registry()
        registry.append(metadata)
        self._save_registry(registry)

        return metadata

    def _build_script(self, title: str, problem: str, solution: str, action: str, duration_min: int) -> str:
        """Build a complete podcast script."""
        words_per_minute = 140  # conversational pace
        target_words = duration_min * words_per_minute

        script = f"""# {title}

**Brand:** {self.brand}
**Founder:** {self.founder}
**Duration:** ~{duration_min} minutes
**Gate:** Member-only (paid access via {self.site}/offers.html)

---

## OPENING (1 minute)

**HOST:** [Warm greeting]

Hello, I'm {self.founder} from {self.brand}. Today we're tackling a real problem: {problem[:80]}...

If you've ever struggled with this, stick around. We're going to walk through exactly how to solve it, and what you should do next.

---

## SECTION 1: THE PROBLEM (5 minutes)

**Host monologue:**

{problem}

**Key points to hit:**
- Where this problem shows up
- Why it matters right now
- The cost of not solving it

---

## SECTION 2: THE METHOD (15 minutes)

**Host deep dive:**

{solution}

**Step-by-step breakdown:**
1. First principle
2. Operational application
3. Real-world implementation
4. Measurement and feedback

**Supporting insight:**
The key insight here is practical. This isn't theory. It works because we've applied it.

---

## SECTION 3: YOUR NEXT ACTION ({max(2, duration_min - 22)} minutes)

**Host actionable close:**

{action}

**Specific next steps:**
1. [Action 1]
2. [Action 2]
3. [Action 3]

---

## CLOSING (1 minute)

**Host wrap:**

That's the operating principle. It's not complicated, but it is consistent.

For the full transcript, resources, and follow-up materials, head to {self.site}/member-dashboard.html — this is part of your membership access.

I'm {self.founder} from {self.brand}. Thanks for your time.

---

## METADATA

- **Publish to:** member-dashboard.html (gated access)
- **Public teaser:** 60-second summary + CTA to {self.site}/offers.html
- **Transcript:** Available for members
- **Resources:** See content-output/podcast/{Path(self).__name__}.json
- **Next episode:** [Upcoming]

---

## NOTES FOR PRODUCTION

- Target pace: 140 words/min for conversational tone
- Keep language direct and practical
- No speculation — only verified, operational insights
- Link back to {self.brand} identity in every section
- Record with intro/outro music: ~3 sec each
- Publish with full description and link to membership flow
"""
        return script

    def create_public_teaser(self, episode_id: str, episode_title: str, hook: str) -> str:
        """
        Generate a 60-second public teaser + CTA for social/landing pages.
        """
        teaser = f"""# {episode_title} — Teaser

**Brand:** {self.brand}
**Duration:** 60 seconds (public)
**Gate:** Free to hear, full episode in member dashboard

## Teaser Script

{hook}

This is part of our ongoing podcast series where we break down operational systems, practical reasoning, and how to build real business value.

Want the full episode? Head to {self.site}/offers.html to join, or explore our member-only content at {self.site}/member-dashboard.html.

**CTA:** Join {self.brand} and get access to the full Cortex Signals podcast series.

---

## Publishing

- Use on: index.html, media.html, social posts
- Link destination: {self.site}/offers.html
- Format for: LinkedIn, Twitter/X, email, website banner
"""
        return teaser

    def list_episodes(self) -> list:
        """Return all generated episodes from registry."""
        return self._load_registry()

    def export_for_member_dashboard(self, episode_id: str) -> Dict[str, Any]:
        """
        Export episode metadata for injection into member-dashboard.html.
        """
        registry = self._load_registry()
        episode = next((e for e in registry if e["episode_id"] == episode_id), None)
        if not episode:
            raise ValueError(f"Episode {episode_id} not found")

        return {
            "id": episode["episode_id"],
            "title": episode["title"],
            "slug": episode["slug"],
            "description": episode["problem"],
            "path": f"/content-output/podcast/{episode['filename']}",
            "gate": "paystack_access_grant",
            "gate_product": "30-Day AI Content System",
            "gate_price_ngn": 22000,
            "created_at": episode["created_at"],
            "status": episode["status"],
        }


def main():
    """Example: Generate 3 real podcast episodes."""
    agent = PodcastAgent()

    episodes = [
        {
            "title": "Cortex Signals #1: Why Your Platform Isn't a Website",
            "problem": "Most founders treat their online presence as a static website. But platforms are different. They're operational systems that convert trust into revenue. The difference is in the structure.",
            "solution": "A platform has 5 layers: identity, commerce, operations, content, and metrics. When you lock these together, you stop running a website and start running a business. We walk through the Cortex model as a working example.",
            "action": "Audit your site against these 5 layers. Which ones are missing? Start with identity and commerce. Everything else flows from there.",
        },
        {
            "title": "Cortex Signals #2: Content as a Revenue Engine",
            "problem": "You're producing content but not getting paid for it. You're blogging, podcasting, posting — but there's no gate, no membership, no direct revenue. Content becomes overhead instead of profit.",
            "solution": "Invert the model. Create content that teaches, then gate access behind a membership or paid product. Use public teasers to funnel into paid access. Build the content pipeline so that every asset works both publicly and behind the paywall.",
            "action": "Take one piece of content you've created. Build a 60-second public teaser. Link it to an offer. Track conversions. That's your content-to-revenue loop.",
        },
        {
            "title": "Cortex Signals #3: Autonomous Operations at Every Scale",
            "problem": "As you grow, you can't personally handle everything. You need systems that run without you. But building those systems feels impossible if you're already running a business.",
            "solution": "The key is starting with operations documented in your repo. Use agents to automate content, orders, reporting. Build everything as code. When you do, scaling becomes additive instead of exponential.",
            "action": "Document one workflow as code. Make it a function. Automate it. Measure the time saved. That's your first autonomous system.",
        },
    ]

    print(f"\n🎙️  {agent.brand} Podcast Agent")
    print("=" * 60)

    for episode_data in episodes:
        result = agent.generate_episode(**episode_data)
        print(f"\n✓ Episode generated: {result['title']}")
        print(f"  ID: {result['episode_id']}")
        print(f"  File: {result['filename']}")
        print(f"  Gate: {result['gate']}")
        print(f"  Revenue: {result['revenue_model']}")

    print(f"\n\nRegistry ({len(agent.list_episodes())} episodes):")
    print(json.dumps(agent.list_episodes(), indent=2))


if __name__ == "__main__":
    main()
