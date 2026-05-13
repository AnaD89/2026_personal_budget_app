"use client";

import { useEffect, useState } from "react";

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
      .then((r) => r.json())
      .then(setReport);
  }, []);

  if (!report) return <p>Se încarcă...</p>;

  return (
    <div>
      <h1>Rapoarte</h1>

      <h2>Total cheltuieli</h2>
      <p>{report.total} RON</p>

      <h2>Pe tip</h2>
      <ul>
        <li>Personal: {report.byType.PERSONAL} RON</li>
        <li>Business: {report.byType.BUSINESS} RON</li>
      </ul>

      <h2>Pe categorii</h2>
      <ul>
        {Object.entries(report.byCategory).map(([name, amount]) => (
          <li key={name}>
            {name}: {amount} RON
          </li>
        ))}
      </ul>
    </div>
  );
}