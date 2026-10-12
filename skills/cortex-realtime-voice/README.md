# Cortex Realtime Voice Skill (v0.2.0)

Realtime voice agent for Cortex Intelligence Nexus with **real providers**.

## Providers

| Component | Service | Required env |
|-----------|---------|--------------|
| STT | Deepgram (`nova-2`) | `DEEPGRAM_API_KEY` |
| LLM | OpenAI Chat | `OPENAI_API_KEY` |
| TTS | OpenAI TTS (`tts-1`) | `OPENAI_API_KEY` |

Missing keys → automatic fallback to placeholders (skill still boots).

## Quick start

```bash
cd skills/cortex-realtime-voice
cp .env.example .env
# edit .env with real keys
npm install
npm start
```

Health check reports active providers:
```bash
curl http://localhost:8787/health
```

## Status checklist

- [x] WebSocket server
- [x] Session + state machine
- [x] Session store with TTL
- [x] Modular providers
- [x] Cascaded pipeline
- [x] Real STT (Deepgram)
- [x] Real LLM (OpenAI)
- [x] Real TTS (OpenAI)
- [ ] Streaming STT (live partials)
- [ ] Metrics & monitoring
- [ ] Unit + latency tests

## Message protocol

**Client → Server**
- Binary frames = audio chunks (PCM preferred)
- `{ "type": "input_audio_buffer.commit" }` – end of user turn
- `{ "type": "response.cancel" }` – barge-in

**Server → Client**
- `session.created`
- `transcript`
- `state` (`THINKING` \| `SPEAKING` \| `LISTENING`)
- `response.audio.delta` (text + base64 PCM audio)

## Notes on audio format

Deepgram accepts many formats. For best results send 16-bit PCM or WAV.  
OpenAI TTS returns 24 kHz PCM16 when `response_format: "pcm"` is used.

## Related

- Cortex Pulse YouTube Monitor
- Enterprise registry
