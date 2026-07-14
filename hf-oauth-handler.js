// hf-oauth-handler.js
// Captures the `code` param from the Hugging Face OAuth redirect, exchanges
// it server-side via /api/hf-token, and stores the resulting encrypted
// session (never the raw HF token) for the dev console to use.
//
// Runs once on page load. If there's no `code` in the URL, does nothing.

(function () {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (!code) return;

  fetch('/api/hf-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })
    .then(resp => {
      if (!resp.ok) throw new Error(`hf-token exchange failed: ${resp.status}`);
      return resp.json();
    })
    .then(data => {
      if (data.session) {
        sessionStorage.setItem('cinisSession', data.session);
      }
    })
    .catch(err => {
      console.error('HF OAuth handshake failed:', err);
    })
    .finally(() => {
      // Remove ?code=... from the visible URL either way — it's single-use
      // and shouldn't linger in browser history or get shared accidentally.
      params.delete('code');
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, document.title, newUrl);
    });
})();
