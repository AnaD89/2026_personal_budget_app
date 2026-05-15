"use client";

import { useEffect, useState } from "react";
import AccountBalances from "@/components/AccountBalances";
import AddExpenseForm from "@/components/AddExpenseForm";
import AddIncomeForm from "@/components/AddIncomeForm";

// ✅ REFOLOSIM EXACT STILURILE DE TRANSACTIONS
import styles from "@/app/transactions/page.module.css";

type Expense = {
  id: string;
  date: string;
  amount: number;
  details: string;
  payingAccount?: {
    name: string;
  };
};

export default function ExpensesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // ✅ Load cheltuieli (CU credentials)
  useEffect(() => {
    fetch("/api/expenses", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExpenses(data);
        } else if (Array.isArray(data?.data)) {
          setExpenses(data.data);
        } else {
          setExpenses([]);
        }
      })
      .catch(() => setExpenses([]));
  }, [refreshKey]);

  return (
    <main className="p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* TITLU */}
      <h1 className="text-2xl font-bold">
        Cheltuieli
      </h1>

      {/* ================= SOLDURI CONTURI ================= */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Solduri conturi
        </h2>

        <AccountBalances refreshKey={refreshKey} />
      </section>

      {/* ================= ADAUGĂ CHELTUIALĂ ================= */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Adaugă cheltuială
        </h2>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <AddExpenseForm
            onSuccess={() =>
              setRefreshKey((k) => k + 1)
            }
          />
        </div>
      </section>

      {/* ================= LISTĂ CHELTUIELI (IDENTICĂ CU TRANSACTIONS) ================= */}
      <section>
        <h2 className="text-lg font-semibold mb-2">
          Cheltuieli recente
        </h2>

        <div className={styles.list}>
          {expenses.map((e) => (
            <div key={e.id} className={styles.row}>
              <div>
                <div>{e.details ?? "—"}</div>

                <div className={styles.meta}>
                  {e.payingAccount?.name ?? "—"} •{" "}
                  {new Date(e.date).toLocaleString()}
                </div>
              </div>

              <div className={styles.negative}>
                −{e.amount} RON
              </div>
            </div>
          ))}

          {expenses.length === 0 && (
            <div className={styles.meta}>
              Nu există cheltuieli.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}