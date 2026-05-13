import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const accounts = await prisma.payingAccount.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(accounts);
}