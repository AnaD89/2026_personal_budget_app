import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const expense = await prisma.expense.create({
    data: {
      date: body.date,
      amount: body.amount,
      details: body.details,
      type: body.type,
      isRecurring: body.isRecurring,
      categoryId: body.categoryId,
      payingAccountId: body.payingAccountId,

      // ✅ FOARTE IMPORTANT
      user: {
        connect: {
          email: session.user.email,
        },
      },
    },
  });

  return Response.json(expense);
}