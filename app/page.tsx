import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import { prisma } from "@/lib/prisma";
import AddExpenseForm from "@/components/AddExpenseForm";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <p>Trebuie să te autentifici</p>;
  }

  const expenses = await prisma.expense.findMany({
    where: {
      user: { email: session.user.email },
    },
    orderBy: { date: "desc" },
  });

  return (
    <main>
      <h1>Dashboard</h1>

      <AddExpenseForm />

      <h3>Cheltuieli</h3>
      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            {new Date(e.date).toDateString()} – {e.amount} RON – {e.details}
          </li>
        ))}
      </ul>
    </main>
  );
}