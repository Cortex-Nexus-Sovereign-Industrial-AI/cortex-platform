<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="IBM-CINIS - Sovereign Endpoint Intelligence Platform by Cortex Intelligence Nexus">
    <title>IBM-CINIS | Cortex Intelligence Nexus Master Core</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        :root {
            --primary: #002b8a;
            --accent: #00f0ff;
            --bg: #03060f;
            --card: #0a1328;
            --text: #d0e6ff;
            --text-muted: #8899bb;
        }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 0;
            line-height: 1.75;
        }
        header {
            background: linear-gradient(135deg, #0a1329, #02050f);
            padding: 7.5rem 2rem 5rem;
            text-align: center;
            position: relative;
        }
        header::after {
            content: '';
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 5px;
            background: linear-gradient(to right, transparent, var(--accent), transparent);
        }
        .cortex { 
            font-size: 1.45rem; 
            color: var(--accent); 
            letter-spacing: 8px; 
            margin-bottom: 0.5rem;
            font-weight: 700;
        }
        h1 { 
            font-size: 3.9rem; 
            margin: 0.3rem 0; 
            letter-spacing: -4px;
            color: #ffffff;
        }
        .tagline { 
            font-size: 1.85rem; 
            max-width: 920px; 
            margin: 1.8rem auto; 
            font-weight: 500;
            color: #a0d4ff;
        }

        .container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }

        .bionic-module {
            background: var(--card);
            border: 2px solid rgba(0, 240, 255, 0.35);
            border-radius: 26px;
            padding: 3.2rem;
            margin: 3rem 0;
            transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
            position: relative;
            overflow: hidden;
        }
        .bionic-module::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, transparent 40%, rgba(0,240,255,0.08) 50%, transparent 60%);
            opacity: 0;
            transition: all 0.6s;
        }
        .bionic-module:hover {
            border-color: var(--accent);
            transform: translateY(-18px) scale(1.02);
            box-shadow: 0 0 50px rgba(0, 240, 255, 0.45);
        }
        .bionic-module:hover::before { opacity: 1; }

        .grid-split {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
            gap: 2.8rem;
        }

        .link-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-radius: 14px;
            background: rgba(255,255,255,0.02);
            margin-bottom: 12px;
            text-decoration: none;
            color: var(--text);
            transition: all 0.3s ease;
            border: 1px solid rgba(0,240,255,0.15);
        }
        .link-item:hover {
            background: rgba(0,240,255,0.09);
            border-color: var(--accent);
            transform: translateX(8px);
        }
        .link-left { display: flex; align-items: center; gap: 16px; }
        .link-icon { font-size: 22px; color: var(--accent); width: 28px; }
        .link-label { font-weight: 600; color: #ffffff; }
        .link-url { font-size: 12.5px; color: var(--text-muted); margin-top: 2px; }
        .action-arrow { color: var(--accent); font-size: 16px; transition: 0.3s; }
        .link-item:hover .action-arrow { transform: scale(1.3); }

        .interactive-btn {
            background: linear-gradient(90deg, var(--primary), #0099ff);
            color: white;
            padding: 1.4rem 4rem;
            border: none;
            border-radius: 60px;
            font-size: 1.25rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 12px 35px rgba(0,240,255,0.3);
            transition: all 0.4s;
            margin: 15px 10px;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }
        .interactive-btn:hover {
            background: var(--accent);
            color: #02050f;
            transform: scale(1.08) translateY(-5px);
        }

        footer {
            text-align: center;
            padding: 5rem 2rem 3rem;
            background: #02050f;
            color: var(--text-muted);
            border-top: 1px solid rgba(0,240,255,0.15);
        }
    </style>
</head>
<body>

    <header>
        <div class="cortex">CORTEX INTELLIGENCE NEXUS</div>
        <h1>IBM-CINIS MASTER NODAL WEB</h1>
        <p class="tagline">The only platform your organization needs. The era of true endpoint sovereignty has arrived.</p>
    </header>

    <div class="container">

        <div class="bionic-module" style="text-align:center;">
            <h2>IBM-CINIS — Singular Flagship Sovereign Intelligence Platform</h2>
            <p style="font-size:1.35rem; max-width:820px; margin:1.8rem auto;">
                The definitive sovereign intelligence platform. AI-native, runtime-governed, and architecturally provable. 
                No compromises. No alternatives.
            </p>
            <p><strong>Tech Preview Live Gateway | Production Phase Active</strong></p>
        </div>

        <div class="bionic-module" style="text-align:center;">
            <h3 style="color:var(--accent);"><i class="fa-brands fa-x-twitter"></i> Official Business Channel on X</h3>
            <a href="https://x.com/mikecomplexai" target="_blank" class="interactive-btn">
                <i class="fa-brands fa-x-twitter"></i> Follow @mikecomplexai – Global Business Channel
            </a>
        </div>

        <div class="grid-split">
            <div>
                <div class="bionic-module">
                    <h3 style="color:var(--accent); margin-top:0;"><i class="fa-solid fa-network-wired"></i> Live Infrastructure Nodes</h3>
                    <a href="https://cinisnio.ai" target="_blank" class="link-item"><div class="link-left"><i class="fa-solid fa-globe link-icon"></i><span class="link-label">Primary Core Domain</span></div><span class="action-arrow">↗</span></a>
                    <a href="https://bit.ly/cortex-platform" target="_blank" class="link-item"><div class="link-left"><i class="fa-solid fa-door-open link-icon"></i><span class="link-label">Main Platform Portal Gateway</span></div><span class="action-arrow">↗</span></a>
                    <a href="https://cortex-platforms.netlify.app" target="_blank" class="link-item"><div class="link-left"><i class="fa-solid fa-cloud-arrow-up link-icon"></i><span class="link-label">Netlify Production Cluster</span></div><span class="action-arrow">↗</span></a>
                    <a href="https://infocinisnio.atlassian.net/jira/projects?types=software%2Cbusiness" target="_blank" class="link-item"><div class="link-left"><i class="fa-brands fa-jira link-icon"></i><span class="link-label">Jira Software & Business Projects</span></div><span class="action-arrow">↗</span></a>
                </div>

                <div class="bionic-module">
                    <h3 style="color:var(--accent); margin-top:0;"><i class="fa-brands fa-pinterest"></i> Sovereign Architecture Blueprint Vault</h3>
                    <a href="https://www.flickr.com/photos/mikecomplexai/" target="_blank" class="link-item"><div class="link-left"><i class="fa-solid fa-image link-icon"></i><span class="link-label">Flickr Infrastructure Blueprints</span></div><span class="action-arrow">↗</span></a>
                </div>
            </div>

            <div>
                <div class="bionic-module">
                    <h3 style="color:var(--accent); margin-top:0;"><i class="fa-solid fa-terminal"></i> Technical Content & Development Hubs</h3>
                    <a href="https://cortex-nexus-sovereign-industrial-ai.github.io/cortex-platform/" target="_blank" class="link-item"><div class="link-left"><i class="fa-brands fa-github link-icon"></i><span class="link-label">GitHub Dev Hub</span></div><span class="action-arrow">↗</span></a>
                    <a href="https://gravatar.com/mikecomplexaicoe" target="_blank" class="link-item"><div class="link-left"><i class="fa-solid fa-id-card link-icon"></i><span class="link-label">Global Hub Profile</span></div><span class="action-arrow">↗</span></a>
                    <a href="https://medium.com/@mikecomplexai" target="_blank" class="link-item"><div class="link-left"><i class="fa-brands fa-medium link-icon"></i><span class="link-label">Medium Technical Deep-Dives</span></div><span class="action-arrow">↗</span></a>
                    <a href="https://youtube.com/@mikecomplexai-i2e" target="_blank" class="link-item"><div class="link-left"><i class="fa-brands fa-youtube link-icon"></i><span class="link-label">Official Video Documentation</span></div><span class="action-arrow">↗</span></a>
                </div>
            </div>
        </div>

        <div class="bionic-module">
            <h3 style="color:var(--accent);"><i class="fa-solid fa-shield-halved"></i> Proprietary & Ownership Information</h3>
            <p><strong>Cortex Intelligence Nexus</strong> is the proprietary owner and developer of IBM-CINIS.</p>
            <p><strong>System Security Architect & Global Owner:</strong> Michael Ujuku Morim (@mikecomplexai)</p>
            <p style="font-size:13px; color:var(--text-muted);">CINIS NEXUS INDUSTRY OGOJA — All Sovereign Rights Reserved © 2026</p>
        </div>

    </div>

    <footer>
        <p>&copy; 2026 CINIS NEXUS INDUSTRY OGOJA. All Sovereign Rights Reserved.</p>
        <p>Global Business Channel: <a href="https://x.com/mikecomplexai" target="_blank" style="color:var(--accent);">x.com/mikecomplexai</a></p>
    </footer>

</body>
</html>
