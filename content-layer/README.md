# Cinis Nexus A18+ Content Layer
### Professional Knowledge Platform · Realtime Voice Interface · Cortex HRbot

**Sovereign Content Generation & Channel Deployment under Trusted X-Connected Server**

This is a scaffolded **content layer** that prioritizes deep professional core knowledge for content generating. It plugs into existing platforms via API pipelines (platinum tier) and supports realtime voice-driven content creation, learning, and multi-channel deployment.

Branded around the Cinis Nexus A18+ Sovereign Core / Shadow-Vault security blueprint:
- Absolute Sovereignty
- Unmatched Data Isolation
- Professional Core Knowledge prioritization
- Content + channel deployment pipelines

## Architecture

```
Browser (Voice UI)  →  Trusted Node/Express Server (X-Connected)  →  OpenAI Realtime (WebRTC)
                              ↓
                    Cortex / Cinis Nexus API Pipelines
                    (professional knowledge · content gen · channel deploy)
```

- Browser never holds the permanent `OPENAI_API_KEY`
- Ephemeral sessions only
- System instructions inject professional knowledge priority + content generation guardrails
- Tools for content outline, knowledge query, channel deployment, escalation

## Quick Start

```bash
cd content-layer
cp .env.example .env          # set OPENAI_API_KEY
npm install
npm start
```

Open **http://localhost:4430** → click **Start Knowledge Session**.

## What this layer does

1. **Learning / Content Layer** — Voice agent is instructed to prioritize deep professional core knowledge and help generate high-signal content.
2. **API Pipelines** — Ready for connection to existing Cortex / Cinis Nexus backends.
3. **Channel Deployment** — Tool surface for deploying content to channels under the trusted server.
4. **Platinum Tier** — Shadow-Vault style isolation flags + professional knowledge priority.
5. **Lived on platform** — shipped under `Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform/content-layer` for every playback and connected run.

## Security (Non-Negotiable)

- Permanent key only on the trusted server
- CORS locked to ALLOWED_ORIGINS
- Ephemeral client_secret only
- Escalation tool for human handoff
- Session teardown cleans media tracks

## Branding Reference

Uses the Cinis Nexus Industry Ogoja — A18+ Core Blueprint visual language (Shadow-Vault, absolute sovereignty, professional core knowledge) as the content platform identity.

**By Cortex HRbot · Cinis Nexus**
