export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { PassThrough, Readable } from "stream";
import path from "path";

export async function GET() {
  try {
    const PDFDocument = (await import("pdfkit")).default;

    const transactions = await prisma.accountTransaction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
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

    doc.fontSize(18).text("Tranzacții – Raport", { underline: true });
    doc.moveDown();

    let total = 0;

    for (const t of transactions) {
      total += t.amount;

      doc
        .fontSize(11)
        .text(
          `${new Date(t.createdAt).toLocaleDateString()} | ${
            t.type
          } | ${t.payingAccount.name}`
        )
        .text(`  ${t.description ?? "—"}`)
        .text(`  Sumă: ${t.amount} RON`);
      doc.moveDown(0.5);
    }

    doc.moveDown();
    doc.fontSize(14).text(`TOTAL: ${total} RON`);

    doc.end();

    const webStream = Readable.toWeb(nodeStream);

    return new Response(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="transactions-${new Date()
            .toISOString()
            .slice(0, 10)}.pdf"`,
      },
    });
  } catch (error) {
    console.error("EXPORT TRANSACTIONS PDF ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}