"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Transaction = {
  id: string;
  amount: number;
  type: "EXPENSE" | "INCOME" | "ADJUSTMENT";
  description: string | null;
  createdAt: string;
  payingAccount: {
    name: string;
  };
};

type Account = {
  id: string;
  name: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // ✅ filtre
  const [type, setType] = useState("");
  const [accountId, setAccountId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");

  // ✅ load conturi
  useEffect(() => {
    fetch("/api/paying-accounts")
      .then((r) => r.json())
      .then(setAccounts);
  }, []);

  // ✅ load tranzacții (implicit + filtre)
  useEffect(() => {
    const params = new URLSearchParams();

    if (type) params.set("type", type);
    if (accountId) params.set("accountId", accountId);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (q) params.set("q", q);

    fetch(`/api/transactions?${params.toString()}`)
      .then((r) => r.json())
      .then(setTransactions);
  }, [type, accountId, from, to, q]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Istoric tranzacții</h1>

      {/* FILTRE */}
      <div className={styles.filters}>
  <select value={type} onChange={(e) => setType(e.target.value)}>
    <option value="">Toate tipurile</option>
    <option value="EXPENSE">Cheltuieli</option>
    <option value="INCOME">Încasări</option>
    <option value="ADJUSTMENT">Ajustări</option>
  </select>

  <select
    value={accountId}
    onChange={(e) => setAccountId(e.target.value)}
  >
    <option value="">Toate conturile</option>
    {accounts.map((a) => (
      <option key={a.id} value={a.id}>
        {a.name}
      </option>
    ))}
  </select>

  <input
    type="date"
    value={from}
    onChange={(e) => setFrom(e.target.value)}
  />

  <input
    type="date"
    value={to}
    onChange={(e) => setTo(e.target.value)}
  />

  <input
    placeholder="Caută descriere"
    value={q}
    onChange={(e) => setQ(e.target.value)}
  />

  {/* ✅ RESET FILTRE */}
  <button
    type="button"
    className={styles.resetBtn}
    onClick={() => {
      setType("");
      setAccountId("");
      setFrom("");
      setTo("");
      setQ("");
    }}
  >
    Reset filtre
  </button>
</div>

      {/* LISTĂ */}
      <div className={styles.list}>
        {transactions.map((t) => (
          <div key={t.id} className={styles.row}>
            <div>
              <div>{t.description ?? "—"}</div>
              <div className={styles.meta}>
                {t.payingAccount.name} •{" "}
                {new Date(t.createdAt).toLocaleString()}
              </div>
            </div>

            <div
              className={
                t.amount < 0 ? styles.negative : styles.positive
              }
            >
              {t.amount > 0 ? "+" : ""}
              {t.amount} RON
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}