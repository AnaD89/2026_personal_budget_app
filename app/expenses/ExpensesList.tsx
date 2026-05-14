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
  expenses,
}: {
  expenses: Expense[];
}) {
  const { showToast } = useToast();

  // ✅ STATE TREBUIE SĂ FIE AICI
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
                  if (!confirm("Ștergi această cheltuială?")) return;

                  await fetch(`/api/expenses/${e.id}`, {
                    method: "DELETE",
                  });

                  showToast("Cheltuială ștearsă", "success");
                  location.reload();
                }}
              >
                🗑
              </button>

              {/* EDIT → DESCHIDE MODAL */}
              <button onClick={() => setEditing(e)}>✏️</button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ MODAL AFIȘAT CONDIȚIONAL */}
      {editing && (
        <EditExpenseModal
          expense={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}