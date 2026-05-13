"use client";

import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}