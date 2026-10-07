import { GANTT_START } from "./constants";

const MONTH_NAMES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export function buildDayList(endDate: string): Date[] {
  const days: Date[] = [];
  const end = new Date(endDate + "T12:00:00");
  for (let d = new Date(GANTT_START + "T12:00:00"); d <= end; d.setDate(d.getDate() + 1)) {
    if (d.getDay() !== 0) days.push(new Date(d));
  }
  return days;
}

export function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function inRange(ds: string, ranges: [string, string][]): boolean {
  return ranges.some(([s, e]) => ds >= s && ds <= e);
}

export function buildMonths(days: Date[]): { month: number; label: string; count: number }[] {
  const out: { month: number; label: string; count: number }[] = [];
  let cur: { month: number; label: string; count: number } | null = null;
  days.forEach((d) => {
    const m = d.getMonth();
    if (!cur || m !== cur.month) {
      if (cur) out.push(cur);
      cur = { month: m, label: MONTH_NAMES[m], count: 0 };
    }
    cur.count++;
  });
  if (cur) out.push(cur);
  return out;
}

export function buildWeeks(days: Date[]): { days: Date[] }[] {
  const out: { days: Date[] }[] = [];
  let cur: { days: Date[] } | null = null;
  days.forEach((d) => {
    if (!cur || d.getDay() === 1) {
      if (cur) out.push(cur);
      cur = { days: [] };
    }
    cur.days.push(d);
  });
  if (cur) out.push(cur);
  return out;
}

export function weekLabel(days: Date[]): string {
  if (!days.length) return "";
  const s = days[0];
  const e = days[days.length - 1];
  return `${s.getDate()}–${e.getDate()}`;
}

export function dayLetter(d: Date): string {
  return ["D", "L", "M", "M", "J", "V", "S"][d.getDay()];
}
