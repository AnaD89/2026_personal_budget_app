"use client";

import { useEffect, useState } from "react";
import styles from "@/app/expenses/page.module.css";

type Category = {
  id: string;
  name: string;
};

type PayingAccount = {
  id: string;
  name: string;
};

type ExpenseFormState = {
  date: string;
  amount: string;
  details: string;
  type: "PERSONAL" | "BUSINESS";
  categoryId: string;
  payingAccountId: string;
  isRecurring: boolean;
};

export default function AddExpenseForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [form, setForm] = useState<ExpenseFormState>({
    date: "",
    amount: "",
    details: "",
    type: "PERSONAL",
    categoryId: "",
    payingAccountId: "",
    isRecurring: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] =
    useState<PayingAccount[]>([]);

  /* ===== LOAD DROPDOWNS ===== */
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);

    fetch("/api/paying-accounts")
      .then((res) => res.json())
      .then(setAccounts);
  }, []);

  /* ===== SUBMIT ===== */
  const submit = async () => {
    if (!form.date || !form.amount || !form.details) {
      alert("❌ Completează toate câmpurile obligatorii");
      return;
    }

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: form.date,
          amount: Number(form.amount),
          details: form.details,
          type: form.type,
          isRecurring: form.isRecurring,
          categoryId: form.categoryId || null,
          payingAccountId:
            form.payingAccountId || null,
        }),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const text = await response.text();
        alert(
          `❌ Eroare API (${response.status})\n${text}`
        );
        return;
      }

      alert("✅ Cheltuială salvată");

      // ✅ reset form
      setForm({
        date: "",
        amount: "",
        details: "",
        type: "PERSONAL",
        categoryId: "",
        payingAccountId: "",
        isRecurring: false,
      });

      // ✅ notifică pagina părinte
      onSuccess?.();
    } catch (err) {
      alert("❌ Eroare JS: " + String(err));
    }
  };

  return (
    <form className={styles.form}>
      <input
        type="date"
        className={styles.input}
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />

      <input
        type="number"
        className={styles.input}
        placeholder="Sumă"
        value={form.amount}
        onChange={(e) =>
          setForm({
            ...form,
            amount: e.target.value,
          })
        }
      />

      <input
        className={styles.input}
        placeholder="Detalii"
        value={form.details}
        onChange={(e) =>
          setForm({
            ...form,
            details: e.target.value,
          })
        }
      />

      <select
        className={styles.select}
        value={form.type}
        onChange={(e) =>
          setForm({
            ...form,
            type: e.target.value as
              | "PERSONAL"
              | "BUSINESS",
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
          setForm({
            ...form,
            categoryId: e.target.value,
          })
        }
      >
        <option value="">
          Selectează categorie
        </option>
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
          setForm({
            ...form,
            payingAccountId: e.target.value,
          })
        }
      >
        <option value="">
          Selectează cont
        </option>
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
            setForm({
              ...form,
              isRecurring: e.target.checked,
            })
          }
        />
        Cheltuială lunară
      </label>

      <button
        type="button"
        className={styles.primaryBtn}
        onClick={submit}
      >
        Salvează
      </button>
    </form>
  );
}
