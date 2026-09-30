/**
 * Cortex Intelligence Nexus — browser voice support client
 * Requires: @openai/agents/realtime (or CDN equivalent)
 *
 * Usage:
 *   import { startVoiceSupport, stopVoiceSupport } from "/js/voice-support.js";
 *   await startVoiceSupport();
 */

import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";

const AGENT_INSTRUCTIONS = `Be helpful, diplomatic, and culturally sensitive.
You represent Cortex Intelligence Nexus in Ogoja, Cross River State, Nigeria.
Use only approved business context (repair, agro/trader automations, 30-Day AI Content System, official contacts).
Escalate to WhatsApp 0901 025 1577 or cortexnexus@proton.me when confidence, policy, payment, or customer impact requires a human.`;

const agent = new RealtimeAgent({
  name: "CINISCustomerSupportVoice",
  instructions: AGENT_INSTRUCTIONS,
});

const session = new RealtimeSession(agent, {
  model: "gpt-realtime-2.1",
});

let connected = false;

/**
 * Start a WebRTC voice session using an ephemeral client secret from Netlify.
 * @param {{ userId?: string }} [opts]
 */
export async function startVoiceSupport(opts = {}) {
  if (connected) return session;

  const res = await fetch("/.netlify/functions/realtime-client-secret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: opts.userId || undefined }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Could not start voice session");
  }

  const { client_secret } = await res.json();
  if (!client_secret) throw new Error("Missing client secret");

  await session.connect({ apiKey: client_secret });
  connected = true;
  return session;
}

export async function stopVoiceSupport() {
  if (!connected) return;
  try {
    if (typeof session.close === "function") await session.close();
    else if (typeof session.disconnect === "function") await session.disconnect();
  } finally {
    connected = false;
  }
}

export function getVoiceSession() {
  return connected ? session : null;
}
