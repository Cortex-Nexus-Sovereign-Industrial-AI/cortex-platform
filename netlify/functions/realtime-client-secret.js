/**
 * Cortex Intelligence Nexus — Realtime voice client-secret issuer
 * POST /.netlify/functions/realtime-client-secret
 *
 * Issues a short-lived OpenAI Realtime client secret for browser WebRTC.
 * Never exposes OPENAI_API_KEY to the client.
 *
 * Env: OPENAI_API_KEY (required)
 */
const crypto = require("crypto");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
};

const CINIS_VOICE_INSTRUCTIONS = `You are the calm voice support agent for Cortex Intelligence Nexus (CINIS), based in Ogoja, Cross River State, Nigeria.

Approved business context only:
- Legal / public name: Cortex Intelligence Nexus
- Founder: Michael Ujuku Morim
- HQ: Ogoja, Cross River State, Nigeria
- Website: https://cortex-platforms.netlify.app
- Contact: cortexnexus@proton.me · WhatsApp 0901 025 1577
- Google Business: verified listing in Ogoja

Finished work we deliver:
1) Electronics & appliance repair (TV, boards, irons, washers). Diagnosis fee first ₦2,000–₦5,000. Full price agreed before work continues.
2) Agro / trader automations — working systems from ₦15,000 (WhatsApp alerts, tracking, simple monitoring). Payment on or before delivery.
3) 30-Day AI Content System — ₦22,000 via Paystack (https://paystack.shop/pay/cortex-demo).

Style: helpful, diplomatic, culturally sensitive. Speak clearly. Ask one clarifying question at a time. Do not invent prices, policies, or capabilities outside this context.

Escalate to a human (offer WhatsApp 0901 025 1577 or email cortexnexus@proton.me) when:
- The customer wants a binding quote, refund, dispute, or payment exception
- The request is medical, legal, or outside approved services
- You are unsure or confidence is low
- The customer asks for the founder or a senior decision

Never collect card numbers, bank PINs, or passwords over voice. Point payment to Paystack or agreed local methods (cash / Moniepoint / Opay for physical jobs).`;

function hashUserId(id) {
  return crypto.createHash("sha256").update(String(id || "anonymous")).digest("hex");
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { ...CORS, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY not set");
    return json(500, { error: "Voice support is not configured yet." });
  }

  // Replace with real auth when ready. Must yield a stable user id for safety hashing.
  let userId = "anon";
  try {
    if (event.body) {
      const parsed = JSON.parse(event.body);
      if (parsed && parsed.userId) userId = String(parsed.userId).slice(0, 128);
    }
  } catch (_)
  {
    /* ignore bad JSON; stay anonymous */
  }

  const safetyId = hashUserId(userId);

  try {
    const upstream = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Safety-Identifier": safetyId,
      },
      body: JSON.stringify({
        expires_after: { anchor: "created_at", seconds: 600 },
        session: {
          type: "realtime",
          model: "gpt-realtime-2.1",
          instructions: CINIS_VOICE_INSTRUCTIONS,
          audio: {
            output: { voice: "marin" },
          },
        },
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      console.error("OpenAI client_secrets error", upstream.status, detail.slice(0, 400));
      return json(502, { error: "Unable to create realtime session" });
    }

    const data = await upstream.json();
    const clientSecret = data.value ?? data.client_secret?.value ?? data.client_secret;

    if (!clientSecret) {
      console.error("No client secret in OpenAI response", Object.keys(data || {}));
      return json(502, { error: "Unable to create realtime session" });
    }

    return json(200, {
      client_secret: clientSecret,
      expires_at: data.expires_at ?? null,
    });
  } catch (err) {
    console.error("realtime-client-secret handler error", err);
    return json(500, { error: "Internal server error" });
  }
};
