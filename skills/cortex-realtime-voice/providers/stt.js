/**
 * STT Provider – Deepgram (nova-2)
 * Requires: DEEPGRAM_API_KEY
 * Falls back to placeholder when key is missing.
 */

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

async function transcribeDeepgram(audioBuffer, options = {}) {
  const language = options.language || 'en';
  const model = options.model || 'nova-2';

  const url = `https://api.deepgram.com/v1/listen?model=${model}&language=${language}&smart_format=true&punctuate=true`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Token ${DEEPGRAM_API_KEY}`,
      'Content-Type': 'audio/wav' // works for raw pcm too if header is set correctly; adjust if needed
    },
    body: audioBuffer
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Deepgram error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const alt = data?.results?.channels?.[0]?.alternatives?.[0];

  return {
    text: alt?.transcript || '',
    isFinal: true,
    confidence: alt?.confidence ?? 0,
    provider: 'deepgram',
    model
  };
}

async function transcribePlaceholder(audioBuffer, options = {}) {
  console.log(`[STT:placeholder] ${audioBuffer.length} bytes`);
  await new Promise((r) => setTimeout(r, 120));
  return {
    text: options.fallbackText || 'Hello, this is a placeholder transcription.',
    isFinal: true,
    confidence: 0.9,
    provider: 'placeholder'
  };
}

async function transcribe(audioBuffer, options = {}) {
  if (!DEEPGRAM_API_KEY) {
    console.warn('[STT] DEEPGRAM_API_KEY not set – using placeholder');
    return transcribePlaceholder(audioBuffer, options);
  }
  try {
    return await transcribeDeepgram(audioBuffer, options);
  } catch (err) {
    console.error('[STT] Deepgram failed, falling back:', err.message);
    return transcribePlaceholder(audioBuffer, options);
  }
}

module.exports = { transcribe };
