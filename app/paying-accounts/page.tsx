"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type PayingAccount = {
  id: string;
  name: string;
  balance: number;
};

export default function PayingAccountsPage() {
  const [accounts, setAccounts] = useState<PayingAccount[]>([]);
  const [name, setName] = useState("");
  const [adjustValues, setAdjustValues] = useState<Record<string, number>>({});

  const load = async () => {
    const res = await fetch("/api/paying-accounts");
    setAccounts(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!name) return;

    await fetch("/api/paying-accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Ștergi acest cont?")) return;
    await fetch(`/api/paying-accounts/${id}`, { method: "DELETE" });
    load();
  };

  const adjust = async (id: string) => {
    const amount = adjustValues[id];
    if (amount === undefined || Number.isNaN(amount)) return;

    const reason = prompt("Motiv ajustare sold:");
    if (!reason) return;

    await fetch(`/api/paying-accounts/${id}/adjust`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, reason }),
    });

    setAdjustValues((prev) => ({ ...prev, [id]: 0 }));
    load();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Conturi plătitoare</h1>

        <div className={styles.addBox}>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cont nou (ex: Revolut)"
          />
          <button className={styles.primaryBtn} onClick={add}>
            Adaugă
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {accounts.map((a) => (
          <div key={a.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.name}>{a.name}</div>
                <div className={styles.balance}>
                  Sold: {a.balance} RON
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <input
                type="number"
                className={styles.adjustInput}
                placeholder="+ / -"
                value={adjustValues[a.id] ?? ""}
                onChange={(e) =>
                  setAdjustValues((prev) => ({
                    ...prev,
                    [a.id]: Number(e.target.value),
                  }))
                }
              />

              <button
                className={styles.adjustBtn}
                onClick={() => adjust(a.id)}
              >
                Ajustează
              </button>

              <button
                className={styles.deleteBtn}
                onClick={() => remove(a.id)}
              >
                Șterge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}