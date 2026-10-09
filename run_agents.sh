#!/bin/bash

# Cortex Content Agents — Autonomous Activation Script
# Generates podcast content, manages access grants, and tracks metrics

set -e

echo ""
echo "🚀 Cortex Intelligence Nexus — Agent Activation"
echo "================================================"
echo ""

echo "1️⃣  Generating podcast episodes..."
cd agents/
python3 podcast_agent.py
echo ""

echo "2️⃣  Testing member gate router..."
python3 member_gate_router.py
echo ""

echo "3️⃣  Tracking metrics and health status..."
python3 metrics_tracker.py
echo ""

echo "✅ Agent activation complete!"
echo ""
echo "Next steps:"
echo "  1. Review generated podcast scripts in /content-output/podcast/"
echo "  2. Record first episode"
echo "  3. Create public teaser"
echo "  4. Push public teaser + CTA to social"
echo "  5. Monitor conversions in Platform Pulse"
echo ""
echo "View DEPLOYMENT.md for integration checklist."
echo ""
