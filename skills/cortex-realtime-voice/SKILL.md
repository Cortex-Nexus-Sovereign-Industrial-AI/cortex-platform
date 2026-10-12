# Cortex Realtime Voice Skill

**ID:** `cortex-realtime-voice`  
**Version:** `0.1.2`  
**Status:** modular runnable skeleton  
**Owner:** Cortex Intelligence Nexus  
**Division:** software-platform-enterprise-intelligence  

## Purpose

Low-latency, full-duplex voice interaction for Cortex agents.  
Cascaded pipeline: streaming STT → LLM → TTS with barge-in.

## Capabilities (v0.1.2)

- WebSocket server with binary audio + JSON control messages
- Session store with sliding TTL
- Modular providers (`providers/stt.js`, `llm.js`, `tts.js`)
- Cascaded turn pipeline (`pipeline.js`)
- Turn state machine (`LISTENING` → `THINKING` → `SPEAKING`)
- Barge-in support

## Quick Start

```bash
cd skills/cortex-realtime-voice
npm install
npm start
# ws://localhost:8787
```

## Architecture

```
Client  ↔→  server.js  →  session-store
                     ↓
                 pipeline.js
              ┌─────────────┐
              │  STT → LLM → TTS  │
              └─────────────┘
```

## Lifecycle

`planned → connected → authenticated → tested → production → monitored`
