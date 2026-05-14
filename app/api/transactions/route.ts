/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type");
  const accountId = searchParams.get("accountId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const q = searchParams.get("q");

  // ✅ TypeScript va infera corect tipul
  const where = {};

  if (type) {
    (where as any).type = type;
  }

  if (accountId) {
    (where as any).payingAccountId = accountId;
  }

  if (from || to) {
    (where as any).createdAt = {};
    if (from) (where as any).createdAt.gte = new Date(from);
    if (to) (where as any).createdAt.lte = new Date(to);
  }

  if (q) {
    (where as any).description = {
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