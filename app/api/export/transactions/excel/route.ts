import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const transactions = await prisma.accountTransaction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        payingAccount: true,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Tranzacții");

    sheet.columns = [
      { header: "Data", key: "date", width: 15 },
      { header: "Tip", key: "type", width: 15 },
      { header: "Descriere", key: "description", width: 30 },
      { header: "Cont", key: "account", width: 20 },
      { header: "Sumă (RON)", key: "amount", width: 15 },
    ];

    let total = 0;

    for (const t of transactions) {
      total += t.amount;

      sheet.addRow({
        date: new Date(t.createdAt).toLocaleDateString(),
        type: t.type,
        description: t.description ?? "",
        account: t.payingAccount.name,
        amount: t.amount,
      });
    }

    sheet.addRow({});
    sheet.addRow({
      description: "TOTAL",
      amount: total,
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          `attachment; filename="transactions-${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("EXPORT TRANSACTIONS EXCEL ERROR:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}