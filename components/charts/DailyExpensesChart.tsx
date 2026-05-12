"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export function DailyExpensesChart({ data }: any) {
  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Line dataKey="total" stroke="#2563eb" />
    </LineChart>
  );
}