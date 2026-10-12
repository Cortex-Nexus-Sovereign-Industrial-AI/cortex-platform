/**
 * Cortex Realtime Voice – WebSocket Server (v0.2.0)
 * Real providers: Deepgram STT + OpenAI LLM/TTS (via env keys)
 */

require('dotenv').config();

const http = require('http');
const { WebSocketServer } = require('ws');
const sessionStore = require('./session-store');
const { runTurn } = require('./pipeline');

const PORT = process.env.PORT || 8787;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      skill: 'cortex-realtime-voice',
      version: '0.2.0',
      sessions: sessionStore.store.size,
      providers: {
        stt: process.env.DEEPGRAM_API_KEY ? 'deepgram' : 'placeholder',
        llm: process.env.OPENAI_API_KEY ? 'openai' : 'placeholder',
        tts: process.env.OPENAI_API_KEY ? 'openai' : 'placeholder'
      }
    }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const requestedId = url.searchParams.get('session_id');
  const session = sessionStore.getOrCreate(requestedId);

  console.log(`[+] Session connected: ${session.id}`);

  const send = (obj) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(obj));
    }
  };

  send({ type: 'session.created', session: session.toJSON() });

  let audioChunks = [];

  ws.on('message', async (raw) => {
    try {
      if (Buffer.isBuffer(raw) || raw instanceof ArrayBuffer) {
        audioChunks.push(Buffer.from(raw));
        send({ type: 'audio.received', bytes: raw.byteLength || raw.length });
        return;
      }

      const msg = JSON.parse(raw.toString());

      switch (msg.type) {
        case 'input_audio_buffer.append':
          break;

        case 'input_audio_buffer.commit': {
          const fullAudio = Buffer.concat(audioChunks);
          audioChunks = [];

          if (fullAudio.length === 0) {
            send({ type: 'error', message: 'No audio received' });
            return;
          }

          await runTurn(session, fullAudio, send);
          break;
        }

        case 'response.cancel':
          if (session.canBargeIn()) {
            session.setState('LISTENING');
            audioChunks = [];
            send({ type: 'state', state: 'LISTENING', reason: 'barge_in' });
          }
          break;

        case 'session.update':
          send({ type: 'session.updated', session: session.toJSON() });
          break;

        default:
          send({ type: 'error', message: `Unknown message type: ${msg.type}` });
      }
    } catch (err) {
      console.error('Message error:', err);
      send({ type: 'error', message: err.message });
    }
  });

  ws.on('close', () => {
    console.log(`[-] Session closed: ${session.id}`);
  });

  ws.on('error', (err) => {
    console.error(`WebSocket error (${session.id}):`, err.message);
  });
});

server.listen(PORT, () => {
  console.log(`Cortex Realtime Voice v0.2.0 listening on ws://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`STT : ${process.env.DEEPGRAM_API_KEY ? 'Deepgram' : 'placeholder'}`);
  console.log(`LLM : ${process.env.OPENAI_API_KEY ? 'OpenAI' : 'placeholder'}`);
  console.log(`TTS : ${process.env.OPENAI_API_KEY ? 'OpenAI' : 'placeholder'}`);
});
