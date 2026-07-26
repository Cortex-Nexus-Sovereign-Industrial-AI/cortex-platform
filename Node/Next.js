├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated CI/CD deployment
├── api/
│   ├── webhook.js (or .py)      # Single flawless ingress endpoint
│   └── lib/
│       ├── ga4.js               # Google Analytics 4 stream client
│       └── whatsapp.js          # WhatsApp alert client
├── .env.local                   # Sovereign API keys & secrets
└── index.html (or page.js)      # Main homepage root
