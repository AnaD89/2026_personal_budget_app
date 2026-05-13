"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav
      style={{
        display: "flex",
        gap: 16,
        padding: 16,
        borderBottom: "1px solid #ccc",
        alignItems: "center",
      }}
    >
      <Link href="/">Dashboard</Link>

      {session && (
        <>
          <Link href="/expenses">Cheltuieli</Link>
          <Link href="/categories">Categorii</Link>
          <Link href="/paying-accounts">Conturi plătitoare</Link>
          <Link href="/reports">Rapoarte</Link>
        </>
      )}

      <div style={{ marginLeft: "auto" }}>
        {!session ? (
          <Link href="/login">Login</Link>
        ) : (
          <button onClick={() => signOut({ callbackUrl: "/login" })}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}