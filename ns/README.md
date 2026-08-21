# CINIS JSON-LD Namespace

**Base IRI:** `https://cortex-platforms.netlify.app/ns#`  
**Context document:** [context.jsonld](./context.jsonld)  
**Live URL (after deploy):** https://cortex-platforms.netlify.app/ns/context.jsonld

## Purpose

Sovereign vocabulary for **agentic / MCP / internal graphs**.  
Public SEO identity on `identity.html` continues to use only `https://schema.org`.

## Usage

```json
{
  "@context": "https://cortex-platforms.netlify.app/ns/context.jsonld",
  "@type": "Organization",
  "name": "Cortex Intelligence Nexus",
  "edgeCBF": true,
  "millionsSdk": true,
  "platformVersion": "2.3"
}
```

Or combine with Schema.org explicitly:

```json
{
  "@context": [
    "https://schema.org",
    "https://cortex-platforms.netlify.app/ns/context.jsonld"
  ]
}
```

## CINIS terms (custom)

| Term | Meaning |
|------|--------|
| `edgeCBF` | Edge Control Barrier Function safety kernel |
| `hocbf` | Higher-order CBF variants |
| `millionsSdk` | High-velocity agentic SDK surface |
| `agenticEndpoint` | Agentic API / orchestration endpoint |
| `sovereignOrchestration` | Central multi-agent orchestration layer |
| `iCore` | I-Core industrial knowledge base posture |
| `commandCenter` | Operational command surface |
| `platformVersion` | Platform version string |

Schema.org types and properties are aliased so documents remain interoperable with standard consumers.

## Rule

Do not replace the public `identity.html` Schema.org block with this context for SEO. Use this namespace for internal and agent-facing structured data only.
