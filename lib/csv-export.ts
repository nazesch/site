import { fmt, num } from "./format";
import { rowProgressPct } from "./tracker-data";
import type { ActivityRow, Period } from "./types";

function csvCell(v: unknown): string {
  const s = String(v == null ? "" : v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function exportTrackerCsv(rows: ActivityRow[], periods: Period[]): void {
  const COLS = [
    "Actividad",
    "Unidad",
    "Cant. Total",
    "Precio/Unidad",
    "Total Contrato",
    "Cant. Acumulada",
    "Total Pagado",
    "Saldo",
    "Avance %",
    "Estado",
  ];

  const lines: string[] = [];
  lines.push(COLS.map(csvCell).join(","));

  const periodLabels = periods.map((p) => p.label);
  if (periodLabels.length) {
    lines[0] += "," + periodLabels.map((l) => csvCell("Pago: " + l)).join(",");
  }

  rows.forEach((row) => {
    const contract = num(row.price) * num(row.qty);
    const accum = num(row.accumulated);
    const paid = num(row.paid);
    const remaining = contract - paid;
    const pct = rowProgressPct(row);
    const estado = pct >= 100 ? "Completado" : pct > 0 ? "En progreso" : "Sin iniciar";

    const cells = [
      row.name,
      row.unit,
      num(row.qty),
      num(row.price),
      contract,
      accum,
      paid,
      remaining,
      pct.toFixed(1),
      estado,
    ];

    let line = cells.map(csvCell).join(",");

    if (periods.length) {
      const perPeriod = periods.map((p) => {
        const snap = (p.snapshot || []).find((s) => s.name === row.name);
        return snap ? snap.amount : 0;
      });
      line += "," + perPeriod.map(csvCell).join(",");
    }

    lines.push(line);
  });

  const totContract = rows.reduce((s, r) => s + num(r.price) * num(r.qty), 0);
  const totPaid = rows.reduce((s, r) => s + num(r.paid), 0);
  const totRemain = totContract - totPaid;
  const totCells = ["TOTAL", "", "", "", totContract, "", totPaid, totRemain, "", ""];
  let totLine = totCells.map(csvCell).join(",");
  if (periods.length) {
    const totPerPeriod = periods.map((p) =>
      (p.snapshot || []).reduce((s, x) => s + x.amount, 0),
    );
    totLine += "," + totPerPeriod.map(csvCell).join(",");
  }
  lines.push(totLine);

  const csv = lines.join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const ts = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `casa-tracker-${ts}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
