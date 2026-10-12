# Cortex Realtime Voice Skill (v0.1.2)

Modular, runnable realtime voice skeleton for Cortex Intelligence Nexus.

## Quick start

```bash
cd skills/cortex-realtime-voice
npm install
npm start
```

- WebSocket: `ws://localhost:8787`
- Health: `http://localhost:8787/health`

## Current status

- [x] WebSocket server handler
- [x] Session / turn state machine
- [x] In-memory session store with TTL
- [x] Modular STT / LLM / TTS provider stubs
- [x] Cascaded pipeline (STT → LLM → TTS)
- [ ] Real STT provider (Deepgram / Whisper / Azure…)
- [ ] Real LLM provider (OpenAI Realtime or chat)
- [ ] Real TTS provider (ElevenLabs / Cartesia…)
- [ ] Metrics & monitoring hooks
- [ ] Unit + latency tests

## Message protocol

**Client → Server**
- Binary frames = audio chunks
- `{ "type": "input_audio_buffer.commit" }` – end of user turn
- `{ "type": "response.cancel" }` – barge-in

**Server → Client**
- `session.created`
- `transcript`
- `state` (`THINKING` | `SPEAKING` | `LISTENING`)
- `response.audio.delta` (text + base64 audio placeholder)

## Swapping providers

Edit the files under `providers/`. Each exports a single async function:

- `stt.transcribe(audioBuffer)` → `{ text, isFinal }`
- `llm.generate(messages)` → `{ text, tool_calls }`
- `tts.synthesize(text)` → `{ audio, format, sampleRate }`

## Related

- Cortex Pulse YouTube Monitor
- Enterprise registry
