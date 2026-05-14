import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type"); // EXPENSE / INCOME / ADJUSTMENT
  const accountId = searchParams.get("accountId");
  const categoryId = searchParams.get("categoryId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const q = searchParams.get("q"); // text search

  const where: any = {};

  // ✅ tip tranzacție
  if (type) {
    where.type = type;
  }

  // ✅ cont plătitor
  if (accountId) {
    where.payingAccountId = accountId;
  }

  // ✅ categorie (doar unde există)
  if (categoryId) {
    where.OR = [
      { expense: { categoryId } },
      { description: { contains: categoryId } },
    ];
  }

  // ✅ interval dată
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  // ✅ text search (descriere)
  if (q) {
    where.description = {
      contains: q,
      mode: "insensitive",
    };
  }

  const transactions = await prisma.accountTransaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      payingAccount: true,
    },
  });

  return NextResponse.json(transactions);
}
