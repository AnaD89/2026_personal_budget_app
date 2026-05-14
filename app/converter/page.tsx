"use client";

import { useEffect, useState } from "react";
import CurrencyChart from "./CurrencyChart";

type Rates = {
  EUR: number;
  USD: number;
  CHF: number;
};

type HistoryItem = {
  date: string;
  rates: Rates;
};

export default function ConverterPage() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] =
    useState<keyof Rates>("EUR");
  const [direction, setDirection] = useState<
    "RON_TO_FX" | "FX_TO_RON"
  >("RON_TO_FX");

  useEffect(() => {
    fetch("/api/bnr/rates")
      .then((r) => r.json())
      .then((data) => {
        setRates(data.today);
        setHistory(data.history);
      });
  }, []);

  if (!rates) {
    return <p>Se încarcă cursul BNR…</p>;
  }

  const result =
    direction === "RON_TO_FX"
      ? (amount / rates[currency]).toFixed(2)
      : (amount * rates[currency]).toFixed(2);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Conversie valutară (BNR)
      </h1>

      {/* CONVERTER */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm">
            Sumă
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(Number(e.target.value))
            }
            className="border px-2 py-1 w-32"
          />
        </div>

        <div>
          <label className="block text-sm">
            Direcție
          </label>
          <select
            value={direction}
            onChange={(e) =>
              setDirection(
                e.target.value as
                  | "RON_TO_FX"
                  | "FX_TO_RON"
              )
            }
            className="border px-2 py-1"
          >
            <option value="RON_TO_FX">
              RON → Valută
            </option>
            <option value="FX_TO_RON">
              Valută → RON
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm">
            Valută
          </label>
          <select
            value={currency}
            onChange={(e) =>
              setCurrency(
                e.target.value as keyof Rates
              )
            }
            className="border px-2 py-1"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="CHF">CHF</option>
          </select>
        </div>

        <div className="font-semibold">
          {direction === "RON_TO_FX" ? (
            <>
              {amount} RON = {result} {currency}
            </>
          ) : (
            <>
              {amount} {currency} = {result} RON
            </>
          )}
        </div>
      </div>

      {/* CURS AZI */}
      <section>
        <h2 className="font-semibold">
          Curs BNR – Azi
        </h2>
        <ul className="list-disc ml-6">
          <li>EUR: {rates.EUR}</li>
          <li>USD: {rates.USD}</li>
          <li>CHF: {rates.CHF}</li>
        </ul>
      </section>

      {/* ISTORIC + GRAFIC */}
      <section>
        <h2 className="font-semibold">
          Istoric ultimele 5 zile
        </h2>

        <table className="border mt-2">
          <thead>
            <tr>
              <th className="border px-2">Data</th>
              <th className="border px-2">EUR</th>
              <th className="border px-2">USD</th>
              <th className="border px-2">CHF</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.date}>
                <td className="border px-2">
                  {h.date}
                </td>
                <td className="border px-2">
                  {h.rates.EUR}
                </td>
                <td className="border px-2">
                  {h.rates.USD}
                </td>
                <td className="border px-2">
                  {h.rates.CHF}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <CurrencyChart data={history} />
      </section>
    </main>
  );
}