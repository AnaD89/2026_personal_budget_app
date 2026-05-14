"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useToast } from "@/components/ToastProvider";
import EditExpenseModal from "./EditExpenseModal";

type Expense = {
  id: string;
  amount: number;
  date: string;
  details: string;
  type: "PERSONAL" | "BUSINESS";
  categoryId: string | null;
  payingAccountId: string | null;
  isRecurring: boolean;
  category?: { name: string } | null;
  payingAccount?: { name: string } | null;
};

export default function ExpensesList({
  expenses: initialExpenses,
}: {
  expenses: Expense[];
}) {
  const { showToast } = useToast();

  // ✅ STATE LOCAL (fără reload)
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [editing, setEditing] = useState<Expense | null>(null);

  return (
    <>
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
                  await fetch(`/api/expenses/${e.id}`, {
                    method: "DELETE",
                  });

                  setExpenses((prev) =>
                    prev.filter((x) => x.id !== e.id)
                  );

                  showToast("Cheltuială ștearsă", "success");
                }}
              >
                🗑
              </button>

              {/* EDIT */}
              <button onClick={() => setEditing(e)}>✏️</button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ MODAL DE EDIT */}
      {editing && (
        <EditExpenseModal
          expense={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setExpenses((prev) =>
              prev.map((e) =>
                e.id === updated.id ? updated : e
              )
            );
          }}
        />
      )}
    </>
  );
}