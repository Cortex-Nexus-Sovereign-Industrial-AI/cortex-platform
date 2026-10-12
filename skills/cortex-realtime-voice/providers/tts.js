/**
 * TTS Provider Stub
 * Replace with ElevenLabs, Cartesia, Azure, OpenAI TTS, etc.
 * Should ultimately return streaming audio chunks.
 */

async function synthesize(text, options = {}) {
  console.log(`[TTS] Synthesizing: "${text.slice(0, 60)}..." (placeholder)`);

  await new Promise((r) => setTimeout(r, 150));

  // In real implementation return readable stream or array of PCM/Opus frames.
  // For the skeleton we return a tiny silent-ish buffer + the text.
  const fakeAudio = Buffer.alloc(320); // 10 ms of silence at 16 kHz mono 16-bit

  return {
    audio: fakeAudio,
    text,
    format: 'pcm16',
    sampleRate: 16000,
    provider: 'placeholder'
  };
}

module.exports = { synthesize };
