import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const workbook = new ExcelJS.Workbook();

    /* ================= ACCOUNTS ================= */
    const accountsSheet = workbook.addWorksheet("Accounts");
    accountsSheet.columns = [
      { header: "Cont", key: "name", width: 25 },
      { header: "Intrări (RON)", key: "income", width: 18 },
      { header: "Ieșiri (RON)", key: "expense", width: 18 },
      { header: "Sold (RON)", key: "balance", width: 18 },
      { header: "Nr. tranzacții", key: "count", width: 18 },
    ];

    const accounts = await prisma.payingAccount.findMany({
      include: { transactions: true },
    });

    for (const a of accounts) {
      const income = a.transactions
        .filter((t) => t.type === "INCOME")
        .reduce((s: number, t) => s + t.amount, 0);

      const expense = a.transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((s: number, t) => s + t.amount, 0);

      accountsSheet.addRow({
        name: a.name,
        income,
        expense,
        balance: income - expense,
        count: a.transactions.length,
      });
    }

    /* ================= CATEGORIES ================= */
    const categoriesSheet = workbook.addWorksheet("Categories");
    categoriesSheet.columns = [
      { header: "Categorie", key: "name", width: 25 },
      { header: "Total (RON)", key: "total", width: 18 },
    ];

    const categories = await prisma.category.findMany({
      include: { expenses: true },
    });

    for (const c of categories) {
      const total = c.expenses.reduce(
        (s: number, e) => s + e.amount,
        0
      );
      categoriesSheet.addRow({
        name: c.name,
        total,
      });
    }

    /* ================= EXPENSES ================= */
    const expensesSheet = workbook.addWorksheet("Expenses");
    expensesSheet.columns = [
      { header: "Data", key: "date", width: 15 },
      { header: "Categorie", key: "category", width: 20 },
      { header: "Sumă (RON)", key: "amount", width: 15 },
      { header: "Descriere", key: "details", width: 30 },
    ];

    const expenses = await prisma.expense.findMany({
      include: { category: true },
    });

    for (const e of expenses) {
      expensesSheet.addRow({
        date: new Date(e.date).toLocaleDateString(),
        category: e.category?.name ?? "",
        amount: e.amount,
        details: e.details ?? "",
      });
    }

    /* ================= TRANSACTIONS ================= */
    const transactionsSheet =
      workbook.addWorksheet("Transactions");
    transactionsSheet.columns = [
      { header: "Data", key: "date", width: 15 },
      { header: "Tip", key: "type", width: 15 },
      { header: "Sumă (RON)", key: "amount", width: 15 },
    ];

    const transactions =
      await prisma.accountTransaction.findMany();

    for (const t of transactions) {
      transactionsSheet.addRow({
        date: new Date(t.createdAt).toLocaleDateString(),
        type: t.type,
        amount: t.amount,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          `attachment; filename="global-export-${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("EXPORT GLOBAL EXCEL ERROR:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}