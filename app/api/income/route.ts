import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * ✅ POST – adăugare încasare
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // ✅ validare minimă
    const amount = Number(body.amount);
    const payingAccountId =
      typeof body.payingAccountId === "string" &&
      body.payingAccountId.length > 0
        ? body.payingAccountId
        : null;

    if (!payingAccountId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      // 1️⃣ tranzacție de cont
      prisma.accountTransaction.create({
        data: {
          amount,
          type: "INCOME",
          description: body.description ?? "Încasare",
          payingAccountId,
        },
      }),

      // 2️⃣ actualizare sold
      prisma.payingAccount.update({
        where: { id: payingAccountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
    ]);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("INCOME ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}