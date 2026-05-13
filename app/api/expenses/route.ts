import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * 🚫 GET NU este pagină
 * ✅ Returnează doar JSON
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "GET not supported on /api/expenses" },
    { status: 405 }
  );
}

/**
 * ✅ POST – creare cheltuială
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // ✅ normalizare input (CRITIC)
    const categoryId =
      typeof body.categoryId === "string" && body.categoryId.length > 0
        ? body.categoryId
        : null;

    const payingAccountId =
      typeof body.payingAccountId === "string" &&
      body.payingAccountId.length > 0
        ? body.payingAccountId
        : null;

    const expense = await prisma.expense.create({
      data: {
        date: new Date(body.date),
        amount: Number(body.amount),
        details: body.details,
        type: body.type,
        isRecurring: Boolean(body.isRecurring),

        // ✅ persoana = user logat
        user: {
          connect: { email: session.user.email },
        },

        // ✅ categorie (opțional)
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),

        // ✅ cont plătitor (opțional)
        ...(payingAccountId && {
          payingAccount: {
            connect: { id: payingAccountId },
          },
        }),
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("EXPENSE ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}