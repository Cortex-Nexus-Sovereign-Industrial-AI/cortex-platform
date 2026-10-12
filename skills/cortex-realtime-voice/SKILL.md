# Cortex Realtime Voice Skill

**ID:** `cortex-realtime-voice`  
**Version:** `0.2.0`  
**Status:** real-providers-ready  
**Owner:** Cortex Intelligence Nexus  
**Division:** software-platform-enterprise-intelligence  

## Purpose

Low-latency, full-duplex voice interaction for Cortex agents.  
Cascaded pipeline: Deepgram STT → OpenAI LLM → OpenAI TTS with barge-in.

## Providers (v0.2.0)

| Role | Provider | Env Key |
|------|----------|--------|
| STT  | Deepgram nova-2 | `DEEPGRAM_API_KEY` |
| LLM  | OpenAI (gpt-4o-mini) | `OPENAI_API_KEY` |
| TTS  | OpenAI tts-1 | `OPENAI_API_KEY` |

When a key is missing the corresponding provider falls back to a safe placeholder so the skill still starts.

## Quick Start

```bash
cd skills/cortex-realtime-voice
cp .env.example .env   # add your keys
npm install
npm start
```

- WebSocket: `ws://localhost:8787`
- Health: `http://localhost:8787/health` (shows which providers are live)

## Architecture

```
Client ↔→ server.js → session-store
                   ↓
               pipeline.js
            ┌─────────────┐
            │ STT → LLM → TTS │
            └─────────────┘
```
