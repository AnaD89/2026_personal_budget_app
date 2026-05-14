import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" },
      include: {
        category: true,
        payingAccount: true,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Cheltuieli");

    sheet.columns = [
      { header: "Data", key: "date", width: 15 },
      { header: "Tip", key: "type", width: 15 },
      { header: "Descriere", key: "details", width: 30 },
      { header: "Categorie", key: "category", width: 20 },
      { header: "Cont", key: "account", width: 20 },
      { header: "Sumă (RON)", key: "amount", width: 15 },
    ];

    let total = 0;

    for (const e of expenses) {
      total += e.amount;

      sheet.addRow({
        date: new Date(e.date).toLocaleDateString(),
        type: e.type,
        details: e.details ?? "",
        category: e.category?.name ?? "",
        account: e.payingAccount?.name ?? "",
        amount: e.amount,
      });
    }

    sheet.addRow({});
    sheet.addRow({
      details: "TOTAL CHELTUIELI",
      amount: total,
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          `attachment; filename="expenses-${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("EXPORT EXPENSES EXCEL ERROR:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}