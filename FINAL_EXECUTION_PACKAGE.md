# FINAL HOMEPAGE HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cortex Intelligence Nexus</title>
    <meta
      name="description"
      content="Cortex Intelligence Nexus helps people unlock practical human potential through AI, technical systems, and smarter digital execution."
    />
    <style>
      :root {
        --bg: #0f172a;
        --panel: #111827;
        --card: #1f2937;
        --primary: #6366f1;
        --accent: #ec4899;
        --text: #f8fafc;
        --muted: #cbd5e1;
        --success: #10b981;
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, Segoe UI, sans-serif;
        background: var(--bg);
        color: var(--text);
        line-height: 1.6;
      }

      a { text-decoration: none; }
      .container {
        width: min(1120px, 90%);
        margin: 0 auto;
      }

      .hero {
        padding: 80px 0 40px;
      }

      .hero-inner {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 40px;
        align-items: center;
      }

      .eyebrow {
        color: var(--primary);
        font-size: 14px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 16px;
      }

      h1 {
        font-size: clamp(2.7rem, 5vw, 5rem);
        line-height: 1.1;
        margin: 0 0 18px;
      }

      .subhead {
        color: var(--muted);
        font-size: 1.1rem;
        max-width: 640px;
      }

      .cta-row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-top: 28px;
      }

      .btn {
        display: inline-block;
        padding: 16px 26px;
        border-radius: 12px;
        font-weight: 700;
        transition: 0.2s ease;
      }

      .btn-primary {
        background: linear-gradient(135deg, var(--primary), var(--accent));
        color: white;
      }

      .btn-secondary {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.2);
        color: var(--text);
      }

      .trust-line {
        margin-top: 24px;
        color: var(--muted);
        font-weight: 600;
      }

      .hero-box {
        background: linear-gradient(180deg, rgba(99, 102, 241, 0.18), rgba(15, 23, 42, 0.4));
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 20px;
        padding: 28px;
      }

      .mini-stat {
        display: flex;
        justify-content: space-between;
        padding: 18px 0;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }

      .mini-stat:last-child {
        border-bottom: none;
      }

      .mini-stat strong {
        font-size: 1.3rem;
      }

      .section {
        padding: 60px 0;
      }

      .section-header {
        margin-bottom: 28px;
      }

      .section-header h2 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 3vw, 3rem);
      }

      .section-header p {
        margin: 0;
        color: var(--muted);
      }

      .value-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 24px;
      }

      .card {
        background: rgba(17,24,39,0.85);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
        padding: 28px 22px;
      }

      .card h3 {
        margin-top: 0;
        font-size: 1.3rem;
      }

      .card p {
        color: var(--muted);
        margin-bottom: 0;
      }

      .proof-panel {
        background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(236,72,153,0.12));
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 24px;
        padding: 40px 28px;
      }

      .offers-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 24px;
      }

      .offer-card {
        background: rgba(17,24,39,0.85);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
        padding: 28px;
      }

      .offer-card h3 {
        margin-top: 0;
      }

      .price {
        font-size: 2rem;
        font-weight: 800;
        margin: 12px 0 16px;
        color: #fff;
      }

      .offer-card p {
        color: var(--muted);
      }

      .cta-banner {
        background: linear-gradient(135deg, rgba(99,102,241,0.24), rgba(15,23,42,0.8));
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,0.08);
        padding: 44px 28px;
        text-align: center;
      }

      footer {
        padding: 44px 0 80px;
        color: var(--muted);
      }

      .footer-grid {
        display: flex;
        justify-content: space-between;
        gap: 30px;
        flex-wrap: wrap;
      }

      @media (max-width: 900px) {
        .hero-inner,
        .value-grid,
        .offers-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <header class="hero">
      <div class="container hero-inner">
        <div>
          <p class="eyebrow">Cortex Intelligence Nexus</p>
          <h1>Reveal what you’re capable of.</h1>
          <p class="subhead">
            We help people unlock practical human potential through AI, technical systems,
            and smarter digital execution.
          </p>
          <div class="cta-row">
            <a class="btn btn-primary" href="#offers">Get Started</a>
            <a class="btn btn-secondary" href="#offers">Explore Offers</a>
          </div>
          <p class="trust-line">Practical AI. Clear systems. Real results.</p>
        </div>

        <div class="hero-box">
          <div class="mini-stat">
            <span>AI systems</span>
            <strong>Practical</strong>
          </div>
          <div class="mini-stat">
            <span>Content systems</span>
            <strong>Useful</strong>
          </div>
          <div class="mini-stat">
            <span>Technical education</span>
            <strong>Clear</strong>
          </div>
          <div class="mini-stat">
            <span>Business leverage</span>
            <strong>Proven</strong>
          </div>
        </div>
      </div>
    </header>

    <main>
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2>What we do</h2>
          </div>
          <div class="value-grid">
            <div class="card">
              <h3>AI for practical growth</h3>
              <p>We use AI to simplify decisions, reduce repetitive work, and improve execution.</p>
            </div>
            <div class="card">
              <h3>Content systems that convert</h3>
              <p>We turn technical knowledge into structured, useful content that builds trust.</p>
            </div>
            <div class="card">
              <h3>Technical education & diagnostics</h3>
              <p>We teach the reasoning behind the technology so people can understand and apply it.</p>
            </div>
            <div class="card">
              <h3>Automation & business systems</h3>
              <p>We build practical systems that make work smarter, faster, and more sustainable.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="proof-panel">
            <h2>Built for clarity, not chaos.</h2>
            <p>
              We focus on practical problem-solving, useful execution, and building systems that create momentum.
            </p>
          </div>
        </div>
      </section>

      <section id="offers" class="section">
        <div class="container">
          <div class="section-header">
            <h2>Choose your next move</h2>
          </div>

          <div class="offers-grid">
            <div class="offer-card">
              <h3>30-Day AI Content System</h3>
              <div class="price">₦22,000</div>
              <p>A structured content system built to help you show up online with clarity and traction.</p>
              <a class="btn btn-primary" href="/offers.html">Get Access</a>
            </div>

            <div class="offer-card">
              <h3>Agro & Trader Automation</h3>
              <div class="price">₦15,000 – ₦50,000</div>
              <p>Practical automation for repetitive work, inventory, alerts, and better daily operations.</p>
              <a class="btn btn-primary" href="/offers.html">Get a Quote</a>
            </div>

            <div class="offer-card">
              <h3>DARKTRONIX Technical Education</h3>
              <div class="price">Tiered Pricing</div>
              <p>Learn the reasoning behind the technology and build confidence through real understanding.</p>
              <a class="btn btn-primary" href="/offers.html">Learn More</a>
            </div>

            <div class="offer-card">
              <h3>Repair & Diagnostics</h3>
              <div class="price">Diagnosis + Repair</div>
              <p>Practical diagnosis, clear recommendations, and a real path to fixing the issue.</p>
              <a class="btn btn-primary" href="/offers.html">Book Diagnosis</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="cta-banner">
            <h2>Ready to unlock your next level?</h2>
            <p>Build the clarity. Build the system. Build the momentum.</p>
            <a class="btn btn-primary" href="/offers.html">Book a Consultation</a>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="container footer-grid">
        <div>
          <strong>Cortex Intelligence Nexus</strong>
          <p>We help people reveal hidden human potential through practical AI, systems, and technical clarity.</p>
        </div>
        <div>
          <p>Email: cortexnexus@proton.me</p>
          <p>WhatsApp: 0901 025 1577</p>
          <p>Website: https://cortex-platforms.netlify.app</p>
        </div>
      </div>
    </footer>
  </body>
</html>
```

---

## Final offers page HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Offers | Cortex Intelligence Nexus</title>
    <style>
      body {
        margin: 0;
        font-family: Inter, Segoe UI, sans-serif;
        background: #0f172a;
        color: #f8fafc;
      }

      .container {
        width: min(1100px, 90%);
        margin: 0 auto;
      }

      .hero {
        padding: 80px 0 40px;
      }

      h1 {
        font-size: clamp(2.4rem, 4vw, 4rem);
        margin: 0 0 16px;
      }

      .eyebrow {
        color: #6366f1;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 12px;
      }

      .lead {
        color: #cbd5e1;
        font-size: 1.08rem;
        max-width: 760px;
      }

      .offer-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 24px;
        padding: 30px 0 60px;
      }

      .offer-card {
        background: rgba(17,24,39,0.8);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
        padding: 28px;
      }

      .offer-card h3 {
        margin-top: 0;
        font-size: 1.6rem;
      }

      .price {
        font-size: 2rem;
        font-weight: 800;
        margin: 12px 0 18px;
      }

      .offer-card ul {
        color: #cbd5e1;
        padding-left: 18px;
      }

      .btn {
        display: inline-block;
        margin-top: 14px;
        padding: 14px 22px;
        border-radius: 12px;
        background: linear-gradient(135deg, #6366f1, #ec4899);
        color: white;
        text-decoration: none;
        font-weight: 700;
      }

      .faq {
        padding: 10px 0 90px;
      }

      .faq-item {
        background: rgba(17,24,39,0.75);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 20px 24px;
        margin-bottom: 18px;
      }

      .faq-item h3 {
        margin-top: 0;
      }

      @media (max-width: 760px) {
        .offer-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <header class="hero">
      <div class="container">
        <p class="eyebrow">Cortex Intelligence Nexus</p>
        <h1>Choose the system that fits your next move.</h1>
        <p class="lead">
          We build practical systems that help people learn, work better, and grow with clarity.
        </p>
      </div>
    </header>

    <main class="container">
      <section class="offer-grid">
        <article class="offer-card">
          <h3>30-Day AI Content System</h3>
          <div class="price">₦22,000</div>
          <p>Structured content system built for clarity and consistency online.</p>
          <ul>
            <li>Structured content system</li>
            <li>AI-assisted content workflow</li>
            <li>Social media-ready assets</li>
            <li>Clearer messaging and better consistency</li>
          </ul>
          <a class="btn" href="/pay.html">Buy now</a>
        </article>

        <article class="offer-card">
          <h3>Agro & Trader Automation</h3>
          <div class="price">₦15,000 – ₦50,000</div>
          <p>Practical solutions for repetitive business workflows and daily operations.</p>
          <ul>
            <li>Workflow automation</li>
            <li>Alert and tracking systems</li>
            <li>WhatsApp / SMS / Spreadsheet integrations</li>
            <li>Setup and handover</li>
          </ul>
          <a class="btn" href="https://wa.me/2349010251577">Get a quote</a>
        </article>

        <article class="offer-card">
          <h3>DARKTRONIX Technical Education</h3>
          <div class="price">Tiered Pricing</div>
          <p>Learn the logic behind the technology and build practical skill.</p>
          <ul>
            <li>Practical education</li>
            <li>Technical reasoning</li>
            <li>Repair logic and diagnostics</li>
            <li>Applied problem-solving</li>
          </ul>
          <a class="btn" href="https://wa.me/2349010251577">Learn more</a>
        </article>

        <article class="offer-card">
          <h3>Technical Diagnosis & Repair</h3>
          <div class="price">Diagnosis + Repair</div>
          <p>Clear diagnosis, practical recommendation, and tested fix path.</p>
          <ul>
            <li>Practical diagnosis</li>
            <li>Clear explanation</li>
            <li>Evidence-based fix recommendation</li>
            <li>Handover and verification</li>
          </ul>
          <a class="btn" href="https://wa.me/2349010251577">Book diagnosis</a>
        </article>
      </section>

      <section class="faq">
        <h2>FAQ</h2>
        <div class="faq-item">
          <h3>Is this for beginners?</h3>
          <p>Yes. We explain the process clearly and build around what is needed.</p>
        </div>
        <div class="faq-item">
          <h3>What do I get exactly?</h3>
          <p>Every offer has a clear scope, outcome, and step-by-step process.</p>
        </div>
        <div class="faq-item">
          <h3>How long does it take?</h3>
          <p>It depends on the offer; digital systems are fast and structured, while service work is scoped before execution.</p>
        </div>
        <div class="faq-item">
          <h3>Do you promise results?</h3>
          <p>We do not promise unrealistic outcomes. We focus on practical systems, clarity, and measurable progress.</p>
        </div>
      </section>
    </main>
  </body>
</html>
```

---

## Final 30-day launch roadmap

### Week 1: Foundation and launch
- finalize homepage copy
- publish offers page
- publish Google Business updates
- publish 7 launch videos across YouTube, TikTok, Reels, and X
- activate WhatsApp CTA links

### Week 2: Content optimization
- identify the best-performing hook
- create 3 follow-up versions of the top content type
- retarget generated traffic with stronger CTA copy
- review offers page conversion behavior

### Week 3: Offer push
- push strongest offer heavily
- add service/product specific CTAs to posts
- collect small case study snippets and review submissions

### Week 4: Performance and optimization
- review conversion metrics
- identify top traffic source
- refine landing page based on user action
- scale the best performing content style

---

## Final product CTA flow

```text
content / discovery → website or WhatsApp → offer page → purchase or quote → access or service delivery
```

### Each CTA should point to one of these actions:
- Get Access
- Buy Now
- Get a Quote
- Learn More
- Book a Diagnosis
- Book a Consultation

---

## Final premium visual direction

- dark premium background
- bright violet / pink accent colors
- large, readable hero text
- clean offer cards
- strong contrast CTA buttons
- premium industrial + digital aesthetic

This is the final launch-ready public system.
