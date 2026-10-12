/**
 * Cortex Realtime Voice – Minimal WebSocket Server Skeleton
 * Listens for audio frames, manages sessions, and echoes state.
 * Replace the placeholder STT / LLM / TTS sections with real providers.
 */

const http = require('http');
const { WebSocketServer } = require('ws');
const { VoiceSession } = require('./session');

const PORT = process.env.PORT || 8787;
const sessions = new Map();

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', skill: 'cortex-realtime-voice', version: '0.1.1' }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const sessionId = url.searchParams.get('session_id') || null;

  let session = sessionId && sessions.get(sessionId);
  if (!session) {
    session = new VoiceSession(sessionId);
    sessions.set(session.id, session);
  }

  console.log(`[+] Session connected: ${session.id}`);

  // Send initial state
  ws.send(JSON.stringify({
    type: 'session.created',
    session: session.toJSON()
  }));

  ws.on('message', async (raw) => {
    try {
      // Expect either binary audio or JSON control messages
      if (Buffer.isBuffer(raw) || raw instanceof ArrayBuffer) {
        // === PLACEHOLDER: STT ===
        // In production: stream this chunk to Deepgram / Whisper / etc.
        // For now we just acknowledge receipt.
        ws.send(JSON.stringify({
          type: 'audio.received',
          bytes: raw.byteLength || raw.length,
          state: session.state
        }));
        return;
      }

      const msg = JSON.parse(raw.toString());

      switch (msg.type) {
        case 'input_audio_buffer.append':
          // Client is sending audio (already handled above if binary)
          break;

        case 'input_audio_buffer.commit':
          // User finished speaking → move to THINKING
          session.setState('THINKING');
          ws.send(JSON.stringify({ type: 'state', state: 'THINKING' }));

          // === PLACEHOLDER: LLM + TTS ===
          // 1. Run STT on buffered audio
          // 2. Call LLM with transcript + history
          // 3. Stream TTS audio back
          // For skeleton we simulate a short reply
          setTimeout(() => {
            session.setState('SPEAKING');
            ws.send(JSON.stringify({
              type: 'response.audio.delta',
              // In real impl this would be binary audio frames
              text: 'This is a placeholder response from Cortex Realtime Voice.',
              state: 'SPEAKING'
            }));

            setTimeout(() => {
              session.setState('LISTENING');
              ws.send(JSON.stringify({ type: 'state', state: 'LISTENING' }));
            }, 1500);
          }, 400);
          break;

        case 'response.cancel':
          // Barge-in
          if (session.canBargeIn()) {
            session.setState('LISTENING');
            ws.send(JSON.stringify({ type: 'state', state: 'LISTENING', reason: 'barge_in' }));
          }
          break;

        case 'session.update':
          // Allow client to update config (voice, language, etc.)
          ws.send(JSON.stringify({ type: 'session.updated', session: session.toJSON() }));
          break;

        default:
          ws.send(JSON.stringify({ type: 'error', message: `Unknown message type: ${msg.type}` }));
      }
    } catch (err) {
      console.error('Message error:', err);
      ws.send(JSON.stringify({ type: 'error', message: err.message }));
    }
  });

  ws.on('close', () => {
    console.log(`[-] Session closed: ${session.id}`);
    // Optional: keep session for a short TTL instead of deleting immediately
    // sessions.delete(session.id);
  });

  ws.on('error', (err) => {
    console.error(`WebSocket error (${session.id}):`, err.message);
  });
});

server.listen(PORT, () => {
  console.log(`Cortex Realtime Voice skill listening on ws://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
