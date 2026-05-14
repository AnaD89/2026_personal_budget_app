"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useToast } from "@/components/ToastProvider";
import ExportButtons from "@/components/ExportButtons";

type Category = {
  id: string;
  name: string;
};

type CategoryStats = {
  name: string;
  total: number;
  count: number;
  percent: number;
};

export default function CategoriesPage() {
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats[]>([]);
  const [name, setName] = useState("");

  // ✅ load categorii
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  // ✅ load statistici
  useEffect(() => {
    fetch("/api/categories/stats")
      .then((r) => r.json())
      .then((data) => setStats(data.categories));
  }, []);

  const add = async () => {
    if (!name.trim()) {
      showToast("Numele categoriei este obligatoriu", "error");
      return;
    }

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      showToast("Eroare la adăugare categorie", "error");
      return;
    }

    const created = await res.json();
    setCategories((prev) => [...prev, created]);
    setName("");
    showToast("Categorie adăugată", "success");

    // 🔄 refresh statistici
    fetch("/api/categories/stats")
      .then((r) => r.json())
      .then((data) => setStats(data.categories));
  };

  const remove = async (id: string) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });

    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast("Categorie ștearsă", "success");

    // 🔄 refresh statistici
    fetch("/api/categories/stats")
      .then((r) => r.json())
      .then((data) => setStats(data.categories));
  };

  return (
    <div className={styles.page}>
      {/* ✅ HEADER CU EXPORT */}
      <div className={styles.header}>
        <h1 className={styles.title}>Categorii</h1>

        <ExportButtons
          pdfUrl="/api/export/categories/pdf"
          excelUrl="/api/export/categories/excel"
        />
      </div>

      {/* ADD CATEGORY */}
      <div className={styles.addBox}>
        <input
          className={styles.input}
          placeholder="Categorie nouă"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className={styles.primaryBtn} onClick={add}>
          Adaugă
        </button>
      </div>

      {/* LISTĂ CATEGORII */}
      <div className={styles.list}>
        {categories.map((c) => (
          <div key={c.id} className={styles.card}>
            <span className={styles.name}>{c.name}</span>
            <button
              className={styles.deleteBtn}
              onClick={() => remove(c.id)}
            >
              Șterge
            </button>
          </div>
        ))}
      </div>

      {/* ✅ STATISTICI */}
      <h2>Statistici pe categorii</h2>

      <div className={styles.statsList}>
        {stats.map((s) => (
          <div key={s.name} className={styles.statCard}>
            <div className={styles.statTitle}>{s.name}</div>

            <div className={styles.statRow}>
              <span>Total:</span>
              <strong>{s.total} RON</strong>
            </div>

            <div className={styles.statRow}>
              <span>Din venit:</span>
              <strong>{s.percent}%</strong>
            </div>

            <div className={styles.statRow}>
              <span>Tranzacții:</span>
              <strong>{s.count}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}