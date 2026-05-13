"use client";

import { useEffect, useState } from "react";

type PayingAccount = {
  id: string;
  name: string;
  balance: number;
};

export default function PayingAccountsPage() {
  const [accounts, setAccounts] = useState<PayingAccount[]>([]);
  const [name, setName] = useState("");

  // ✅ încărcare conturi
  const load = async () => {
    const res = await fetch("/api/paying-accounts");
    const data: PayingAccount[] = await res.json();
    setAccounts(data);
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ adăugare cont
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

  // ✅ ștergere cont
  const remove = async (id: string) => {
    if (!confirm("Ștergi acest cont?")) return;

    await fetch(`/api/paying-accounts/${id}`, {
      method: "DELETE",
    });

    load();
  };

  // ✅ ajustare manuală sold
  const adjust = async (id: string, amount: number) => {
    const reason = prompt("Motiv ajustare:");

    if (!amount || !reason) return;

    await fetch(`/api/paying-accounts/${id}/adjust`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, reason }),
    });

    load();
  };

  return (
    <div>
      <h1>Conturi plătitoare</h1>

      <div style={{ marginBottom: 16 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Cont nou (ex: Revolut)"
        />
        <button type="button" onClick={add}>
          Adaugă
        </button>
      </div>

      <ul>
        {accounts.map((a) => (
          <li key={a.id}>
            {a.name} – Sold: {a.balance} RON
            <button
              type="button"
              onClick={() => adjust(a.id, 100)}
              style={{ marginLeft: 8 }}
            >
              +100
            </button>
            <button
              type="button"
              onClick={() => adjust(a.id, -100)}
              style={{ marginLeft: 4 }}
            >
              -100
            </button>
            <button
              type="button"
              onClick={() => remove(a.id)}
              style={{ marginLeft: 8 }}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}