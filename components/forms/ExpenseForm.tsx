"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, type ExpenseInput } from "@/lib/validations";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function ExpenseForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
  });

  const onSubmit = async (data: ExpenseInput) => {
    if (!session?.user?.email) {
      setError("You must be logged in");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create expense");
      }

      setSuccess(true);
      reset();
      setTimeout(() => {
        router.refresh();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 max-w-md">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ Expense created successfully!
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          {...register("date")}
          className="w-full border rounded px-3 py-2"
        />
        {errors.date && (
          <span className="text-red-500 text-sm">{errors.date.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amount (RON)</label>
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("amount")}
          className="w-full border rounded px-3 py-2"
        />
        {errors.amount && (
          <span className="text-red-500 text-sm">{errors.amount.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Details</label>
        <input
          placeholder="What did you spend on?"
          {...register("details")}
          className="w-full border rounded px-3 py-2"
        />
        {errors.details && (
          <span className="text-red-500 text-sm">{errors.details.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          {...register("type")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="PERSONAL">Personal</option>
          <option value="BUSINESS">Business</option>
        </select>
        {errors.type && (
          <span className="text-red-500 text-sm">{errors.type.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition"
      >
        {isSubmitting ? "Saving..." : "Save Expense"}
      </button>
    </form>
  );
}