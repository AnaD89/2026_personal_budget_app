"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import html2canvas from "html2canvas";
import Charts from "./Charts";

type Report = {
  total: number;
  byType: {
    PERSONAL: number;
    BUSINESS: number;
  };
  byCategory: Record<string, number>;
};

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // ✅ load raport
  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then(setReport);
  }, []);

  // ✅ export PDF cu grafice
  const exportPdf = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const image = canvas.toDataURL("image/png");

    const res = await fetch("/api/export/reports/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.pdf";
    a.click();

    URL.revokeObjectURL(url);
  };

  if (!report) {
    return <p>Se încarcă rapoartele…</p>;
  }

  const byCategory = Object.entries(report.byCategory).map(
    ([name, amount]) => ({ name, amount })
  );

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>Rapoarte</h1>
        <button
          className={styles.primaryBtn}
          onClick={exportPdf}
        >
          Export PDF
        </button>
      </div>

      {/* CONȚINUT EXPORTABIL */}
      <div ref={reportRef}>
        {/* SUMMARY */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              Total cheltuieli
            </div>
            <div className={styles.cardValue}>
              {report.total} RON
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              Personal
            </div>
            <div
              className={`${styles.cardValue} ${styles.personal}`}
            >
              {report.byType.PERSONAL} RON
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              Business
            </div>
            <div
              className={`${styles.cardValue} ${styles.business}`}
            >
              {report.byType.BUSINESS} RON
            </div>
          </div>
        </div>

        {/* GRAFICE */}
        <Charts byCategory={byCategory} />

        {/* LISTĂ CATEGORII */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Cheltuieli pe categorii
          </h2>

          <div className={styles.list}>
            {Object.entries(report.byCategory).map(
              ([category, amount]) => (
                <div
                  key={category}
                  className={styles.row}
                >
                  <span
                    className={styles.categoryName}
                  >
                    {category}
                  </span>
                  <span className={styles.amount}>
                    {amount} RON
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}