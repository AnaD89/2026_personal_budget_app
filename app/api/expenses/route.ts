export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/* =========================
   GET – LISTARE CHELTUIELI
   ========================= */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json([], { status: 200 });
  }

  const expenses = await prisma.expense.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      payingAccount: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return Response.json(expenses);
}

/* =========================
   POST – ADAUGĂ CHELTUIALĂ
   ========================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // ✅ VALIDARE CÂMPURI OBLIGATORII
    if (
      !body.date ||
      body.amount === undefined ||
      !body.details ||
      !body.categoryId ||
      !body.payingAccountId ||
      !body.type
    ) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    // ✅ VALIDARE ENUM PRISMA
    if (body.type !== "PERSONAL" && body.type !== "BUSINESS") {
      return new Response("Invalid expense type", {
        status: 400,
      });
    }

    const expense = await prisma.expense.create({
      data: {
        date: new Date(body.date),
        amount: Number(body.amount),
        details: body.details,

        // ✅ EXACT ENUMUL DIN PRISMA
        type: body.type,

        isRecurring: Boolean(body.isRecurring),

        category: {
          connect: { id: body.categoryId },
        },

        payingAccount: {
          connect: { id: body.payingAccountId },
        },

        user: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });

    return Response.json(expense);
  } catch (error) {
    console.error("❌ EXPENSE CREATE ERROR:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}