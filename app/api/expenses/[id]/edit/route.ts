import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const newAmount = Number(body.amount);

    const oldExpense = await prisma.expense.findUnique({
      where: { id: params.id },
    });

    if (!oldExpense || Number.isNaN(newAmount)) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      // 1️⃣ repară soldul vechi
      ...(oldExpense.payingAccountId
        ? [
            prisma.payingAccount.update({
              where: { id: oldExpense.payingAccountId },
              data: {
                balance: {
                  increment: oldExpense.amount,
                },
              },
            }),

            prisma.accountTransaction.deleteMany({
              where: {
                payingAccountId: oldExpense.payingAccountId,
                amount: -oldExpense.amount,
                description: oldExpense.details,
              },
            }),
          ]
        : []),

      // 2️⃣ update cheltuiala
      prisma.expense.update({
        where: { id: params.id },
        data: {
          amount: newAmount,
          details: body.details,
          categoryId: body.categoryId,
          payingAccountId: body.payingAccountId,
        },
      }),

      // 3️⃣ aplică soldul nou
      ...(body.payingAccountId
        ? [
            prisma.payingAccount.update({
              where: { id: body.payingAccountId },
              data: {
                balance: {
                  decrement: newAmount,
                },
              },
            }),

            prisma.accountTransaction.create({
              data: {
                amount: -newAmount,
                type: "EXPENSE",
                description: body.details,
                payingAccountId: body.payingAccountId,
              },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("EDIT EXPENSE ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}