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
  const [adjustValues, setAdjustValues] = useState<Record<string, number>>({});

  const load = async () => {
    const res = await fetch("/api/paying-accounts");
    const data: PayingAccount[] = await res.json();
    setAccounts(data);
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

    // ✅ reset doar pentru acest cont
    setAdjustValues((prev) => ({ ...prev, [id]: 0 }));
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
          <li key={a.id} style={{ marginBottom: 12 }}>
            <strong>{a.name}</strong> – Sold: {a.balance} RON

            <div style={{ marginTop: 4 }}>
              <input
                type="number"
                placeholder="Ajustare (+ / -)"
                value={adjustValues[a.id] ?? ""}
                onChange={(e) =>
                  setAdjustValues((prev) => ({
                    ...prev,
                    [a.id]: Number(e.target.value),
                  }))
                }
                style={{ width: 120 }}
              />

              <button
                type="button"
                onClick={() => adjust(a.id)}
                style={{ marginLeft: 8 }}
              >
                Ajustează
              </button>

              <button
                type="button"
                onClick={() => remove(a.id)}
                style={{ marginLeft: 12 }}
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}