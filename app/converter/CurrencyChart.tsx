"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Rates = {
  EUR: number;
  USD: number;
  CHF: number;
};

type HistoryItem = {
  date: string;
  rates: Rates;
};

type CurrencyOption = "ALL" | "EUR" | "USD" | "CHF";

export default function CurrencyChart({
  history,
  todayRates,
}: {
  history: HistoryItem[];
  todayRates: Rates;
}) {
  const [currency, setCurrency] =
    useState<CurrencyOption>("ALL");

  // ✅ date pentru grafic
  const chartData = history.map((h) => ({
    date: h.date,
    EUR: h.rates.EUR,
    USD: h.rates.USD,
    CHF: h.rates.CHF,
  }));

  // ✅ culoare dinamică în funcție de trend
  const getColor = (c: keyof Rates) => {
    const yesterday = history[0]?.rates[c];
    const today = todayRates[c];

    if (today > yesterday) return "#16a34a"; // verde
    if (today < yesterday) return "#dc2626"; // roșu
    return "#6b7280"; // gri
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-semibold">
          Evoluție curs BNR –{" "}
          {currency === "ALL"
            ? "toate valutele"
            : currency}
        </h2>

        <select
          value={currency}
          onChange={(e) =>
            setCurrency(e.target.value as CurrencyOption)
          }
          className="border px-2 py-1"
        >
          <option value="ALL">Toate</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="CHF">CHF</option>
        </select>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            {(currency === "ALL" ||
              currency === "EUR") && (
              <Line
                type="monotone"
                dataKey="EUR"
                stroke={getColor("EUR")}
                strokeWidth={2}
              />
            )}

            {(currency === "ALL" ||
              currency === "USD") && (
              <Line
                type="monotone"
                dataKey="USD"
                stroke={getColor("USD")}
                strokeWidth={2}
              />
            )}

            {(currency === "ALL" ||
              currency === "CHF") && (
              <Line
                type="monotone"
                dataKey="CHF"
                stroke={getColor("CHF")}
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}