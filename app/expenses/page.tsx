import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AddExpenseForm from "@/components/AddExpenseForm";

export default async function ExpensesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div>
        <h2>Trebuie să fii autentificată</h2>
        <a href="/login">Mergi la login</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Cheltuieli</h1>
      <AddExpenseForm />
    </div>
  );
}