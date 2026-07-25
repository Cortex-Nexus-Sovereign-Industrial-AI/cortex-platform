# Installation Guide

## Prerequisites
- Git
- Python 3.8+
- Node.js (for frontend)
- Netlify account (recommended for hosting)

## Option 1: Netlify (Recommended)
1. Fork this repository
2. Connect to Netlify
3. Set build command: `echo "Static site"`
4. Publish directory: `.`
5. Add environment variables from `.env.example`

## Option 2: Local Development
```bash
git clone https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform.git
cd cortex-platform

python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env

# Run webhook engine
python webhooktriggerengine.py

# Serve frontend
python -m http.server 3000
