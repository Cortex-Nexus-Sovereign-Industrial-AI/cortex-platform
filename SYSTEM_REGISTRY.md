# Cortex Intelligence Nexus — Unified System Registry

Registry date: 2026-10-07
Purpose: One operational map for identity, source control, deployment, public discovery, lead capture, and external connectors.
Authority: This file is the operational registry; identity naming remains governed by IDENTITY.md.

## 1. Canonical architecture

Cortex Intelligence Nexus (parent / core service platform)
  └── DARKTRONIX 9V LABS (child / practical delivery + technical coaching)
        ├── GitHub canonical repository
        ├── Netlify primary public host
        ├── Google Business / Windsor
        ├── YouTube and community layer
        └── Magnetly lead-generation layer

## 2. Source-of-truth rules

| System | Canonical role | State |
|---|---|---|
| GitHub | Source/control + documentation | CANONICAL |
| Netlify | Production hosting/runtime | CANONICAL HOST DECLARED; connector reconciliation required |
| Google Business / Windsor | External discovery and local identity | CONNECTED |
| Magnetly | Lead-generation experience | CONNECTED / 1 published magnet |
| YouTube | Education, demonstrations and community | DOCUMENTED; direct connector not verified here |
| Social channels | Distribution/discovery | DOCUMENTED; connection must be proven per channel |

## 3. GitHub

Canonical repository: Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform
Default branch: main
Current verified repository head: f20cbbdd8d2b77d495eb04a5798987ad8fbc3844
Permissions: admin / maintain / push confirmed.

### Non-canonical repository to treat carefully

mikecomplexai-7/cortex-platforms exists and is accessible, but it is not the canonical repository. It contains older/contradictory deployment and identity material. Do not use it as production authority unless deliberately migrated.

## 4. Netlify

Declared canonical public host: https://cortex-platforms.netlify.app

The canonical repository's netlify.toml and status documents consistently declare this host.

### Connector observation — important

The connected Netlify account currently exposes a project named cortex-intelligence-nexus at https://cortex-intelligence-nexus.netlify.app.

Its inspected production deploy is ready, but that deploy was built from the canonical organization repository at older commit ba3c358bce0321cbac15572de262a87286a1aeec.

This does not prove that cortex-intelligence-nexus.netlify.app and cortex-platforms.netlify.app are the same production site.

The canonical cortex-platforms.netlify.app project was not returned by the current Netlify project search. Therefore: do not rename, repoint, delete, or redeploy the exposed cortex-intelligence-nexus project merely to make names match. First reconcile the actual production site/account connection.

## 5. Google Business / Windsor

### Cortex Intelligence Nexus
- Location: locations/15048379435623385179
- Category: Software company
- Website: https://cortex-platforms.netlify.app/
- Voice of Merchant: true
- Pending edits: true
- Maps: https://maps.google.com/maps?cid=2073161413550473641
- Review link: https://search.google.com/local/writereview?placeid=ChIJu_fwtQXAO6gRqQG5UFJZxRw

Safety: no overwrite while pending edits are true.

### DARKTRONIX 9V LABS
- Location: locations/16777258679302833681
- Category: Electronics repair shop
- Website currently: https://cortex-platforms.netlify.app/
- Voice of Merchant: true
- Pending-edit field: null / not positively reported
- Maps: https://maps.google.com/maps?cid=9919270074575620847
- Review link: https://search.google.com/local/writereview?placeid=ChIJo43efYCVWxAR7wo-CpRTqIk

Architecture: retain separate Google identities; connect them through explicit parent/child language and dedicated destination pages rather than merging profiles.

## 6. Magnetly

Published asset: AI Lead Magnet
Public ID: 27d8d438-80de-4ea9-a13c-6853e4659c86
Status: PUBLISHED
Steps: 4

### Known defect requiring later correction
The magnet's redirection target currently contains a typo:
https://cortex-platfotms.netlify.app

Canonical host:
https://cortex-platforms.netlify.app

This is recorded as a connector/content defect, not silently changed. The current Magnetly connector exposes step-level updates but does not expose a safe general redirection-config update operation. Do not duplicate or republish a second magnet solely to hide this defect without a controlled migration decision.

## 7. YouTube and community layer

Documented channel: https://www.youtube.com/@MikecomplexAI-i2e

Intended function:
- practical teaching
- technical demonstrations
- voice-over education
- repair/diagnostic knowledge
- community building
- directing interested audiences into the Cortex ecosystem

Do not claim API/automation connectivity until a real connector/API health check or successful operation exists.

## 8. Parent/child identity model

### Parent — Cortex Intelligence Nexus
Core service-rendering and intelligence platform:
- AI/digital systems
- education and learning
- consulting/strategy
- automation
- community infrastructure
- customer coordination

### Child — DARKTRONIX 9V LABS
Practical delivery and technical division:
- electronics/appliance repair
- diagnostics and auditing
- technical coaching
- demonstrations
- practical service delivery
- YouTube technical education

The child is associated with, not merged into, the parent.

## 9. Change-control gate

Every public/system change follows:
1. READ — inspect the live connector and repository state.
2. MAP — identify the exact canonical owner of the setting.
3. DIFF — distinguish intentional configuration from drift.
4. BUILD — make the smallest justified change.
5. VALIDATE — test destination, links, identity and runtime.
6. DEPLOY — push through the canonical source.
7. VERIFY — inspect the resulting live state.
8. RECORD — update this registry and STATUS.
9. CONNECT — only then wire the next external system.

### Hard stops
- Do not overwrite Google while a pending edit is active.
- Do not treat a connector's missing/null field as a confirmed false state.
- Do not change a production URL until the target exists and has been validated.
- Do not mark a social/API channel connected without a successful real operation.
- Do not commit secrets or API keys.
- Do not use the non-canonical GitHub repository as production authority.

## 10. Next reconciliation order

Gate A — Netlify: identify the actual project serving cortex-platforms.netlify.app and prove its GitHub source/branch relationship.

Gate B — DARKTRONIX: build and validate its dedicated delivery page on the canonical platform before changing its Google website destination.

Gate C — Magnetly: correct the redirect typo through a controlled Magnetly configuration change when supported.

Gate D — YouTube/social: verify each real connection individually and record its health state.

Gate E — Documentation: update this registry and STATUS after every completed gate.

Rule: no connector is considered complete merely because it exists in a dashboard. It is complete only when its source, destination, owner, and successful operation are verified.