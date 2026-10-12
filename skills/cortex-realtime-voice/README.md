# Cortex Realtime Voice Skill (v0.1.1)

Minimal but **runnable** scaffold for a production realtime voice agent.

## Quick start

```bash
cd skills/cortex-realtime-voice
npm install
npm start
```

- WebSocket endpoint: `ws://localhost:8787`
- Health check: `http://localhost:8787/health`
- Optional query param: `?session_id=your-id`

## What works right now

- Session creation & state machine (`LISTENING` → `THINKING` → `SPEAKING`)
- Binary audio frame acknowledgement
- JSON control messages (`input_audio_buffer.commit`, `response.cancel` for barge-in)
- Placeholder response simulation

## Next implementation steps

- [x] Add WebSocket server handler
- [x] Add session / turn state machine
- [ ] Integrate chosen STT streaming client
- [ ] Integrate LLM (OpenAI Realtime API or cascaded STT→LLM→TTS)
- [ ] Integrate TTS streaming
- [ ] Add session store (Redis or in-memory TTL)
- [ ] Add metrics / monitoring hooks
- [ ] Write unit + latency tests

## Message protocol (minimal)

**Client → Server**
- Binary frames = audio chunks
- `{ "type": "input_audio_buffer.commit" }` – user finished speaking
- `{ "type": "response.cancel" }` – barge-in

**Server → Client**
- `{ "type": "session.created", "session": {...} }`
- `{ "type": "state", "state": "THINKING" | "SPEAKING" | "LISTENING" }`
- `{ "type": "response.audio.delta", "text": "..." }` (placeholder)

## Related

- Cortex Pulse YouTube Monitor
- Enterprise registry: `cortex-enterprise-registry.json`
