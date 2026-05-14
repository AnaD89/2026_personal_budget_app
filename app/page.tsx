import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import { prisma } from "@/lib/prisma";
import AddExpenseForm from "@/components/AddExpenseForm";
import ExportButtons from "@/components/ExportButtons";

export default async function DashboardPage() {
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
    <main className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Dashboard Buget
        </h1>

        <ExportButtons
          pdfUrl="/api/export/global/pdf"
          excelUrl="/api/export/global/excel"
        />
      </div>

      {/* ADD EXPENSE */}
      <AddExpenseForm />

      {/* LISTĂ CHELTUIELI */}
      <section>
        <h3 className="font-semibold mb-2">
          Cheltuieli
        </h3>

        <ul className="space-y-1">
          {expenses.map((e) => (
            <li key={e.id}>
              {new Date(e.date).toDateString()} –{" "}
              {e.amount} RON – {e.details}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}