# Chips — Prompt Snippets for Future Agents

Use these concise prompts when talking to ChatGPT, Claude, or any next AI agent.
They encode the system architecture, constraints, and next actions into portable instructions.

---

## Chip 1: System Overview

```
You are helping build Cortex Intelligence Nexus, a content-to-revenue platform.

Repo: https://github.com/Cortex-Nexus-Sovereign-Industrial-AI/cortex-platform

Brand: Cortex Intelligence Nexus (only)
Founder: Michael Ujuku Morim (only)
Site: https://cortex-platforms.netlify.app

The system has 5 layers:
1. Identity (IDENTITY.md - locked)
2. Offers (offers.html - ₦22,000 for 30-Day AI Content System)
3. Payment (Paystack webhook)
4. Member access (access grants + member-dashboard.html)
5. Metrics (Platform Pulse dashboard)

Content agents exist in agents/ directory:
- podcast_agent.py (generates episodes)
- member_gate_router.py (manages access)
- metrics_tracker.py (logs conversions)

First episode is ready: content-output/podcast/cortex_signals_1.md

Next task: [INSERT SPECIFIC TASK]
```

---

## Chip 2: Generate Next Podcast Episode

```
Generate the next podcast episode using the existing podcast_agent.py template.

Template structure:
- Title: Cortex Signals #[N]: [Topic]
- Problem: [What problem does this solve?]
- Solution: [How is it solved operationally?]
- Action: [What should listeners do next?]
- Duration: 20-30 minutes

Constraints:
- Must reference Cortex Intelligence Nexus
- No fake promises
- Problem-to-outcome framework
- Aligned with IDENTITY.md

Output format: Markdown file in content-output/podcast/cortex_signals_[N].md

Publish path: member-dashboard.html (gated behind ₦22,000 access grant)
```

---

## Chip 3: Backend Webhook Integration

```
Wire Paystack webhook to create member access grants.

File: backend/paystack_webhook.js

On successful payment:
1. Extract email, reference, amount from Paystack webhook
2. Call: member_gate_router.create_access_grant(email, "30-Day AI Content System", reference, 30)
3. Log conversion: metrics_tracker.log_conversion(reference, amount, email, "30-Day AI Content System")
4. Return: { success: true, access_grant: grant_object }

Python imports: Import agents/member_gate_router.py and agents/metrics_tracker.py

Test with: Simulate Paystack webhook for test@example.com, verify access_grant created in content-output/access-grants/
```

---

## Chip 4: Member Dashboard UI

```
Build member-dashboard.html to display gated content.

Fetch endpoint: /api/member-payload?email=USER_EMAIL
Expected response format: See content-output/member/dashboard_payload_example.json

Render:
- User email + member status
- List of access grants (with expiration)
- Unlocked content (podcasts, documentaries, resources)
- Next episode preview
- Renewal reminder if expiring soon

Content sources:
- Podcasts: content-output/podcast/registry.json
- Access grants: Check user email in content-output/access-grants/
- Metadata: Use dashboard_payload_example.json as template

Design: Simple, clean, focus on content discovery and access clarity
```

---

## Chip 5: Platform Pulse (Metrics Dashboard)

```
Build metrics-dashboard.html to display revenue + engagement.

Fetch endpoint: /api/metrics/pulse
Expected response: Use agents/metrics_tracker.py export_to_platform_pulse()

Display:
- Period tabs: Last 7 days | Last 30 days | Year
- Podcast listens (count + trend)
- Content views (count + trend)
- Offer clicks (count)
- Conversions (count + revenue in NGN)
- Unique members (count)
- Conversion rate (%)
- Health status: member_growth, engagement, revenue, conversion_efficiency

Color coding:
- Green: strong
- Yellow: growing
- Red: early/optimize

Refresh: Auto-refresh every 5 minutes
```

---

## Chip 6: Publish First Teaser

```
Publish the first podcast teaser to drive conversions.

Teaser source: content-output/podcast/cortex_signals_1_teaser.md

Channels:
1. LinkedIn: Post full teaser text + link to offers.html
2. Twitter/X: Use short version (280 chars), link to offers.html
3. Email: Send to contact list with teaser + CTA
4. Website: Add to index.html or media.html as featured content

CTA link: https://cortex-platforms.netlify.app/offers.html
CTA text: "Join the content system" or "Unlock full episode"

Track: Log offer_clicks via metrics_tracker.log_offer_click()
Measure: Watch conversions in Platform Pulse dashboard
```

---

## Chip 7: Optimize Offers Page

```
Improve conversion rate on offers.html.

Current messaging:
- Product: 30-Day AI Content System
- Price: ₦22,000
- What's included: podcasts, member resources, educational content
- CTA: "Subscribe" or "Join"

Optimization options:
- Test 2–3 versions of headline
- Add social proof (member count, listen count)
- Show first teaser or episode preview
- Add urgency if appropriate (e.g., "Launch week pricing")
- Simplify checkout flow

Measure success:
- Track offer_clicks in metrics_tracker
- Monitor conversion_rate in Platform Pulse
- A/B test: Old vs new messaging

Constraint: No fake promises. Stick to Cortex Intelligence Nexus brand and problem-to-outcome framework.
```

---

## Chip 8: Generate Multiple Episodes (Batch)

```
Generate episodes 2–5 for the podcast series.

Use podcast_agent.py:

Episode 2:
- Title: "Cortex Signals #2: Content as a Revenue Engine"
- Problem: "You produce content but don't get paid for it"
- Solution: "Gate access behind membership, use public teasers to funnel to paid access"
- Action: "Take one piece of content, build a teaser, link to offer, track conversions"

Episode 3:
- Title: "Cortex Signals #3: Autonomous Operations at Every Scale"
- Problem: "As you grow, you can't handle everything personally"
- Solution: "Document workflows as code, use agents to automate"
- Action: "Document one workflow, make it a function, automate it"

Episode 4:
- Title: "Cortex Signals #4: Identity as Trust"
- Problem: "Many businesses have conflicting names, messaging, unclear positioning"
- Solution: "Single source of truth for identity, consistent brand across all surfaces"
- Action: "Lock your identity document, align all public presence to it"

Episode 5:
- Title: "Cortex Signals #5: Metrics That Matter"
- Problem: "Tracking everything is noise. You need to know what drives revenue."
- Solution: "Track: listens, clicks, conversions, revenue. Calculate health status."
- Action: "Log one week of metrics, calculate your conversion rate, optimize for next week"

Output: All in content-output/podcast/
```

---

## Chip 9: Troubleshooting Access Grants

```
If users can't see member content:

1. Verify Paystack webhook fired:
   - Check backend logs for /api/webhooks/paystack call
   - Confirm reference, email, amount were extracted correctly

2. Verify access grant was created:
   - Check content-output/access-grants/[USER_EMAIL]_30-Day_AI_Content_System.json
   - Confirm status = "active"
   - Confirm expires_at is in future

3. Verify member dashboard can read grant:
   - Fetch /api/member-payload?email=[USER_EMAIL]
   - Check response includes access_grants array
   - Check content array includes unlocked podcasts

4. Verify podcast is in registry:
   - Check content-output/podcast/registry.json
   - Confirm episode_id, title, path are present
   - Confirm status = "ready_for_recording" or "published"

5. Common fixes:
   - Paystack webhook not wired → wire it in backend/paystack_webhook.js
   - Python import error → check Python paths are correct
   - Access grant file not created → check member_gate_router.py logic
   - Member dashboard not reading file → check JSON path and permissions
```

---

## Chip 10: Handoff to Next Agent

```
If continuing to the next agent:

1. Update AGENT_HANDOFF.md with current status
2. Note what was completed
3. Note what is next
4. Provide this summary:

[AGENT NAME] — [DATE] — [TOKEN USAGE: X/200k]

Completed this session:
- [Task 1]
- [Task 2]
- [Task 3]

Next priorities:
1. [Next immediate task]
2. [Task after that]
3. [Longer-term goal]

Files modified: [list]
Files to reference: [list]

The system is [on track / needs X / requires attention for Y]

Continue with the next task using the appropriate Chip prompt.
```

---

## How to use these Chips

1. **Copy the chip that matches your current task**
2. **Paste it into ChatGPT or Claude**
3. **The chip encodes the context and constraints**
4. **The agent will understand what to build and why**
5. **No need to re-explain the entire system each time**

---

## Token conservation strategy

- Use Chips to avoid re-explaining context
- Each Chip is ~200–400 tokens
- System Overview Chip saves ~2k tokens vs re-explaining
- Stack relevant Chips together if you have multiple tasks
- Update this file as you go, so the next agent has current Chips

---

**These Chips are the portable instruction set for building Cortex Intelligence Nexus.**

Any AI agent that reads these will know:
- What system they're building
- What constraints apply
- What the next task is
- How to verify success
- How to hand off to the next agent
