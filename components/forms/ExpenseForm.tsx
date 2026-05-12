"use client";

import { useForm } from "react-hook-form";

export function ExpenseForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <input type="date" {...register("date")} />
      <input placeholder="Detalii" {...register("details")} />
      <input type="number" {...register("amount")} />
      <select {...register("type")}>
        <option value="PERSONAL">Personal</option>
        <option value="BUSINESS">Business</option>
      </select>
      <button className="bg-blue-600 text-white p-2">Salvează</button>
    </form>
  );
}