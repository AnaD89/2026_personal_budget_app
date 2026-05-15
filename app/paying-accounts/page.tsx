"use client";

import { useEffect, useState } from "react";
import ExportButtons from "@/components/ExportButtons";
import styles from "./page.module.css";

/* ================= TIPURI ================= */
type PayingAccount = {
  id: string;
  name: string;
  balance: number; // suportă decimale
  currency: string;
};

/* ================= COMPONENTĂ ================= */
export default function PayingAccountsPage() {
  /* ================= STATE ================= */
  const [accounts, setAccounts] = useState<PayingAccount[]>([]);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("RON");

  // ✅ acceptă și undefined pentru reset input
  const [adjustValues, setAdjustValues] =
    useState<Record<string, number | undefined>>({});

  /* ================= LOAD ================= */
  const load = async () => {
    const res = await fetch("/api/paying-accounts");
    const data = await res.json();
    setAccounts(data);
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= ADD ================= */
  const add = async () => {
    if (!name) return;

    await fetch("/api/paying-accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        currency,
      }),
    });

    setName("");
    setCurrency("RON");
    load();
  };

  /* ================= ADJUST ================= */
  const adjust = async (id: string) => {
    const amount = adjustValues[id];

    if (amount === undefined || Number.isNaN(amount)) {
      alert("Introdu o sumă validă");
      return;
    }

    const reason = prompt("Motiv ajustare sold:");
    if (!reason) return;

    const res = await fetch(
      `/api/paying-accounts/${id}/adjust`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount, // ✅ decimal (ex: 92.71)
          reason,
        }),
      }
    );

    if (!res.ok) {
      let message = "Eroare la ajustarea soldului";

      try {
        const data = await res.json();
        if (data?.error) message = data.error;
      } catch {
        // body gol → ignorăm
      }

      alert(message);
      return;
    }

    // ✅ reîncarcă datele
    await load();

    // ✅ golește inputul DOAR pentru acest cont
    setAdjustValues((prev) => ({
      ...prev,
      [id]: undefined,
    }));
  };

  /* ================= REMOVE ================= */
  const remove = async (id: string) => {
    if (!confirm("Ștergi acest cont?")) return;

    const res = await fetch(
      `/api/paying-accounts/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      let message = "Nu s-a putut șterge contul.";

      try {
        const data = await res.json();
        if (data?.error) message = data.error;
      } catch {
        // body gol → ignorăm
      }

      alert(message);
      return;
    }

    alert("✅ Cont șters");
    load();
  };

  /* ================= UI ================= */
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Conturi plătitoare
        </h1>

        <ExportButtons
          pdfUrl="/api/export/paying-accounts/pdf"
          excelUrl="/api/export/paying-accounts/excel"
        />

        <div className={styles.addBox}>
          <input
            className={styles.input}
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Cont nou (ex: Revolut)"
          />

          <select
            className={styles.select}
            value={currency}
            onChange={(e) =>
              setCurrency(e.target.value)
            }
          >
            <option value="RON">RON</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="CHF">CHF</option>
          </select>

          <button
            className={styles.primaryBtn}
            onClick={add}
          >
            Adaugă
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {accounts.map((a) => (
          <div key={a.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.name}>
                  {a.name}
                </div>
                <div className={styles.balance}>
                  Sold: {Number(a.balance).toFixed(2)}{" "}
                  {a.currency}
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