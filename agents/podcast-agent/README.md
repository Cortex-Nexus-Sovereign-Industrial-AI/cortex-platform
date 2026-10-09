# Podcast Agent

This folder holds the podcast workflow for the Cortex Intelligence Nexus platform.

## Goal
Create structured podcast content that can be:
- teased publicly
- released to members
- summarized as social media snippets
- tracked in the metrics dashboard

## Files
- `episode_template.md` = ready-to-use template for episodes

## Operating rules
- All content must remain aligned with `IDENTITY.md`
- Use the official public identity: `Cortex Intelligence Nexus`
- Public snippets must lead with value, not fake promises
- Full episodes can be gated behind the member dashboard / paid flow

## Suggested workflow

1. Research topic and define outcome
2. Write short teaser
3. Build full episode outline
4. Generate Q&A prompts and resource links
5. Save output in `content-output/podcast/`
6. Route to member dashboard or public landing page

## Example data flow

```python
from agents.cortex_content_orchestrator import CortexContentOrchestrator

orchestrator = CortexContentOrchestrator()
result = orchestrator.create_podcast_episode(
    title="Cortex Signals: Startup Operating Systems",
    summary="A practical breakdown of systems, identity, and business value for founders and operators.",
    outline="1. Why operations matter\n2. What a platform actually is\n3. Trust, conversion, and member value"
)
print(result)
```
