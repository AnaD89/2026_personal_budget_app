import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const expenses = await prisma.expense.findMany({
    include: { category: true },
  });

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const byType = {
    PERSONAL: expenses
      .filter((e) => e.type === "PERSONAL")
      .reduce((s, e) => s + e.amount, 0),
    BUSINESS: expenses
      .filter((e) => e.type === "BUSINESS")
      .reduce((s, e) => s + e.amount, 0),
  };

  const byCategory: Record<string, number> = {};

  for (const e of expenses) {
    const name = e.category?.name ?? "Fără categorie";
    byCategory[name] = (byCategory[name] ?? 0) + e.amount;
  }

  return NextResponse.json({
    total,
    byType,
    byCategory,
  });
}