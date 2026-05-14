export const runtime = "nodejs";

import { PassThrough, Readable } from "stream";
import path from "path";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const PDFDocument = (await import("pdfkit")).default;

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

    doc.fontSize(18).text("Raport financiar", {
      align: "center",
    });
    doc.moveDown();

    const buffer = Buffer.from(
      image.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );

    doc.image(buffer, {
      fit: [500, 700],
      align: "center",
    });

    doc.end();

    const webStream = Readable.toWeb(nodeStream);

    return new Response(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="report.pdf"',
      },
    });
  } catch (error) {
    console.error("EXPORT REPORT PDF ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}