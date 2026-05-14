import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // ✅ total venit
    const incomeAgg = await prisma.accountTransaction.aggregate({
      where: { type: "INCOME" },
      _sum: { amount: true },
    });

    const totalIncome = incomeAgg._sum.amount ?? 0;

    // ✅ cheltuieli pe categorii
    const expenses = await prisma.expense.findMany({
      include: { category: true },
    });

    const byCategory: Record<string, number> = {};

    for (const e of expenses) {
      const name = e.category?.name ?? "Fără categorie";
      byCategory[name] = (byCategory[name] ?? 0) + e.amount;
    }

    const chartData = Object.entries(byCategory).map(
      ([name, amount]) => ({
        name,
        amount,
        percent:
          totalIncome > 0
            ? Math.round((amount / totalIncome) * 1000) / 10
            : 0,
      })
    );

    // ✅ FOARTE IMPORTANT
    return NextResponse.json({
      totalIncome,
      chartData,
    });
  } catch (error) {
    console.error("PIE REPORT ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}