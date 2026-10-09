# Content Output

This directory stores generated content before it is routed to a public, member, or analytics surface.

## Suggested layout

```text
content-output/
├── podcast/
├── documentary/
├── media/
├── business/
├── metrics.json
└── README.md
```

## Purpose
This folder is the staging ground for content workflows. Use it to keep content organized before it is injected into a live surface or a member dashboard.

## Workflow
1. Agent writes asset here
2. Orchestrator validates it
3. Asset is assigned a public or member route
4. Metrics are logged for tracking and optimization
