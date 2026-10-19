import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Strict origin validation for the trusted x-connected server
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
    : true
}));

/**
 * Cinis Nexus A18+ Content Layer — Ephemeral session endpoint
 * Injects professional knowledge prioritization + content generation pipelines
 * into the realtime voice model. Platinum tier under existing platform.
 */
app.post('/api/session', async (req, res) => {
  try {
    const { customerId, contextMetadata } = req.body || {};

    // Future: fetch live professional knowledge / pipeline state from Cortex / Cinis APIs
    // const knowledgeContext = await fetch(`${process.env.CORTEX_API_BASE}/knowledge`, ...);
    // const pipelineState = await fetch(`${process.env.CINIS_NEXUS_API_BASE}/pipelines`, ...);

    const systemInstructions = `
SYSTEM IDENTITY: You are the Cinis Nexus A18+ Sovereign Core Content Layer Voice Interface, also known as Cortex HRbot Professional Knowledge Agent.
You operate under the trusted x-connected server with Shadow-Vault isolation principles.

MISSION PRIORITY (non-negotiable):
1. Prioritize DEEP PROFESSIONAL CORE KNOWLEDGE at all times.
2. Help the user create, refine, scaffold, and deploy high-signal content.
3. Treat content generating as a learning + pipeline process that can be routed through APIs for channel deployment.
4. Maintain absolute sovereignty of user data and unmatched isolation of context (Shadow-Vault spirit).

OPERATIONAL DOMAINS:
- Professional knowledge synthesis and teaching
- Content outline, draft, and packaging for multi-channel deployment
- API pipeline guidance for content & channel deployment under existing platforms
- Platinum-tier workflow advice (secure, isolated, high-signal)
- Learning layer: turn conversations into reusable knowledge assets

CUSTOMER / SESSION CONTEXT:
- Customer ID: ${customerId || 'ANONYMOUS_PLATINUM'}
- Metadata: ${JSON.stringify(contextMetadata || {})}
- Platinum Tier: ${process.env.PLATINUM_TIER || 'true'}
- Content Pipeline Enabled: ${process.env.CONTENT_PIPELINE_ENABLED || 'true'}

RESPONSE STYLE:
- Clear, high-signal, professional, concise then expandable.
- When generating content, structure it ready for pipeline/channel handoff.
- Never invent private account data; escalate when uncertain or when deep human review is required.
- Reference "A18+ Core", "Shadow-Vault", "professional core knowledge", and "content layer" naturally when relevant.

TOOLS AVAILABLE:
- escalate_to_human: hand off to human when needed
- generate_content_outline: produce structured content outlines prioritizing professional knowledge
- query_professional_knowledge: surface or structure deep professional knowledge topics
- deploy_content_channel: prepare / simulate a content package for channel deployment via API pipeline

ESCALATION: If the user asks for a human, requires privileged actions, or you cannot safely proceed with professional knowledge content, call escalate_to_human immediately.
`.trim();

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview',
        modalities: ['audio', 'text'],
        instructions: systemInstructions,
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        },
        tools: [
          {
            type: 'function',
            name: 'escalate_to_human',
            description: 'Triggers internal escalation when human intervention or privileged review is required.',
            parameters: {
              type: 'object',
              properties: {
                reason: { type: 'string', description: 'Clear summary of why escalation is needed.' },
                priority: { type: 'string', enum: ['standard', 'critical'] }
              },
              required: ['reason', 'priority']
            }
          },
          {
            type: 'function',
            name: 'generate_content_outline',
            description: 'Generates a structured content outline prioritizing deep professional core knowledge, ready for the content generation pipeline and later channel deployment.',
            parameters: {
              type: 'object',
              properties: {
                topic: { type: 'string', description: 'Core professional topic or content goal.' },
                audience: { type: 'string', description: 'Target professional audience.' },
                format: { type: 'string', enum: ['post', 'script', 'thread', 'whitepaper', 'voice-script', 'channel-pack'], description: 'Desired content format.' },
                depth: { type: 'string', enum: ['overview', 'deep', 'platinum'], description: 'Knowledge depth level.' }
              },
              required: ['topic']
            }
          },
          {
            type: 'function',
            name: 'query_professional_knowledge',
            description: 'Retrieves or structures deep professional core knowledge on a subject for the learning / content layer.',
            parameters: {
              type: 'object',
              properties: {
                subject: { type: 'string', description: 'Professional knowledge subject to query or expand.' },
                focus: { type: 'string', description: 'Specific angle (frameworks, best practices, risks, deployment, etc.).' }
              },
              required: ['subject']
            }
          },
          {
            type: 'function',
            name: 'deploy_content_channel',
            description: 'Prepares a content package for channel deployment via the API pipeline under the trusted x-connected server. Simulates or queues platinum-tier deployment.',
            parameters: {
              type: 'object',
              properties: {
                content_id: { type: 'string', description: 'Identifier or title of the content package.' },
                channels: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Target channels (e.g. youtube, linkedin, internal-knowledge-base, voice-feed).'
                },
                notes: { type: 'string', description: 'Deployment notes or pipeline flags.' }
              },
              required: ['content_id', 'channels']
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errorPayload = await response.text();
      console.error('[Cinis Nexus Server] OpenAI session rejection:', errorPayload);
      return res.status(500).json({ error: 'Failed to negotiate upstream session parameters.' });
    }

    const sessionData = await response.json();

    return res.status(200).json({
      client_secret: sessionData.client_secret?.value ?? sessionData.client_secret,
      session_id: sessionData.id,
      platform: 'cinis-nexus-a18-content-layer',
      tier: 'platinum',
      knowledge_priority: true
    });

  } catch (error) {
    console.error('[Cinis Nexus Server Exception]:', error);
    return res.status(500).json({ error: 'Internal system fault during content-layer initialization.' });
  }
});

// Lightweight health / platform info for pipeline checks
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'Cinis Nexus A18+ Content Layer',
    component: 'Trusted X-Connected Server',
    knowledge_priority: process.env.PROFESSIONAL_KNOWLEDGE_PRIORITY === 'true',
    content_pipeline: process.env.CONTENT_PIPELINE_ENABLED === 'true',
    platinum: process.env.PLATINUM_TIER === 'true',
    shadow_vault: process.env.SHADOW_VAULT_ISOLATION === 'true'
  });
});

const PORT = process.env.PORT || 4430;
app.listen(PORT, () => {
  console.log(`[Cinis Nexus A18+ Content Layer] Trusted X-Connected Server online → http://localhost:${PORT}`);
  console.log(`  Professional Knowledge Priority: ON | Content Pipelines: READY | Platinum Tier`);
});
