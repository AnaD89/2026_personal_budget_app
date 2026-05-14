import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accounts = await prisma.payingAccount.findMany({
      include: {
        transactions: true,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Conturi");

    sheet.columns = [
      { header: "Cont", key: "name", width: 25 },
      { header: "Intrări (RON)", key: "income", width: 18 },
      { header: "Ieșiri (RON)", key: "expense", width: 18 },
      { header: "Sold (RON)", key: "balance", width: 18 },
      { header: "Nr. tranzacții", key: "count", width: 18 },
    ];

    for (const a of accounts) {
      const income = a.transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum: number, t) => sum + t.amount, 0);

      const expense = a.transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum: number, t) => sum + t.amount, 0);

      sheet.addRow({
        name: a.name,
        income,
        expense,
        balance: income - expense,
        count: a.transactions.length,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          `attachment; filename="accounts-${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("EXPORT ACCOUNTS EXCEL ERROR:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}