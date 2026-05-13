import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);

    if (!params.id || Number.isNaN(amount)) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.accountTransaction.create({
        data: {
          amount,
          type: "ADJUSTMENT",
          description: body.reason ?? "Ajustare manuală",
          payingAccountId: params.id,
        },
      }),

      prisma.payingAccount.update({
        where: { id: params.id },
        data: {
          balance: {
            increment: amount,
          },
        },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ADJUST ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}