import React from "react";

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = "/auth/login";
  };

  return (
    <button type="button" onClick={handleLogin}>
      Sign in to Cortex Platform
    </button>
  );
}
