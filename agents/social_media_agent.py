#!/usr/bin/env python3
"""
Social Media Automation Agent
Publishes podcast teasers and CTAs to LinkedIn, Twitter, email
Integrates with the Cortex content agent system
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List


class SocialMediaAgent:
    """Autonomous social media posting for Cortex podcast content."""

    def __init__(self):
        self.brand = "Cortex Intelligence Nexus"
        self.founder = "Michael Ujuku Morim"
        self.site = "https://cortex-platforms.netlify.app"
        self.offer_link = f"{self.site}/offers.html"
        self.output_dir = Path(__file__).parent.parent / "content-output" / "social"
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def create_linkedin_post(self, episode_title: str, hook: str) -> Dict[str, str]:
        """Create a LinkedIn-optimized post."""
        post = f"""
{hook}

This is from our new podcast series 'Cortex Signals' where we break down:
- Operating systems for trust and revenue
- Content as a business engine
- Autonomous operations at scale
- Identity as competitive advantage
- Metrics that actually matter

Full episode + member-only resources:
{self.offer_link}

#CortexIntelligence #Podcast #BusinessPlatforms #ContentMarketing
        """.strip()

        return {
            "platform": "LinkedIn",
            "content": post,
            "link": self.offer_link,
            "character_count": len(post),
            "optimal_length": "yes" if 100 < len(post) < 3000 else "no"
        }

    def create_twitter_post(self, hook: str, emoji: str = "🎙️") -> Dict[str, str]:
        """Create a Twitter-optimized post (280 chars)."""
        base_text = f"{emoji} {hook} Full episode + member resources: {self.offer_link}"
        
        if len(base_text) <= 280:
            return {
                "platform": "Twitter",
                "content": base_text,
                "link": self.offer_link,
                "character_count": len(base_text),
                "fits_280": True
            }
        else:
            # Shorten for Twitter
            short_text = f"{emoji} {hook[:100]}... {self.offer_link}"
            return {
                "platform": "Twitter",
                "content": short_text,
                "link": self.offer_link,
                "character_count": len(short_text),
                "fits_280": len(short_text) <= 280,
                "note": "Shortened for Twitter character limit"
            }

    def create_email_subject(self, episode_title: str) -> str:
        """Create an email subject line."""
        return f"New: {episode_title} — {self.brand}"

    def create_email_body(self, episode_title: str, hook: str, action: str) -> str:
        """Create an email body with CTA."""
        body = f"""
Hi there,

New podcast episode from {self.brand}:

{episode_title}

{hook}

What you'll learn:
- {action}
- Practical frameworks
- Real operational reasoning

Ready? Join the member community and get access to the full episode:
{self.offer_link}

Price: ₦22,000 (30-day access)
Get instant access to all member content.

Cheers,
{self.founder}
{self.brand}
{self.site}
        """.strip()
        return body

    def publish_episode_social_pack(self, episode: Dict, product: str = "30-Day AI Content System") -> Dict:
        """
        Create a complete social media pack for an episode.
        Ready to post to all channels.
        """
        title = episode.get("title", "New Episode")
        hook = episode.get("problem", "New insight from Cortex")[:100]
        action = episode.get("action", "Learn practical frameworks")

        linkedin_post = self.create_linkedin_post(title, hook)
        twitter_post = self.create_twitter_post(hook, emoji="🎙️")
        email_subject = self.create_email_subject(title)
        email_body = self.create_email_body(title, hook, action)

        pack = {
            "episode_title": title,
            "product": product,
            "posts": {
                "linkedin": linkedin_post,
                "twitter": twitter_post,
                "email": {
                    "subject": email_subject,
                    "body": email_body,
                    "link": self.offer_link
                }
            },
            "publishing_notes": {
                "linkedin": "Post once on LinkedIn, use employee network to amplify",
                "twitter": "Tweet 3x per week at different times for reach",
                "email": "Send to subscriber list after LinkedIn publish"
            },
            "created_at": datetime.utcnow().isoformat() + "Z",
            "offer_link": self.offer_link
        }

        # Save pack
        pack_file = self.output_dir / f"{title.lower().replace(' ', '_')}_social_pack.json"
        pack_file.write_text(json.dumps(pack, indent=2))

        return pack

    def list_episodes_for_posting(self) -> List[str]:
        """List episodes that need social promotion."""
        podcast_dir = Path(__file__).parent.parent / "content-output" / "podcast"
        if not podcast_dir.exists():
            return []

        registry_path = podcast_dir / "registry.json"
        if not registry_path.exists():
            return []

        registry = json.loads(registry_path.read_text())
        return [ep["title"] for ep in registry]


def main():
    """Example: Generate social media packs for existing episodes."""
    agent = SocialMediaAgent()

    print("\n📱 Cortex Social Media Agent")
    print("=" * 60)

    episodes = [
        {
            "title": "Cortex Signals #1: Why Your Platform Isn't a Website",
            "problem": "Most businesses confuse a website with a platform. A website is just decoration.",
            "action": "Build identity, offers, payment, member access, and metrics"
        },
        {
            "title": "Cortex Signals #2: Content as a Revenue Engine",
            "problem": "You produce content but don't get paid for it.",
            "action": "Gate access behind membership, use teasers to funnel to paid access"
        }
    ]

    for episode in episodes:
        print(f"\n📝 Creating social pack for: {episode['title']}")
        pack = agent.publish_episode_social_pack(episode)
        print(f"   ✓ LinkedIn post: {len(pack['posts']['linkedin']['content'])} chars")
        print(f"   ✓ Twitter post: {len(pack['posts']['twitter']['content'])} chars (fits 280: {pack['posts']['twitter']['fits_280']})")
        print(f"   ✓ Email subject: {pack['posts']['email']['subject']}")
        print(f"   ✓ Saved to: content-output/social/")

    print(f"\n\n✅ Social packs ready for publishing.")
    print(f"Next: Review and post to LinkedIn, Twitter, email")


if __name__ == "__main__":
    main()
