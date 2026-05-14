"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/components/ToastProvider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ToastProvider>
        <Navbar />
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}