export const runtime = "nodejs";

import { XMLParser } from "fast-xml-parser";

export async function GET() {
  // ✅ parser XML BNR
  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  // ✅ helper: extrage doar EUR / USD / CHF
  const pickRates = (rates: any[]) => {
    const wanted = ["EUR", "USD", "CHF"];
    const map: Record<string, number> = {};

    for (const r of rates) {
      if (wanted.includes(r["@_currency"])) {
        map[r["@_currency"]] = Number(r["#text"]);
      }
    }
    return map;
  };

  /* ================= CURSUL ZILEI ================= */
  const todayRes = await fetch(
    "https://curs.bnr.ro/nbrfxrates.xml"
  );
  const todayXml = await todayRes.text();
  const todayJson = parser.parse(todayXml);

  const todayRates =
    todayJson.DataSet.Body.Cube.Rate;

  const today = pickRates(todayRates);

  /* ============ ISTORIC ULTIMELE 5 ZILE ============ */
  const historyRes = await fetch(
    "https://curs.bnr.ro/nbrfxrates10days.xml"
  );
  const historyXml = await historyRes.text();
  const historyJson = parser.parse(historyXml);

  const cubes = historyJson.DataSet.Body.Cube;

  const history = cubes.slice(0, 5).map((c: any) => ({
    date: c["@_date"],
    rates: pickRates(c.Rate),
  }));

  /* ================= RESPONSE ================= */
  return Response.json({
    today,
    history,
  });
}