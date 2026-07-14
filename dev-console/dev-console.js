// dev-console.js
// The "unlock" step below only shows/hides the panel. It is NOT auth.
// Every button here calls a backend endpoint; the backend is what actually
// decides whether the action is allowed. If you add new buttons, follow the
// same pattern: browser -> your backend (which checks a real credential) -> action.

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

  unlockBtn.addEventListener('click', () => {
    // Cosmetic only — reveals the panel. Does not grant any real access.
    // sessionStorage, not localStorage, and cleared on close.
    if (keyInput.value.trim().length > 0) {
      sessionStorage.setItem('devConsoleSessionHint', 'shown');
      panels.hidden = false;
      appendLog('Panel unlocked (display only — backend still gates every action).');
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.add('hidden');
    panels.hidden = true;
    sessionStorage.removeItem('devConsoleSessionHint');
    keyInput.value = '';
  });

  document.getElementById('checkRepoStatus').addEventListener('click', async () => {
    appendLog('Checking repo status...');
    try {
      // Backend endpoint you control — re-checks the real session server-side
      // before returning anything. Replace with your actual endpoint.
      const resp = await fetch('/api/repo-status');
      const data = await resp.json();
      document.getElementById('repoStatus').textContent = JSON.stringify(data, null, 2);
      appendLog('Repo status updated.');
    } catch (err) {
      appendLog(`Repo status check failed: ${err}`);
    }
  });

  document.getElementById('checkHfStatus').addEventListener('click', async () => {
    appendLog('Checking Hugging Face sync status...');
    try {
      const resp = await fetch('/api/hf-status');
      const data = await resp.json();
      document.getElementById('hfStatus').textContent = JSON.stringify(data, null, 2);
      appendLog('HF status updated.');
    } catch (err) {
      appendLog(`HF status check failed: ${err}`);
    }
  });
});
