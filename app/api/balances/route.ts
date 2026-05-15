import { prisma } from "@/lib/prisma";

export async function GET() {
  const accounts = await prisma.payingAccount.findMany({
    include: {
      transactions: true,
    },
  });

  const result = accounts.map((a) => {
    const income = a.transactions
      .filter((t) => t.type === "INCOME")
      .reduce((s, t) => s + t.amount, 0);

    const expense = a.transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((s, t) => s + t.amount, 0);

    return {
      id: a.id,
      name: a.name,
      income,
      expense,
      balance: income - expense,
    };
  });

  return Response.json(result);
}