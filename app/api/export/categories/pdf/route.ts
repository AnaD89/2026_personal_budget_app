export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { PassThrough, Readable } from "stream";
import path from "path";

export async function GET() {
  try {
    // ✅ dynamic import (NU import static)
    const PDFDocument = (await import("pdfkit")).default;

    const categories = await prisma.category.findMany({
      include: { expenses: true },
    });

    // ✅ font TTF absolut
    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Roboto-Regular.ttf"
    );

    // ✅ font setat DIRECT în constructor (dezactivează Helvetica)
    const doc = new PDFDocument({
      margin: 50,
      font: fontPath,
    });

    const nodeStream = new PassThrough();
    doc.pipe(nodeStream);

    doc.fontSize(18).text("Categorii – Raport", { underline: true });
    doc.moveDown();

    for (const c of categories as {
      name: string;
      expenses: { amount: number }[];
    }[]) {
      const total = c.expenses.reduce(
        (sum: number, e: { amount: number }) => sum + e.amount,
        0
      );

      doc
        .fontSize(12)
        .text(c.name)
        .text(`  Total: ${total} RON`)
        .text(`  Tranzacții: ${c.expenses.length}`);
      doc.moveDown();
    }

    doc.end();

    const webStream = Readable.toWeb(nodeStream);

    return new Response(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="categories-${new Date()
            .toISOString()
            .slice(0, 10)}.pdf"`,
      },
    });
  } catch (error) {
    console.error("EXPORT PDF ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}