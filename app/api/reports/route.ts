import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Expense, Category } from "@prisma/client";

type ExpenseWithCategory = Expense & {
  category: Category | null;
};

export async function GET() {
  const expenses = (await prisma.expense.findMany({
    include: { category: true },
  })) as ExpenseWithCategory[];

  const total = expenses.reduce(
    (sum: number, e: ExpenseWithCategory) => sum + e.amount,
    0
  );

  const byType = {
    PERSONAL: expenses
      .filter((e: ExpenseWithCategory) => e.type === "PERSONAL")
      .reduce(
        (sum: number, e: ExpenseWithCategory) => sum + e.amount,
        0
      ),

    BUSINESS: expenses
      .filter((e: ExpenseWithCategory) => e.type === "BUSINESS")
      .reduce(
        (sum: number, e: ExpenseWithCategory) => sum + e.amount,
        0
      ),
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