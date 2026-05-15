export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ✅ OBLIGATORIU în Next.js 15
  const { id } = await params;

  // ✅ verificăm dacă există tranzacții asociate contului
  const expenseCount = await prisma.expense.count({
    where: { payingAccountId: id },
  });

  if (expenseCount > 0) {
    return NextResponse.json(
      {
        error:
          "Contul nu poate fi șters deoarece are tranzacții asociate.",
      },
      { status: 400 }
    );
  }

  await prisma.payingAccount.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}