# Cortex Intelligence Nexus — Change Control Protocol

## Purpose
Prevent accidental drift between GitHub, Netlify, Google Business, Magnetly, YouTube and other external surfaces.

## Canonical sequence
Audit → Map → Diff → Build → Validate → Deploy → Verify → Record → Connect

## Before changing anything
- Identify the canonical source.
- Read current live state.
- Check pending edits or unpublished changes.
- Confirm the exact target URL/path.
- Confirm whether the change is public.
- Prefer the smallest reversible change.

## After changing anything
Record:
- date/time
- system
- object/location
- old state
- new state
- commit/deploy/public ID
- validation result
- remaining follow-up

## Safety rules
1. Google Business public writes require explicit confirmation and exact fields.
2. Never overwrite a profile with pending edits without first understanding the pending state.
3. Never infer null as false.
4. Never change the canonical hostname casually.
5. Never treat a dashboard connection as proof of end-to-end connectivity.
6. Never expose or commit secrets.
7. Never claim a social channel is automated until a real successful operation is observed.
8. Keep Cortex Intelligence Nexus and DARKTRONIX 9V LABS as distinct identities with a documented parent/child relationship.

## Recovery principle
If two systems disagree, stop the write, document the discrepancy, determine which system owns the truth, then reconcile deliberately. Do not fix the disagreement by overwriting whichever side is easiest to access.