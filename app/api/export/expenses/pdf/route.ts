export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { PassThrough, Readable } from "stream";
import path from "path";

export async function GET() {
  try {
    const PDFDocument = (await import("pdfkit")).default;

    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" },
      include: {
        category: true,
        payingAccount: true,
      },
    });

    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Roboto-Regular.ttf"
    );

    const doc = new PDFDocument({
      margin: 40,
      font: fontPath,
    });

    const nodeStream = new PassThrough();
    doc.pipe(nodeStream);

    doc.fontSize(18).text("Cheltuieli – Raport", {
      underline: true,
    });
    doc.moveDown();

    let total = 0;

    for (const e of expenses) {
      total += e.amount;

      doc
        .fontSize(11)
        .text(
          `${new Date(e.date).toLocaleDateString()} | ${
            e.type
          } | ${e.category?.name ?? "—"} | ${
            e.payingAccount?.name ?? "—"
          }`
        )
        .text(`  ${e.details ?? ""}`)
        .text(`  Sumă: ${e.amount} RON`);
      doc.moveDown(0.5);
    }

    doc.moveDown();
    doc.fontSize(14).text(`TOTAL CHELTUIELI: ${total} RON`);

    doc.end();

    const webStream = Readable.toWeb(nodeStream);

    return new Response(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="expenses-${new Date()
            .toISOString()
            .slice(0, 10)}.pdf"`,
      },
    });
  } catch (error) {
    console.error("EXPORT EXPENSES PDF ERROR:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}