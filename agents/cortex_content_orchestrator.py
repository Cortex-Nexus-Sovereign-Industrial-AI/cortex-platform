import json
from pathlib import Path
from datetime import datetime
from typing import Dict, Any


class CortexContentOrchestrator:
    """
    Central orchestrator for content generation and routing within
    Cortex Intelligence Nexus.

    This layer ensures every generated asset respects the repo's identity,
    operating model, and public-facing business rules.
    """

    BRAND_NAME = "Cortex Intelligence Nexus"
    FOUNDER_NAME = "Michael Ujuku Morim"
    SITE_URL = "https://cortex-platforms.netlify.app"
    OUTPUT_ROOT = Path(__file__).resolve().parent.parent / "content-output"

    def __init__(self):
        self.output_root = self.OUTPUT_ROOT
        self.output_root.mkdir(parents=True, exist_ok=True)

    def validate_against_identity(self, content: str, content_type: str) -> bool:
        """
        Minimal validation logic for repo-aligned output.
        This intentionally keeps implementation lightweight and easy to extend.
        """
        if self.BRAND_NAME not in content:
            raise ValueError(f"{content_type} content must reference '{self.BRAND_NAME}'")

        if self.FOUNDER_NAME not in content and content_type in {"podcast", "documentary"}:
            # Founder reference is optional for some public content but recommended.
            # Keep this guard light so generated work remains flexible.
            pass

        if "guaranteed income" in content.lower() or "guaranteed followers" in content.lower():
            raise ValueError("Content cannot promise guaranteed income or follower growth.")

        if "https://cortex-platforms.netlify.app" not in content and content_type in {"public", "offer"}:
            # Public-facing assets should point to the canonical site when relevant.
            pass

        return True

    def write_asset(self, content_type: str, filename: str, content: str) -> Path:
        target_dir = self.output_root / content_type
        target_dir.mkdir(parents=True, exist_ok=True)
        target_path = target_dir / filename
        target_path.write_text(content, encoding="utf-8")
        return target_path

    def route_to_surface(self, content_type: str, filename: str, content: str, surface: str = "member") -> Dict[str, Any]:
        self.validate_against_identity(content, content_type)
        path = self.write_asset(content_type, filename, content)

        payload = {
            "content_type": content_type,
            "filename": filename,
            "surface": surface,
            "created_at": datetime.utcnow().isoformat() + "Z",
            "path": str(path),
            "brand": self.BRAND_NAME,
            "site": self.SITE_URL,
        }

        metrics_path = self.output_root / "metrics.json"
        if metrics_path.exists():
            metrics = json.loads(metrics_path.read_text(encoding="utf-8"))
        else:
            metrics = []

        metrics.append({
            "content_type": content_type,
            "filename": filename,
            "surface": surface,
            "created_at": payload["created_at"],
        })
        metrics_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")

        return payload

    def create_podcast_episode(self, title: str, summary: str, outline: str) -> Dict[str, Any]:
        content = f"""# {title}

**Brand:** {self.BRAND_NAME}
**Site:** {self.SITE_URL}

## Summary
{summary}

## Episode Outline
{outline}

## Delivery Notes
- Format for public teaser and gated member access
- Keep identity and business positioning aligned with `IDENTITY.md`
- Ensure any links point to approved surfaces only
"""
        filename = f"{title.lower().replace(' ', '_')}.md"
        return self.route_to_surface("podcast", filename, content, surface="member")

    def create_documentary_outline(self, title: str, thesis: str, sections: str) -> Dict[str, Any]:
        content = f"""# {title}

**Brand:** {self.BRAND_NAME}

## Thesis
{thesis}

## Structure
{sections}

## Audience Notes
- Designed for education, technical learning, and trusted documentation
- Lead with practical outcomes and verified reasoning
"""
        filename = f"{title.lower().replace(' ', '_')}.md"
        return self.route_to_surface("documentary", filename, content, surface="public")

    def create_media_asset(self, title: str, hook: str, body: str) -> Dict[str, Any]:
        content = f"""# {title}

**Brand:** {self.BRAND_NAME}

## Hook
{hook}

## Body
{body}

## Publishing Note
- Optimized for web, member update, and social-ready snippet distribution
"""
        filename = f"{title.lower().replace(' ', '_')}.md"
        return self.route_to_surface("media", filename, content, surface="public")

    def create_business_report(self, title: str, insight: str, actions: str) -> Dict[str, Any]:
        content = f"""# {title}

**Brand:** {self.BRAND_NAME}

## Insight
{insight}

## Action items
{actions}

## Use case
- Support offer refinement
- Improve member-value framing
- Support platform metrics and delivery decisions
"""
        filename = f"{title.lower().replace(' ', '_')}.md"
        return self.route_to_surface("business", filename, content, surface="member")


if __name__ == "__main__":
    orchestrator = CortexContentOrchestrator()

    sample_episode = orchestrator.create_podcast_episode(
        title="Cortex Signals: Building a Practical Content Engine",
        summary="A practical conversation on content systems, member value, and workflow design for the Cortex platform.",
        outline="1. Why the repo is a business platform\n2. Podcast as trust + education\n3. Member access and premium content\n4. Metrics and optimization",
    )

    sample_media = orchestrator.create_media_asset(
        title="Why the platform matters",
        hook="Content is not just output. It is an operational system for trust, conversion, and member value.",
        body="This archive-based content system aligns brand identity, member value, and public trust under the Cortex Intelligence Nexus model.",
    )

    print(json.dumps({"episode": sample_episode, "media": sample_media}, indent=2))
