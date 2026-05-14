export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { PassThrough, Readable } from "stream";
import path from "path";

export async function GET() {
  try {
    // ✅ dynamic import (NU import static)
    const PDFDocument = (await import("pdfkit")).default;

    const accounts = await prisma.payingAccount.findMany({
      include: {
        transactions: true,
      },
    });

    // ✅ font TTF absolut
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

    doc.fontSize(18).text("Conturi – Raport", {
      underline: true,
    });
    doc.moveDown();

    for (const a of accounts) {
      const income = a.transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum: number, t) => sum + t.amount, 0);

      const expense = a.transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum: number, t) => sum + t.amount, 0);

      const balance = income - expense;

      doc
        .fontSize(12)
        .text(a.name)
        .text(`  Intrări: ${income} RON`)
        .text(`  Ieșiri: ${expense} RON`)
        .text(`  Sold: ${balance} RON`)
        .text(`  Tranzacții: ${a.transactions.length}`);
      doc.moveDown();
    }

    doc.end();

    const webStream = Readable.toWeb(nodeStream);

    return new Response(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="accounts-${new Date()
            .toISOString()
            .slice(0, 10)}.pdf"`,
      },
    });
  } catch (error) {
    console.error("EXPORT ACCOUNTS PDF ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}