# Cortex AI Nexus — LIVE STATUS

**Updated:** 2026-08-10  
**Product:** Cortex AI Nexus (cortex-platform)  
**Founder GitHub:** mikecomplexai-7

## Identity

- Enterprise: [docs/product/CORTEX_AI_NEXUS.md](./docs/product/CORTEX_AI_NEXUS.md)
- Architecture: [docs/product/TECHNICAL_OVERVIEW_ARCHITECTURE.md](./docs/product/TECHNICAL_OVERVIEW_ARCHITECTURE.md)
- Edge CBF: [edge/cbf/](./edge/cbf/)

## Health

| Component | State |
|-----------|--------|
| Enterprise description | Repo + app |
| Technical architecture | Repo + app |
| Edge ActuatorCBFSolver | **Source pushed** (`edge/cbf/`) — compile on robot/host |
| App shell | Netlify (clear-cache deploy if needed) |
| Paystack webhook | Ready after green Netlify deploy |

## Note on “deploy” for CBF

CBF C++ is **not** deployed via Netlify. Build on a machine with Eigen + OSQP (see `edge/cbf/README.md`).
