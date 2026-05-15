"use client";

import { useEffect, useState } from "react";
import styles from "@/app/expenses/page.module.css";

type PayingAccount = {
  id: string;
  name: string;
};

type IncomeFormState = {
  date: string;
  amount: string;
  details: string;
  payingAccountId: string;
};

export default function AddIncomeForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [form, setForm] = useState<IncomeFormState>({
    date: "",
    amount: "",
    details: "",
    payingAccountId: "",
  });

  const [accounts, setAccounts] = useState<PayingAccount[]>([]);

  // ✅ load conturi
  useEffect(() => {
    fetch("/api/paying-accounts")
      .then((res) => res.json())
      .then(setAccounts);
  }, []);

  const submit = async () => {
    if (
      !form.date ||
      !form.amount ||
      !form.details ||
      !form.payingAccountId
    ) {
      alert("Completează toate câmpurile");
      return;
    }

    const res = await fetch("/api/incomes", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: form.date,
        amount: Number(form.amount),
        details: form.details,
        payingAccountId: form.payingAccountId,
      }),
    });

    if (!res.ok) {
      alert("Eroare la salvarea încasării");
      return;
    }

    // ✅ reset form
    setForm({
      date: "",
      amount: "",
      details: "",
      payingAccountId: "",
    });

    onSuccess?.();
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
        value={form.payingAccountId}
        onChange={(e) =>
          setForm({
            ...form,
            payingAccountId: e.target.value,
          })
        }
      >
        <option value="">Selectează cont</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        className={styles.primaryBtn}
        onClick={submit}
      >
        Salvează încasare
      </button>
    </form>
  );
}