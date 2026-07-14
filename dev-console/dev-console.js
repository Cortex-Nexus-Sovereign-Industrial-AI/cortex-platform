// dev-console.js
// The "unlock" input below only shows/hides the panel — it is NOT auth.
// Real auth is the encrypted session set by your HF OAuth callback handler
// after it POSTs the redirect `code` to /api/hf-token and receives back a
// `session` blob. That handler lives elsewhere in your app (per the original
// spec) — this file assumes it stores the result like this:
//
//   sessionStorage.setItem('cinisSession', data.session);
//
// If that handler doesn't do this yet, that's the next piece to build —
// this file can't confirm it exists from here.

document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('secret-dev-console');
  const unlockBtn = document.getElementById('devConsoleUnlock');
  const closeBtn = document.getElementById('devConsoleClose');
  const keyInput = document.getElementById('devConsoleKey');
  const panels = document.getElementById('devConsolePanels');
  const log = document.getElementById('syncLog');

  function appendLog(msg) {
    const ts = new Date().toISOString();
    log.textContent += `[${ts}] ${msg}\n`;
  }

  function getSession() {
    return sessionStorage.getItem('cinisSession');
  }

  unlockBtn.addEventListener('click', () => {
    // Cosmetic only — reveals the panel. Does not grant any real access.
    if (keyInput.value.trim().length > 0) {
      panels.hidden = false;
      appendLog('Panel unlocked (display only).');
      if (!getSession()) {
        appendLog('No active session found — complete Hugging Face sign-in first for the buttons below to work.');
      }
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.add('hidden');
    panels.hidden = true;
    keyInput.value = '';
  });

  async function callProtected(endpoint, outEl) {
    const session = getSession();
    if (!session) {
      outEl.textContent = 'No active session. Sign in with Hugging Face first.';
      return;
    }
    try {
      const resp = await fetch(endpoint, {
        headers: { 'x-cinis-session': session }
      });
      const data = await resp.json();
      if (!resp.ok) {
        outEl.textContent = `Error (${resp.status}): ${data.error || 'unknown'}`;
        appendLog(`${endpoint} returned ${resp.status}`);
        return;
      }
      outEl.textContent = JSON.stringify(data, null, 2);
      appendLog(`${endpoint} updated.`);
    } catch (err) {
      outEl.textContent = `Request failed: ${err}`;
      appendLog(`${endpoint} request failed: ${err}`);
    }
  }

  document.getElementById('checkRepoStatus').addEventListener('click', () => {
    appendLog('Checking repo status...');
    callProtected('/api/repo-status', document.getElementById('repoStatus'));
  });

  document.getElementById('checkHfStatus').addEventListener('click', () => {
    appendLog('Checking Hugging Face sync status...');
    callProtected('/api/hf-status', document.getElementById('hfStatus'));
  });
});
