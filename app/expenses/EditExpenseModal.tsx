"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useToast } from "@/components/ToastProvider";

type Category = {
  id: string;
  name: string;
};

type PayingAccount = {
  id: string;
  name: string;
};

type Expense = {
  id: string;
  date: string; // Date serializat (ISO)
  amount: number;
  details: string;
  type: "PERSONAL" | "BUSINESS";
  categoryId: string | null;
  payingAccountId: string | null;
  isRecurring: boolean;
};

export default function EditExpenseModal({
  expense,
  onClose,
  onSaved,
}: {
  expense: Expense;
  onClose: () => void;
  onSaved: (expense: Expense) => void;
}) {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    date: new Date(expense.date).toISOString().slice(0, 10),
    amount: String(expense.amount),
    details: expense.details,
    type: expense.type,
    categoryId: expense.categoryId ?? "",
    payingAccountId: expense.payingAccountId ?? "",
    isRecurring: expense.isRecurring,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<PayingAccount[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);

    fetch("/api/paying-accounts")
      .then((r) => r.json())
      .then(setAccounts);
  }, []);

  const save = async () => {
    const amount = Number(form.amount);

    if (!form.date || Number.isNaN(amount)) {
      showToast("Date invalide", "error");
      return;
    }

    const res = await fetch(`/api/expenses/${expense.id}/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: form.date,
        amount,
        details: form.details,
        type: form.type,
        categoryId: form.categoryId || null,
        payingAccountId: form.payingAccountId || null,
        isRecurring: form.isRecurring,
      }),
    });

    if (!res.ok) {
      showToast("Eroare la salvare", "error");
      return;
    }

    const updatedExpense: Expense = await res.json();

    showToast("Cheltuială actualizată", "success");
    onSaved(updatedExpense);
    onClose();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>Editează cheltuiala</h2>

        <input
          type="date"
          className={styles.input}
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          type="number"
          className={styles.input}
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          className={styles.input}
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
        />

        <select
          className={styles.select}
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value as "PERSONAL" | "BUSINESS",
            })
          }
        >
          <option value="PERSONAL">Personal</option>
          <option value="BUSINESS">Business</option>
        </select>

        <select
          className={styles.select}
          value={form.categoryId}
          onChange={(e) =>
            setForm({ ...form, categoryId: e.target.value })
          }
        >
          <option value="">Fără categorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={form.payingAccountId}
          onChange={(e) =>
            setForm({ ...form, payingAccountId: e.target.value })
          }
        >
          <option value="">Fără cont</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={form.isRecurring}
            onChange={(e) =>
              setForm({ ...form, isRecurring: e.target.checked })
            }
          />
          Cheltuială recurentă
        </label>

        <div className={styles.modalActions}>
          <button onClick={onClose}>Anulează</button>
          <button className={styles.primaryBtn} onClick={save}>
            Salvează
          </button>
        </div>
      </div>
    </div>
  );
}