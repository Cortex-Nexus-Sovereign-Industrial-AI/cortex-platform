#!/bin/bash

# Cortex Full Content Cycle — Autonomous Deployment
# Runs the complete pipeline end-to-end
# Total Sovereignty Orchestrating Tomorrow Intelligence

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   CORTEX FULL CONTENT CYCLE — Autonomous Deployment            ║"
echo "║   $(date '+%Y-%m-%d %H:%M:%S')                                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

echo "✓ Checking dependencies..."
command -v python3 &> /dev/null || { echo "Python3 required"; exit 1; }

echo "✓ Running content cycle..."
cd "$(dirname "$0")/agents"
python3 run_full_content_cycle.py

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    ✓ CYCLE COMPLETE                           ║"
echo "║                                                               ║"
echo "║  Next steps:                                                  ║"
echo "║  1. cd backend && npm start                                   ║"
echo "║  2. Open http://localhost:3000/member-dashboard.html         ║"
echo "║  3. Open http://localhost:3000/metrics-dashboard.html        ║"
echo "║  4. Review content-output/DEPLOYMENT_MANIFEST.json           ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
