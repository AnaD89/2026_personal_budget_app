"use client";

import { useEffect, useState } from "react";
import styles from "./AccountBalances.module.css";

type Balance = {
  id: string;
  name: string;
  balance: number;
};

export default function AccountBalances({
  refreshKey,
}: {
  refreshKey: number;
}) {
  const [balances, setBalances] = useState<Balance[]>([]);

  useEffect(() => {
    fetch("/api/balances", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBalances(data);
        } else {
          setBalances([]);
        }
      });
  }, [refreshKey]);

  return (
    <div className={styles.cards}>
      {balances.map((b) => (
        <div key={b.id} className={styles.card}>
          <div className={styles.cardTitle}>
            {b.name}
          </div>

          <div
            className={`${styles.cardValue} ${
              b.balance >= 0
                ? styles.positive
                : styles.negative
            }`}
          >
            {b.balance} RON
          </div>
        </div>
      ))}
    </div>
  );
}