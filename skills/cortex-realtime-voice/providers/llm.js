/**
 * LLM Provider Stub
 * Swap this for OpenAI Realtime, vLLM, Anthropic, or any streaming chat model.
 */

const fs = require('fs');
const path = require('path');

let systemPrompt = 'You are the realtime voice interface of Cortex Intelligence Nexus.';
try {
  systemPrompt = fs.readFileSync(
    path.join(__dirname, '..', 'system-prompt.md'),
    'utf8'
  );
} catch (_) {}

async function generate(messages, options = {}) {
  console.log(`[LLM] Generating reply for ${messages.length} messages (placeholder)`);

  await new Promise((r) => setTimeout(r, 220));

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const userText = lastUser ? lastUser.content : '';

  // Extremely simple placeholder logic
  let reply = 'I heard you. This is a placeholder response from Cortex Realtime Voice.';
  if (userText.toLowerCase().includes('hello') || userText.toLowerCase().includes('hi')) {
    reply = 'Hello! How can Cortex Intelligence Nexus help you today?';
  } else if (userText.toLowerCase().includes('repair')) {
    reply = 'For electronics repair, please share the device type and the issue you are seeing.';
  }

  return {
    text: reply,
    tool_calls: [],
    provider: 'placeholder',
    model: options.model || 'placeholder'
  };
}

module.exports = { generate, systemPrompt };
