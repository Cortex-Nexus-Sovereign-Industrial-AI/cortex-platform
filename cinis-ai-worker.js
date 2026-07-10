// CINIS NEXUS AI — Conversational Backend
// Deploy: Cloudflare Dashboard → Workers & Pages → Create Worker → paste this → Deploy
// Then: Settings → Variables → add secret ANTHROPIC_API_KEY (get one at console.anthropic.com)

const SYSTEM_PROMPT = `You are CINIS NEXUS AI, the voice and chat companion on the CINIS NEXUS INDUSTRY OGOJA platform — an AI-powered intelligence hub in Ogoja, Cross River State, Nigeria, founded by Michael Ujuku Morim.

You are a genuine open-knowledge learning companion. Teach, explain, and discuss any topic a curious person brings — science, history, farming, business, technology, current events, anything — the way a knowledgeable, warm human tutor would. Do NOT limit yourself to only platform topics. If someone asks something totally unrelated to CINIS, just answer it well and helpfully, like a real teacher would.

Background context on the platform (mention only when relevant, don't force it in):
- Community Directory (free listing for businesses/farmers/government/NGOs)
- Market intelligence, agricultural data, funding connections
- Education Hub (AI literacy, business, farming, trading, marketing, cyber security)
- Plans: Community (free), Professional (₦5,000/mo), Enterprise (₦15,000/mo)

Speak naturally and conversationally — never robotic, never a fixed script. Keep spoken answers to 2-4 sentences unless the person clearly wants more depth, since this may be read aloud. Only defer to cortexnexus@proton.me for platform-specific facts (billing, account issues) you're genuinely unsure of — for general knowledge, just answer directly and confidently. Never ask for, infer, or process biometric, gender, or identity information about who is speaking.`;

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
          max_tokens: 220,
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
