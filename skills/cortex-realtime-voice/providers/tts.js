/**
 * TTS Provider – OpenAI TTS
 * Requires: OPENAI_API_KEY
 * Falls back to silent placeholder buffer when key is missing.
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function synthesizeOpenAI(text, options = {}) {
  const model = options.model || 'tts-1';
  const voice = options.voice || process.env.OPENAI_TTS_VOICE || 'alloy';
  const speed = options.speed ?? 1.0;

  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      input: text,
      voice,
      speed,
      response_format: 'pcm' // 24 kHz mono 16-bit
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI TTS error ${res.status}: ${errText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const audio = Buffer.from(arrayBuffer);

  return {
    audio,
    text,
    format: 'pcm16',
    sampleRate: 24000,
    provider: 'openai',
    model,
    voice
  };
}

async function synthesizePlaceholder(text) {
  console.log(`[TTS:placeholder] "${text.slice(0, 50)}..."`);
  await new Promise((r) => setTimeout(r, 80));
  return {
    audio: Buffer.alloc(480), // ~10 ms silence @ 24 kHz
    text,
    format: 'pcm16',
    sampleRate: 24000,
    provider: 'placeholder'
  };
}

async function synthesize(text, options = {}) {
  if (!text || !text.trim()) {
    return synthesizePlaceholder('');
  }
  if (!OPENAI_API_KEY) {
    console.warn('[TTS] OPENAI_API_KEY not set – using placeholder');
    return synthesizePlaceholder(text);
  }
  try {
    return await synthesizeOpenAI(text, options);
  } catch (err) {
    console.error('[TTS] OpenAI failed, falling back:', err.message);
    return synthesizePlaceholder(text);
  }
}

module.exports = { synthesize };
