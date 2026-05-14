"use client";

import styles from "./page.module.css";

type Expense = {
  id: string;
  amount: number;
  date: string;
  details: string;
  type: "PERSONAL" | "BUSINESS";
  categoryId: string | null;
  payingAccountId: string | null;
  category?: { name: string } | null;
  payingAccount?: { name: string } | null;
};

export default function ExpensesList({
  expenses,
}: {
  expenses: Expense[];
}) {
  return (
    <div className={styles.list}>
      {expenses.map((e) => (
        <div key={e.id} className={styles.item}>
          <div className={styles.itemLeft}>
            <span className={styles.amount}>{e.amount} RON</span>

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

          <div className={styles.itemRight}>
            <span className={styles.meta}>
              {new Date(e.date).toLocaleDateString()}
            </span>

            {/* DELETE */}
            <button
              onClick={async () => {
                if (!confirm("Ștergi această cheltuială?")) return;
                await fetch(`/api/expenses/${e.id}`, {
                  method: "DELETE",
                });
                location.reload();
              }}
            >
              🗑
            </button>

            {/* EDIT */}
            <button
              onClick={async () => {
                const amount = prompt(
                  "Sumă nouă:",
                  String(e.amount)
                );
                if (!amount || isNaN(Number(amount))) return;

                await fetch(`/api/expenses/${e.id}/edit`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    amount: Number(amount),
                    details: e.details,
                    categoryId: e.categoryId,
                    payingAccountId: e.payingAccountId,
                  }),
                });

                location.reload();
              }}
            >
              ✏️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}