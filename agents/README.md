# Cortex Content Agents

This directory holds the content-agent layer for the Cortex Intelligence Nexus platform.

Purpose:
- generate podcast, documentary, media, and business-intelligence content
- validate content against the canonical brand rules in `IDENTITY.md`
- distribute content into the public site, member dashboard, or metrics layer
- support a monetized content workflow aligned with the repo's business model

## Agent architecture

- `cortex_content_orchestrator.py` = central router and validator
- `podcast-agent/` = scripting, episode plans, and output templates
- `documentary-agent/` = educational and documentary structure generation
- `media-agent/` = social and web-ready conversion assets
- `business-agent/` = reports, insight summaries, and sales enablement

## Gate rules

All generated content must satisfy the repo identity constraints:
- Public name is `Cortex Intelligence Nexus`
- Founder name is `Michael Ujuku Morim`
- The official site is `https://cortex-platforms.netlify.app`
- Lead with problem-to-outcome value and verified operational results
- No unsupported income/follower guarantees
- Content must align with `IDENTITY.md` and `COMMAND_CENTER.md`

## Delivery model

1. Agent creates asset
2. Orchestrator validates against identity rules
3. Content is written to `content-output/`
4. Content is routed to relevant surface:
   - public site pages
   - member dashboard
   - metrics dashboard
   - social-ready templates

## Recommended flow

- Podcast: preview on public site, full episode in member dashboard
- Documentary: educational material in `darktronix`/education flow
- Media: short-form know-how for web + socials
- Business: internal and premium insight reporting

## Example

See `podcast-agent/episode_template.md` for a starter format.
