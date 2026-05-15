export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/* =========================
   POST – ADAUGĂ ÎNCASARE
   ========================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // ✅ VALIDARE
    if (
      !body.date ||
      body.amount === undefined ||
      !body.details ||
      !body.payingAccountId ||
      !body.type
    ) {
      return new Response("Missing required fields", {
        status: 400,
      });
    }

    // ✅ VALIDARE ENUM EXISTENT
    if (
      body.type !== "PERSONAL" &&
      body.type !== "BUSINESS"
    ) {
      return new Response("Invalid expense type", {
        status: 400,
      });
    }

    const income = await prisma.expense.create({
      data: {
        date: new Date(body.date),
        amount: Number(body.amount), // ✅ pozitiv = încasare
        details: body.details,

        // ✅ FOLOSIM ENUMUL EXISTENT
        type: body.type,

        isRecurring: false,

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

    return Response.json(income);
  } catch (error) {
    console.error("❌ INCOME CREATE ERROR:", error);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}