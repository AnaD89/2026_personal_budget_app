"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Charts from "./Charts";
import PieChartByCategory from "./PieChartByCategory";

type Report = {
  total: number;
  byType: {
    PERSONAL: number;
    BUSINESS: number;
  };
  byCategory: Record<string, number>;
};

type PieResponse = {
  totalIncome: number;
  chartData: {
    name: string;
    amount: number;
    percent: number;
  }[];
};

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [pieData, setPieData] = useState<PieResponse | null>(null);

  // ✅ raport clasic
  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then(setReport);
  }, []);

  // ✅ date pentru pie chart
  useEffect(() => {
  fetch("/api/reports/pie")
    .then((r) => {
      if (!r.ok) throw new Error("API error");
      return r.json();
    })
    .then(setPieData)
    .catch((err) => {
      console.error(err);
      setPieData(null);
    });
}, []);

  if (!report) {
    return <p>Se încarcă rapoartele…</p>;
  }

  // ✅ date pentru bar chart (dacă îl păstrezi)
  const byCategory = Object.entries(report.byCategory).map(
    ([name, amount]) => ({ name, amount })
  );

  // ✅ temporar (sold în timp – urmează DB real)
  const balanceHistory = [
    { date: "2024-01", balance: 1000 },
    { date: "2024-02", balance: 800 },
    { date: "2024-03", balance: 1200 },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Rapoarte</h1>

      {/* SUMMARY */}
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

      {/* ✅ PIE CHART – PROCENTE DIN VENIT */}
      {pieData && (
        <PieChartByCategory data={pieData.chartData} />
      )}

      {/* ✅ (OPȚIONAL) BAR / LINE CHART */}
      <Charts
        byCategory={byCategory}
        balanceHistory={balanceHistory}
      />

      {/* LISTĂ TEXTUALĂ */}
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