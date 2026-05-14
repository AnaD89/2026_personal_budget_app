"use client";

type Props = {
  pdfUrl: string;
  excelUrl: string;
};

export default function ExportButtons({
  pdfUrl,
  excelUrl,
}: Props) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
        <button type="button">Export PDF</button>
      </a>

      <a href={excelUrl} target="_blank" rel="noopener noreferrer">
        <button type="button">Export Excel</button>
      </a>
    </div>
  );
}