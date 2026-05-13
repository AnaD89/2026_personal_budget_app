"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          padding: 32,
          borderRadius: 8,
          width: 320,
          textAlign: "center",
        }}
      >
        <h1>Autentificare</h1>

        <p>Conectează-te pentru a continua</p>

        <button
          onClick={() =>
            signIn("github", {
              callbackUrl: "/", // ✅ IMPORTANT: pagină, NU API
            })
          }
          style={{
            marginTop: 16,
            padding: "10px 16px",
            width: "100%",
            cursor: "pointer",
          }}
        >
          Login cu GitHub
        </button>
      </div>
    </main>
  );
}