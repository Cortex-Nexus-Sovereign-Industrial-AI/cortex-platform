# Cortex Realtime Voice Skill (Skeleton)

Minimal scaffold for a production realtime voice agent.

## Quick start (local)

1. Copy this folder into your skills directory.
2. Replace the three `placeholder` providers in `config.json` with real credentials.
3. Wire the skill to a WebSocket endpoint that accepts audio frames and returns audio frames.
4. Activate in the Cortex connector lifecycle.

## Next implementation steps

- [ ] Add WebSocket server handler
- [ ] Integrate chosen STT streaming client
- [ ] Integrate LLM (OpenAI Realtime API or cascaded STT→LLM→TTS)
- [ ] Integrate TTS streaming
- [ ] Add session store (Redis or in-memory)
- [ ] Add metrics / monitoring hooks
- [ ] Write unit + latency tests

## Related

- Cortex Pulse YouTube Monitor (already live)
- Enterprise registry: `cortex-enterprise-registry.json`
