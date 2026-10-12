# Cortex Realtime Voice Skill

**ID:** `cortex-realtime-voice`  
**Version:** `0.1.1`  
**Status:** skeleton + runnable WebSocket server  
**Owner:** Cortex Intelligence Nexus  
**Division:** software-platform-enterprise-intelligence  

## Purpose

Provide low-latency, full-duplex voice interaction for Cortex agents.  
Supports streaming speech-to-text → reasoning → text-to-speech with barge-in capability.

## Capabilities (v0.1.1)

- Accept streaming audio input (binary frames)
- Emit streaming audio / text output
- Maintain conversation turn state (`LISTENING` → `THINKING` → `SPEAKING`)
- Support interruption (barge-in)
- Expose simple tool-calling interface for downstream Cortex skills
- Runnable Node.js WebSocket skeleton (`server.js`)

## Quick Start

```bash
cd skills/cortex-realtime-voice
npm install
npm start
# → ws://localhost:8787
```

## Inputs

| Name          | Type     | Required | Description                          |
|---------------|----------|----------|--------------------------------------|
| `audio_chunk` | binary   | yes      | Raw PCM or Opus audio frame          |
| `session_id`  | string   | yes      | Unique conversation session          |
| `config`      | object   | no       | Voice, language, VAD settings        |

## Outputs

| Name            | Type     | Description                              |
|-----------------|----------|------------------------------------------|
| `audio_chunk`   | binary   | Streaming TTS audio                      |
| `transcript`    | string   | Final or partial user transcript         |
| `response_text` | string   | Agent reply text (also spoken)           |
| `state`         | string   | Current turn state                       |
| `tool_calls`    | array    | Any tools the model wants to invoke      |

## Configuration Defaults

See `config.json`.

## Dependencies

- Streaming STT provider (Deepgram / Whisper live / Azure / etc.)
- LLM with streaming + function calling
- Streaming TTS provider (ElevenLabs / Cartesia / Azure / etc.)
- WebSocket or WebRTC transport

## Lifecycle

Follows Cortex connector lifecycle:
`planned → connected → authenticated → tested → production → monitored`
