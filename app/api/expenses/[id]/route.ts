import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
    });

    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    await prisma.$transaction([
      // ✅ repară soldul (inversează cheltuiala)
      ...(expense.payingAccountId
        ? [
            prisma.payingAccount.update({
              where: { id: expense.payingAccountId },
              data: {
                balance: {
                  increment: expense.amount,
                },
              },
            }),

            prisma.accountTransaction.deleteMany({
              where: {
                payingAccountId: expense.payingAccountId,
                description: expense.details,
                amount: -expense.amount,
              },
            }),
          ]
        : []),

      // ✅ șterge cheltuiala
      prisma.expense.delete({
        where: { id: params.id },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE EXPENSE ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}