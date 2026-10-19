/**
 * Cinis Nexus A18+ Content Layer — Voice Orchestrator
 * Professional Knowledge prioritization · Content generation · Channel deployment
 * under Trusted X-Connected Server (Cortex HRbot)
 */
class CinisNexusContentOrchestrator {
  constructor() {
    this.peerConnection = null;
    this.dataChannel = null;
    this.localStream = null;
    this.statusEl = document.querySelector('#status');
    this.indicator = document.querySelector('#indicator');
    this.startBtn = document.querySelector('#start');
    this.endBtn = document.querySelector('#end');

    this.startBtn.addEventListener('click', () => this.establishSession());
    this.endBtn.addEventListener('click', () => this.terminateSession());
  }

  setStatus(text, state = 'default') {
    this.statusEl.innerHTML = `<span class="dot" id="indicator"></span>${text}`;
    this.indicator = document.querySelector('#indicator');
    this.statusEl.className = state;
    if (state === 'connected') this.indicator.classList.add('live');
  }

  /**
   * Establish WebRTC session with professional knowledge + content pipeline context.
   */
  async establishSession(
    customerId = 'platinum-knowledge-user',
    contextMetadata = {
      layer: 'content',
      priority: 'professional_core_knowledge',
      tier: 'platinum',
      pipelines: ['content-generation', 'channel-deployment'],
      platform: 'cinis-nexus-a18'
    }
  ) {
    try {
      this.startBtn.disabled = true;
      this.setStatus('Negotiating trusted session…');

      console.log('[Cinis Nexus] Requesting ephemeral credentials from X-Connected server…');
      const credentialResponse = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, contextMetadata })
      });

      if (!credentialResponse.ok) throw new Error('Authorization response rejected by trusted server.');
      const payload = await credentialResponse.json();
      const { client_secret } = payload;

      if (!client_secret) throw new Error('No client_secret returned from content-layer server.');

      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      this.peerConnection.ontrack = (event) => {
        let remoteAudio = document.querySelector('#assistant-audio');
        if (!remoteAudio) {
          remoteAudio = document.createElement('audio');
          remoteAudio.id = 'assistant-audio';
          remoteAudio.autoplay = true;
          document.body.appendChild(remoteAudio);
        }
        remoteAudio.srcObject = event.streams[0];
        console.log('[Cinis Nexus] Remote knowledge stream attached.');
      };

      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.localStream.getTracks().forEach(track =>
        this.peerConnection.addTrack(track, this.localStream)
      );

      this.dataChannel = this.peerConnection.createDataChannel('oai-events');
      this.registerDataPlaneListeners();

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      console.log('[Cinis Nexus] SDP handshake with Realtime gateway…');
      const openAiSdpResponse = await fetch(
        'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview',
        {
          method: 'POST',
          body: offer.sdp,
          headers: {
            'Authorization': `Bearer ${client_secret}`,
            'Content-Type': 'application/sdp'
          }
        }
      );

      if (!openAiSdpResponse.ok) {
        const errText = await openAiSdpResponse.text();
        throw new Error(`Upstream SDP validation failure: ${errText}`);
      }

      const remoteSdpText = await openAiSdpResponse.text();
      await this.peerConnection.setRemoteDescription({
        type: 'answer',
        sdp: remoteSdpText
      });

      this.setStatus('Live · Professional Knowledge Priority ON', 'connected');
      this.endBtn.classList.add('visible');
      console.log('[Cinis Nexus] Content Layer voice pipeline online. Platinum tier active.');

    } catch (fault) {
      console.error('[Cinis Nexus Critical Fault]:', fault);
      this.setStatus(`Error: ${fault.message}`, 'error');
      this.startBtn.disabled = false;
      this.terminateSession();
    }
  }

  registerDataPlaneListeners() {
    this.dataChannel.addEventListener('open', () => {
      console.log('[Data Plane] Content-layer command channel open.');
    });

    this.dataChannel.addEventListener('message', (event) => {
      try {
        const serverEvent = JSON.parse(event.data);
        console.log('[Realtime Event]', serverEvent.type, serverEvent);

        if (serverEvent.type === 'response.function_call_arguments.done') {
          this.handleToolExecution(serverEvent);
        }
      } catch (e) {
        console.warn('Non-JSON data channel message', event.data);
      }
    });
  }

  /**
   * Tool execution surface for the content layer.
   * In production these would call CORTEX_API_BASE / CINIS_NEXUS_API_BASE / CHANNEL_DEPLOY_WEBHOOK.
   */
  async handleToolExecution(event) {
    const name = event.name;
    const argsString = event.arguments;
    const args = typeof argsString === 'string' ? JSON.parse(argsString) : argsString;

    console.log(`[Content Layer Tool] ${name}`, args);

    switch (name) {
      case 'escalate_to_human':
        console.warn(`[Escalation] ${args.priority}: ${args.reason}`);
        this.setStatus(`Escalating to human (${args.priority})…`, 'error');
        // Optional: POST to HUMAN_ESCALATION_WEBHOOK via your backend
        break;

      case 'generate_content_outline':
        console.log('[Pipeline] Content outline requested → professional knowledge priority', args);
        this.setStatus('Generating content outline (professional knowledge)…', 'connected');
        // In production: forward to content pipeline API then return result via data channel
        break;

      case 'query_professional_knowledge':
        console.log('[Knowledge] Query:', args);
        this.setStatus('Querying professional core knowledge…', 'connected');
        // In production: hit CORTEX_API_BASE / knowledge endpoints
        break;

      case 'deploy_content_channel':
        console.log('[Deployment] Channel package:', args);
        this.setStatus(`Preparing channel deploy: ${ (args.channels || []).join(', ') }`, 'connected');
        // In production: POST to CHANNEL_DEPLOY_WEBHOOK / CINIS_NEXUS_API_BASE
        break;

      default:
        console.log('[Tool] Unhandled tool', name, args);
    }
  }

  terminateSession() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.dataChannel = null;
    this.setStatus('Session ended · Knowledge Priority ON');
    this.startBtn.disabled = false;
    this.endBtn.classList.remove('visible');
    console.log('[Cinis Nexus] Voice content layer shut down cleanly.');
  }
}

// Boot the Professional Knowledge Content Layer
new CinisNexusContentOrchestrator();
