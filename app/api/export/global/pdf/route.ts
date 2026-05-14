export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { PassThrough, Readable } from "stream";
import path from "path";

export async function GET() {
  try {
    // ✅ dynamic import (NU import static)
    const PDFDocument = (await import("pdfkit")).default;

    const accounts = await prisma.payingAccount.findMany({
      include: { transactions: true },
    });

    const categories = await prisma.category.findMany({
      include: { expenses: true },
    });

    const expenses = await prisma.expense.findMany({
      include: {
        category: true,
        payingAccount: true,
      },
    });

    const transactions = await prisma.accountTransaction.findMany({
      include: {
        payingAccount: true,
      },
    });

    // ✅ font TTF explicit
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Roboto-Regular.ttf"
    );

    // ✅ font setat în constructor (dezactivează Helvetica)
    const doc = new PDFDocument({
      margin: 40,
      font: fontPath,
    });

    const nodeStream = new PassThrough();
    doc.pipe(nodeStream);

    // ✅ TITLU
    doc.fontSize(20).text("Export Global – Budget App", {
      align: "center",
    });
    doc.moveDown(2);

    // ✅ CONTURI
    doc.fontSize(16).text("Conturi", { underline: true });
    doc.moveDown();

    for (const a of accounts) {
      const income = a.transactions
        .filter((t) => t.type === "INCOME")
        .reduce((s: number, t) => s + t.amount, 0);

      const expense = a.transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((s: number, t) => s + t.amount, 0);

      doc
        .fontSize(12)
        .text(a.name)
        .text(`  Intrări: ${income} RON`)
        .text(`  Ieșiri: ${expense} RON`)
        .text(`  Sold: ${income - expense} RON`);
      doc.moveDown();
    }

    // ✅ CATEGORII
    doc.addPage();
    doc.fontSize(16).text("Categorii", { underline: true });
    doc.moveDown();

    for (const c of categories) {
      const total = c.expenses.reduce(
        (s: number, e) => s + e.amount,
        0
      );
      doc.fontSize(12).text(`${c.name}: ${total} RON`);
    }

    // ✅ CHELTUIELI
    doc.addPage();
    doc.fontSize(16).text("Cheltuieli", { underline: true });
    doc.moveDown();

    for (const e of expenses) {
      doc
        .fontSize(11)
        .text(
          `${new Date(e.date).toLocaleDateString()} | ${
            e.category?.name ?? "—"
          } | ${e.amount} RON`
        )
        .text(`  ${e.details ?? ""}`);
      doc.moveDown(0.5);
    }

    // ✅ TRANZACȚII
    doc.addPage();
    doc.fontSize(16).text("Tranzacții", { underline: true });
    doc.moveDown();

    for (const t of transactions) {
      doc
        .fontSize(11)
        .text(
          `${new Date(t.createdAt).toLocaleDateString()} | ${
            t.type
          } | ${t.amount} RON`
        );
    }

    doc.end();

    const webStream = Readable.toWeb(nodeStream);

    return new Response(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="global-export-${new Date()
            .toISOString()
            .slice(0, 10)}.pdf"`,
      },
    });
  } catch (error) {
    console.error("EXPORT GLOBAL PDF ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}