"use client";

import { createContext, useContext, useState } from "react";
import styles from "./Toast.module.css";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: ToastType = "info"
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className={styles.container}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${styles[t.type]}`}
          >
            <span>{t.message}</span>
            <button
              className={styles.close}
              onClick={() =>
                setToasts((prev) =>
                  prev.filter((x) => x.id !== t.id)
                )
              }
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
}