/**
 * LLM Provider – OpenAI Chat Completions
 * Requires: OPENAI_API_KEY
 * Falls back to simple rule-based placeholder when key is missing.
 */

const fs = require('fs');
const path = require('path');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

let systemPrompt = 'You are the realtime voice interface of Cortex Intelligence Nexus. Keep answers short and natural for speech.';
try {
  systemPrompt = fs.readFileSync(
    path.join(__dirname, '..', 'system-prompt.md'),
    'utf8'
  );
} catch (_) {}

async function generateOpenAI(messages, options = {}) {
  const model = options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.filter((m) => m.role !== 'system')
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 180
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI LLM error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0]?.message;

  return {
    text: choice?.content?.trim() || '',
    tool_calls: choice?.tool_calls || [],
    provider: 'openai',
    model
  };
}

async function generatePlaceholder(messages) {
  console.log('[LLM:placeholder] generating');
  await new Promise((r) => setTimeout(r, 150));

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const userText = (lastUser?.content || '').toLowerCase();

  let reply = 'I heard you. This is a placeholder response from Cortex Realtime Voice.';
  if (userText.includes('hello') || userText.includes('hi')) {
    reply = 'Hello! How can Cortex Intelligence Nexus help you today?';
  } else if (userText.includes('repair')) {
    reply = 'For electronics repair, please share the device type and the issue you are seeing.';
  } else if (userText.includes('price') || userText.includes('cost')) {
    reply = 'Pricing depends on the specific service. I can connect you with the team for an accurate quote.';
  }

  return {
    text: reply,
    tool_calls: [],
    provider: 'placeholder',
    model: 'placeholder'
  };
}

async function generate(messages, options = {}) {
  if (!OPENAI_API_KEY) {
    console.warn('[LLM] OPENAI_API_KEY not set – using placeholder');
    return generatePlaceholder(messages);
  }
  try {
    return await generateOpenAI(messages, options);
  } catch (err) {
    console.error('[LLM] OpenAI failed, falling back:', err.message);
    return generatePlaceholder(messages);
  }
}

module.exports = { generate, systemPrompt };
