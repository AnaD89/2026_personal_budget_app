import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const accounts = await prisma.payingAccount.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(accounts);
}

export async function POST(req: Request) {
  const body = await req.json();

  const account = await prisma.payingAccount.create({
  data: {
    name: body.name,
    currency: body.currency,
    balance: 0, // Decimal
  },
});

  return NextResponse.json(account, { status: 201 });
}