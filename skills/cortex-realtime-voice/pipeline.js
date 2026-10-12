/**
 * Cascaded Realtime Pipeline: STT → LLM → TTS
 */

const stt = require('./providers/stt');
const llm = require('./providers/llm');
const tts = require('./providers/tts');

async function runTurn(session, audioBuffer, send) {
  // 1. STT
  session.setState('THINKING');
  send({ type: 'state', state: 'THINKING' });

  const transcription = await stt.transcribe(audioBuffer);
  session.addTurn('user', transcription.text);

  send({
    type: 'transcript',
    text: transcription.text,
    isFinal: transcription.isFinal
  });

  // 2. LLM
  const messages = [
    { role: 'system', content: llm.systemPrompt },
    ...session.history.map((t) => ({ role: t.role, content: t.content }))
  ];

  const completion = await llm.generate(messages);
  session.addTurn('assistant', completion.text);

  // 3. TTS
  session.setState('SPEAKING');
  send({ type: 'state', state: 'SPEAKING' });

  const speech = await tts.synthesize(completion.text);

  // Send text first (useful for UI) then audio
  send({
    type: 'response.audio.delta',
    text: completion.text,
    audioBase64: speech.audio.toString('base64'),
    format: speech.format,
    sampleRate: speech.sampleRate
  });

  // Return to listening
  session.setState('LISTENING');
  send({ type: 'state', state: 'LISTENING' });

  return { transcription, completion, speech };
}

module.exports = { runTurn };
