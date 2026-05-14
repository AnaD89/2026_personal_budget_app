export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";
import { PassThrough, Readable } from "stream";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { expenses: true },
    });

    const doc = new PDFDocument({ margin: 50 });
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

    // ✅ FOARTE IMPORTANT: folosim Response, nu NextResponse
    const webStream = Readable.toWeb(nodeStream) as unknown as globalThis.ReadableStream;
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
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}