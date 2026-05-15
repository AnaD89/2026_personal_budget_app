import ExportButtons from "@/components/ExportButtons";
import AddExpenseForm from "@/components/AddExpenseForm";
import AddIncomeForm from "@/components/AddIncomeForm";

export default function DashboardPage() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        Dashboard Buget
      </h1>

      <ExportButtons
        pdfUrl="/api/export/global/pdf"
        excelUrl="/api/export/global/excel"
      />
    </div>
  );
}