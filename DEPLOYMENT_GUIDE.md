# Deployment Guide: Cortex Intelligence Nexus Platform

## Overview

This guide covers deployment of the Cortex Platform via GitHub Pages, CI/CD configuration, monitoring, and rollback procedures for the CINIS Enterprise Governance Framework.

**Canonical Deployment:** `https://cortex-nexus-sovereign-industrial-ai.github.io/cortex-platform-core/`

---

## 1. GitHub Pages Setup

### Enable GitHub Pages

1. Navigate to repository **Settings** → **Pages**
2. Under "Source," select `main` branch
3. Folder: `/root` (default)
4. Save settings
5. Deployment will trigger automatically on push to `main`

### Custom Domain (cortexnexus.com)

1. In **Settings** → **Pages**, add custom domain: `cortexnexus.com`
2. Verify DNS records with your registrar:
   ```
   CNAME cortexnexus.com → cortex-nexus-sovereign-industrial-ai.github.io
   ```
3. Enable HTTPS enforcement once DNS propagates (4-24 hours)

---

## 2. Maintenance & Updates

### Regular Tasks

**Weekly:**
- Check uptime monitoring alerts
- Review error logs

**Monthly:**
- Audit analytics
- Test backup/restore procedures
- Verify SSL certificate validity

**Quarterly:**
- Review performance metrics
- Assess capacity for growth
- Plan feature releases

### Updates to Files

1. Create feature branch: `git checkout -b feature/description`
2. Make changes
3. Test locally (open HTML files in browser)
4. Commit: `git commit -m "Describe change concisely"`
5. Push: `git push origin feature/description`
6. Create PR on GitHub
7. Request review from @mikecomplexai-7 or team
8. Merge to `main`
9. GitHub Actions deploys automatically

---

## 3. Support & Escalation

**For deployment issues:**
- Email: `cortexnexus@proton.me`
- GitHub Issues: Tag `@mikecomplexai-7`

**For urgent outages:**
- 24/7 escalation via Wema Bank contact (if critical business impact)
- Post-incident review 48 hours after resolution

---

**Last updated:** 2026-07-18  
**Maintained by:** Michael Ujuku Morim (ARIA Strategic Assistant)  
**Contact:** cortexnexus@proton.me