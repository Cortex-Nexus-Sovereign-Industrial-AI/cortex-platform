# Archive Policy

Large binary documents (PDFs, DOCX, images) that currently sit in the repository root are retained for historical reference.

## Current Policy
- Do not delete historical PDFs without Founder approval.
- New operational documents should be written as Markdown under `/docs`.
- Over time, non-essential root binaries may be moved here or into `/assets`.

## Why this exists
The original platform accumulated many loose files across devices and sessions. The Command Center now keeps active knowledge in tracked Markdown so progress, ownership, and activity remain visible and version-controlled.

## Sensitive files
Environment files (`.env*`) have been removed from the tracked tree. Use `.env.example` / `backend/.env.example` as templates only. Real secrets belong in Netlify / local environment variables — never in Git.
