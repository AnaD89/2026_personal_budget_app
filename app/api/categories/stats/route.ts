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

    // ✅ cheltuieli cu categorie
    const expenses = await prisma.expense.findMany({
      include: { category: true },
    });

    const stats: Record<
      string,
      { total: number; count: number }
    > = {};

    for (const e of expenses) {
      const name = e.category?.name ?? "Fără categorie";

      if (!stats[name]) {
        stats[name] = { total: 0, count: 0 };
      }

      stats[name].total += e.amount;
      stats[name].count += 1;
    }

    const result = Object.entries(stats).map(
      ([name, { total, count }]) => ({
        name,
        total,
        count,
        percent:
          totalIncome > 0
            ? Math.round((total / totalIncome) * 1000) / 10
            : 0,
      })
    );

    return NextResponse.json({
      totalIncome,
      categories: result,
    });
  } catch (error) {
    console.error("CATEGORY STATS ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}