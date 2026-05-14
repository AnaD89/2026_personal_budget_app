"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

type CategoryChart = {
  name: string;
  amount: number;
};

type BalancePoint = {
  date: string;
  balance: number;
};

export default function Charts({
  byCategory,
  balanceHistory,
}: {
  byCategory: CategoryChart[];
  balanceHistory: BalancePoint[];
}) {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Cheltuieli pe categorii */}
      <div>
        <h2>Cheltuieli pe categorii</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byCategory}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sold în timp */}
      <div>
        <h2>Sold în timp</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={balanceHistory}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#16a34a"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}