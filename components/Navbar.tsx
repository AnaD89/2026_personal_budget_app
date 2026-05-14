"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const current = saved ?? "light";
    setTheme(current);
    document.documentElement.setAttribute("data-theme", current);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  if (!session) return null;

  const linkClass = (path: string) =>
    `${styles.link} ${pathname === path ? styles.active : ""}`;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          💰 Budget App
        </Link>

        {/* Links */}
        <div className={styles.links}>
          <Link href="/expenses" className={linkClass("/expenses")}>
            Cheltuieli
          </Link>

          <Link href="/categories" className={linkClass("/categories")}>
            Categorii
          </Link>

          <Link
            href="/paying-accounts"
            className={linkClass("/paying-accounts")}
          >
            Conturi
          </Link>

          <Link href="/reports" className={linkClass("/reports")}>
            Rapoarte
          </Link>

          <Link
            href="/transactions"
            className={linkClass("/transactions")}
          >
            Tranzacții
          </Link>
        </div>

        {/* Right side */}
        <div className={styles.right}>
          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button
            className={styles.logoutBtn}
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}