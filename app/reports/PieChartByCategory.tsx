"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type PieData = {
  name: string;
  amount: number;
  percent: number;
};

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#f59e0b",
  "#7c3aed",
  "#0d9488",
];

export default function PieChartByCategory({
  data,
}: {
  data: PieData[];
}) {
  return (
    <div>
      <h2>Cheltuieli pe categorii (% din venit)</h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            outerRadius={120}
            label={({ name, percent }) =>
              `${name}: ${percent}%`
            }
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
          formatter={(value) =>
            value != null ? `${value} RON` : ""
        }
/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}