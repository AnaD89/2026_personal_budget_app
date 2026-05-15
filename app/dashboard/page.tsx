
// Importă componenta pentru export PDF / Excel
import ExportButtons from "@/components/ExportButtons";

// Componenta principală a paginii Dashboard
export default function DashboardPage() {
  // Returnează JSX-ul paginii
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        {/* Titlul principal al paginii */}
        Dashboard Buget
      </h1>

      {/* Componentă reutilizabilă pentru export date */}
      <ExportButtons
        // Endpoint pentru export PDF
        pdfUrl="/api/export/global/pdf"
        // Endpoint pentru export Excel
        excelUrl="/api/export/global/excel"
      />
    </div>
  );
}