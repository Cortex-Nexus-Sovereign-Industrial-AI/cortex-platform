import React from "react";

export default function LoginPage() {
  return (
    <main>
      <h1>Sign in</h1>
      <p>Authorize access to continue into the platform.</p>
      <button type="button" onClick={() => { window.location.href = "/auth/login"; }}>
        Continue with secure login
      </button>
    </main>
  );
}
