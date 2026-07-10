// CINIS NEXUS AI — Conversational Backend
// Deploy: Cloudflare Dashboard → Workers & Pages → Create Worker → paste this → Deploy
// Then: Settings → Variables → add secret ANTHROPIC_API_KEY (get one at console.anthropic.com)

const SYSTEM_PROMPT = `You are CINIS NEXUS AI, the voice/chat assistant for CINIS NEXUS INDUSTRY OGOJA — an AI-powered intelligence platform in Ogoja, Cross River State, Nigeria, founded by Michael Ujuku Morim.

The platform connects businesses, farmers, government bodies, and NGOs. It offers:
- A Community Directory (free listing for businesses/farmers/government/NGOs)
- Market intelligence, agricultural data, funding connections
- An Education Hub (AI literacy, business, farming, trading, marketing, cyber security)
- Plans: Community (free), Professional (₦5,000/mo), Enterprise (₦15,000/mo)

Speak naturally and professionally, like a helpful local guide — not robotic. Keep answers SHORT (2-3 sentences max, this is spoken aloud). If someone wants to join the directory or subscribe, tell them to say or click the relevant section. Never invent facts about the platform you're unsure of — say you're not certain and suggest they email cortexnexus@proton.me. Never ask for or process any biometric, gender, or identity-inference information about the visitor.`;

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders() });
    }

    try {
      const { message } = await request.json();
      if (!message || typeof message !== 'string' || message.length > 500) {
        return new Response(JSON.stringify({ error: 'Invalid message' }), { status: 400, headers: corsHeaders() });
      }

      const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 150,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: message }]
        })
      });

      const data = await apiRes.json();
      const reply = data?.content?.[0]?.text || "Sorry, I couldn't process that. Try again or email cortexnexus@proton.me.";

      return new Response(JSON.stringify({ reply }), { headers: corsHeaders() });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: corsHeaders() });
    }
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}
