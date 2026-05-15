"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

type Theme = "light" | "dark";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const [theme, setTheme] = useState<Theme>("light");

  // ✅ inițializare din localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setTheme("dark");
  }, []);

  // ✅ aplicare theme
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : "light"
    );
  };

  if (status === "loading") return null;
  if (!session?.user) return null;

  const linkClass = (path: string) =>
    `${styles.link} ${
      pathname === path ? styles.active : ""
    }`;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* LOGO */}
        <Link href="/" className={styles.logo}>
          💰 Budget App
        </Link>

        {/* NAV */}
        <div className={styles.links}>
          <Link
            href="/expenses"
            className={linkClass("/expenses")}
          >
            Cheltuieli
          </Link>

          <Link
            href="/transactions"
            className={linkClass("/transactions")}
          >
            Tranzacții
          </Link>

          <Link
            href="/categories"
            className={linkClass("/categories")}
          >
            Categorii
          </Link>

          <Link
            href="/paying-accounts"
            className={linkClass("/paying-accounts")}
          >
            Conturi
          </Link>

          <Link
            href="/reports"
            className={linkClass("/reports")}
          >
            Rapoarte
          </Link>

          <Link
            href="/converter"
            className={linkClass("/converter")}
          >
            Converter
          </Link>
        </div>

        {/* USER */}
        <div className={styles.right}>
          <span className={styles.user}>
  {session.user.name}{" "}
  <span className={styles.userEmail}>
    ({session.user.email})
  </span>
</span>

          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button
            className={styles.logoutBtn}
            onClick={() =>
              signOut({ callbackUrl: "/login" })
            }
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}