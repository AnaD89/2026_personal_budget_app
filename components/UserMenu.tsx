"use client";

import { signOut, useSession } from "next-auth/react";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-sm">…</span>;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-gray-600">
        {session.user.email}
      </div>

      <button
        onClick={() => signOut()}
        className="text-sm text-red-600 hover:underline"
      >
        Logout
      </button>
    </div>
  );
}