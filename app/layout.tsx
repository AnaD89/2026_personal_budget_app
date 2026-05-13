import "./globals.css";
import { ReactNode } from "react";
import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ro">
      <body>
        <Providers>
          <main style={{ padding: 24 }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}