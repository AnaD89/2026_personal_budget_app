"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

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

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then(setReport);
  }, []);

  if (!report) {
    return <p>Se încarcă rapoartele…</p>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Rapoarte</h1>

      {/* Summary cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Total cheltuieli</div>
          <div className={styles.cardValue}>
            {report.total} RON
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Personal</div>
          <div
            className={`${styles.cardValue} ${styles.personal}`}
          >
            {report.byType.PERSONAL} RON
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Business</div>
          <div
            className={`${styles.cardValue} ${styles.business}`}
          >
            {report.byType.BUSINESS} RON
          </div>
        </div>
      </div>

      {/* By category */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Cheltuieli pe categorii
        </h2>

        <div className={styles.list}>
          {Object.entries(report.byCategory).map(
            ([category, amount]) => (
              <div key={category} className={styles.row}>
                <span className={styles.categoryName}>
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
  );
}