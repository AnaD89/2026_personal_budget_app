import { ExpenseForm } from "@/components/forms/ExpenseForm";

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Adaugă cheltuială</h1>
      <ExpenseForm />
    </div>
  );
}