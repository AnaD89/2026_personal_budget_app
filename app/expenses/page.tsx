import AddExpenseForm from "@/components/AddExpenseForm";
import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";

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

      <div className={styles.card}>
        <AddExpenseForm />
      </div>

      <div className={styles.list}>
        {expenses.map((e) => (
          <div key={e.id} className={styles.item}>
            <div className={styles.itemLeft}>
              <span className={styles.amount}>
                {e.amount} RON
              </span>
              <span className={styles.meta}>
                {e.category?.name ?? "Fără categorie"} •{" "}
                {e.payingAccount?.name ?? "Fără cont"}
              </span>
              <span
                className={
                  e.type === "PERSONAL"
                    ? styles.typePersonal
                    : styles.typeBusiness
                }
              >
                {e.type}
              </span>
            </div>

            <span className={styles.meta}>
              {new Date(e.date).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}