import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        expenses: true,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Categorii");

    sheet.columns = [
      { header: "Categorie", key: "name", width: 30 },
      { header: "Total (RON)", key: "total", width: 15 },
      { header: "Nr. tranzacții", key: "count", width: 18 },
    ];

    for (const c of categories) {
  const total = c.expenses.reduce(
    (sum: number, e: { amount: number }) => sum + e.amount,
    0
  );

  sheet.addRow({
    name: c.name,
    total,
    count: c.expenses.length,
  });
}

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          `attachment; filename="categories-${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("EXPORT CATEGORIES EXCEL ERROR:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}