"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

type Theme = "light" | "dark";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // ✅ inițializare corectă din localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  // ✅ effect DOAR pentru efecte externe (DOM)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  if (!session) return null;

  const linkClass = (path: string) =>
    `${styles.link} ${pathname === path ? styles.active : ""}`;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          💰 Budget App
        </Link>

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