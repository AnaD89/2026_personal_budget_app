"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type HistoryItem = {
  date: string;
  rates: {
    EUR: number;
    USD: number;
    CHF: number;
  };
};

export default function CurrencyChart({
  data,
}: {
  data: HistoryItem[];
}) {
  const chartData = data.map((d) => ({
    date: d.date,
    EUR: d.rates.EUR,
    USD: d.rates.USD,
    CHF: d.rates.CHF,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2 className="font-semibold mb-2">
        Curs BNR – ultimele 5 zile
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="EUR"
            stroke="#2563eb"
          />
          <Line
            type="monotone"
            dataKey="USD"
            stroke="#16a34a"
          />
          <Line
            type="monotone"
            dataKey="CHF"
            stroke="#dc2626"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}