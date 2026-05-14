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
  data,
}: {
  data: HistoryItem[];
}) {
  const [currency, setCurrency] =
    useState<CurrencyOption>("ALL");

  const chartData = data.map((d) => ({
    date: d.date,
    EUR: d.rates.EUR,
    USD: d.rates.USD,
    CHF: d.rates.CHF,
  }));

  return (
    <div className="mt-6">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-semibold">
          Evoluție curs BNR –{" "}
          {currency === "ALL" ? "toate valutele" : currency}
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

            {(currency === "ALL" || currency === "EUR") && (
              <Line
                type="monotone"
                dataKey="EUR"
                stroke="#2563eb"
                strokeWidth={2}
              />
            )}

            {(currency === "ALL" || currency === "USD") && (
              <Line
                type="monotone"
                dataKey="USD"
                stroke="#16a34a"
                strokeWidth={2}
              />
            )}

            {(currency === "ALL" || currency === "CHF") && (
              <Line
                type="monotone"
                dataKey="CHF"
                stroke="#dc2626"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}