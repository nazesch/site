import { DEFAULT_ACTIVITY_NAMES } from "./constants";
import type { ActivityRow, Period } from "./types";

export function createDefaultRows(): ActivityRow[] {
  return DEFAULT_ACTIVITY_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    unit: "m2",
    price: 0,
    qty: 0,
    staging: 0,
    accumulated: 0,
    paid: 0,
  }));
}

export function createDefaultPeriods(): Period[] {
  return [
    { id: 1, label: "Sep 14 – Sep 26", snapshot: [] },
    { id: 2, label: "Sep 28 – Oct 10", snapshot: [] },
    { id: 3, label: "Oct 12 – Oct 24", snapshot: [] },
    { id: 4, label: "Oct 26 – Nov 07", snapshot: [] },
    { id: 5, label: "Nov 09 – Nov 21", snapshot: [] },
  ];
}

export function weightedProgress(rows: ActivityRow[]): number {
  const totContract = rows.reduce((s, r) => s + r.price * r.qty, 0);
  if (totContract <= 0) return 0;
  const weighted = rows.reduce((s, r) => {
    const c = r.price * r.qty;
    const p = r.qty > 0 ? Math.min(1, r.accumulated / r.qty) : 0;
    return s + c * p;
  }, 0);
  return (weighted / totContract) * 100;
}

export function rowProgressPct(row: ActivityRow): number {
  return row.qty > 0 ? Math.min(100, (row.accumulated / row.qty) * 100) : 0;
}
