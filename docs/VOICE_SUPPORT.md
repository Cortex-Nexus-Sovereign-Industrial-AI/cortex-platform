# Cortex Intelligence Nexus — Voice Support

Calm realtime voice agent for customer support, grounded in IDENTITY.md / SSOT.

## Files

| Path | Role |
|------|------|
| `netlify/functions/realtime-client-secret.js` | Issues short-lived OpenAI Realtime client secrets |
| `public/js/voice-support.js` | Browser client (`RealtimeAgent` + `RealtimeSession`) |

## Setup

1. Set Netlify env var **`OPENAI_API_KEY`** (server-only; never commit).
2. Ensure the site can resolve `@openai/agents/realtime` (npm package or bundler).
3. Call from the UI:

```js
import { startVoiceSupport, stopVoiceSupport } from "/js/voice-support.js";

await startVoiceSupport({ userId: "stable-user-id" });
// ... later
await stopVoiceSupport();
```

Endpoint: `POST /.netlify/functions/realtime-client-secret`

## Policy (baked into instructions)

- Approved context only: Ogoja HQ, repair, agro/trader automations, ₦22k AI Content System (Paystack), official contacts.
- Escalate payment disputes, legal/medical, or low-confidence requests to WhatsApp **0901 025 1577** or **cortexnexus@proton.me**.
- Never collect card numbers or PINs over voice.

## Model

`gpt-realtime-2.1` with output voice `marin` (configurable in the function).

## Notes

- Client secrets expire after ~10 minutes (`expires_after.seconds: 600`).
- `OpenAI-Safety-Identifier` is a SHA-256 hash of the optional `userId` (or `anonymous`).
- Replace the anonymous `userId` path with real auth when membership is live.
