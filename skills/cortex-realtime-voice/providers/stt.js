/**
 * STT Provider Stub
 * Replace the body of `transcribe` with a real streaming client
 * (Deepgram, OpenAI Whisper, Azure, etc.)
 */

async function transcribe(audioBuffer, options = {}) {
  // audioBuffer: Buffer of PCM16 / Opus / etc.
  // In production: stream to provider and return final + partial transcripts

  console.log(`[STT] Received ${audioBuffer.length} bytes (placeholder)`);

  // Simulate network + processing latency
  await new Promise((r) => setTimeout(r, 180));

  return {
    text: options.fallbackText || 'Hello, this is a placeholder transcription.',
    isFinal: true,
    confidence: 0.92,
    provider: 'placeholder'
  };
}

module.exports = { transcribe };
