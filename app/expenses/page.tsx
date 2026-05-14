import AddExpenseForm from "@/components/AddExpenseForm";
import ExpensesList from "./ExpensesList";
import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import ExportButtons from "@/components/ExportButtons";

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: { date: "desc" },
    include: {
      category: true,
      payingAccount: true,
    },
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Cheltuieli</h1>
      <ExportButtons
  pdfUrl="/api/export/expenses/pdf"
  excelUrl="/api/export/expenses/excel"
/>

      <div className={styles.card}>
        <AddExpenseForm />
      </div>

      <ExpensesList expenses={expenses} />
    </div>
  );
}