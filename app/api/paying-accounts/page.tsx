"use client";

import { useEffect, useState } from "react";

type PayingAccount = {
  id: string;
  name: string;
};

export default function PayingAccountsPage() {
  const [accounts, setAccounts] = useState<PayingAccount[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await fetch("/api/paying-accounts");
    const data = await res.json();
    setAccounts(data);
  };

  
useEffect(() => {
  (async () => {
    const res = await fetch("/api/paying-accounts");
    setAccounts(await res.json());
  })();
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
    await fetch(`/api/paying-accounts/${id}`, {
      method: "DELETE",
    });
    load();
  };

  return (
    <div>
      <h1>Conturi plătitoare</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Cont nou"
      />
      <button type="button" onClick={add}>
        Adaugă
      </button>

      <ul>
        {accounts.map((a) => (
          <li key={a.id}>
            {a.name}
            <button type="button" onClick={() => remove(a.id)}>
              🗑
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}