"use client";

import { useEffect, useState } from "react";
import AccountBalances from "@/components/AccountBalances";
import AddExpenseForm from "@/components/AddExpenseForm";

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
          console.warn("Expenses API returned:", data);
          setExpenses([]);
        }
      })
      .catch((err) => {
        console.error("Fetch expenses error:", err);
        setExpenses([]);
      });
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

        {/* ✅ AICI SE FOLOSEȘTE DESIGNUL IDENTIC CU REPORTS */}
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

      {/* ================= LISTĂ CHELTUIELI ================= */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Cheltuieli recente
        </h2>

        <div className="space-y-4">
          {expenses.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              {/* STÂNGA – DETALII */}
              <div className="flex flex-col gap-1">
                <span className="text-base font-semibold">
                  {e.details || "—"}
                </span>

                <span className="text-sm text-gray-500">
                  {new Date(e.date).toLocaleDateString("ro-RO")} •{" "}
                  {e.payingAccount?.name ?? "—"}
                </span>
              </div>

              {/* DREAPTA – SUMA */}
              <div className="flex flex-col items-end">
                <span className="text-xl font-bold text-red-600">
                  −{e.amount} RON
                </span>

                <span className="text-xs text-gray-400">
                  cheltuială
                </span>
              </div>
            </div>
          ))}

          {expenses.length === 0 && (
            <div className="italic text-gray-500">
              Nu există cheltuieli.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}