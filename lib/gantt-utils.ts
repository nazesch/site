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
  const end = parseLocalDate(endDate);
  for (let d = parseLocalDate(GANTT_START); d <= end; d = addDays(d, 1)) {
    days.push(d);
  }
  return days;
}

/** Calendar date in local time (YYYY-MM-DD). Avoids UTC shift from toISOString(). */
export function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseLocalDate(iso: string): Date {
  return new Date(iso + "T12:00:00");
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
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

/** Calendar weeks (Mon–Sun), including partial weeks at range edges. */
export function buildWeeks(days: Date[]): { days: Date[] }[] {
  if (!days.length) return [];
  const out: { days: Date[] }[] = [];
  let cur: Date[] = [];
  for (const d of days) {
    if (cur.length > 0 && d.getDay() === 1) {
      out.push({ days: cur });
      cur = [];
    }
    cur.push(d);
  }
  if (cur.length) out.push({ days: cur });
  return out;
}

export function weekLabel(days: Date[]): string {
  if (!days.length) return "";
  const s = days[0];
  const e = days[days.length - 1];
  if (s.getMonth() === e.getMonth()) {
    return `${s.getDate()}–${e.getDate()}`;
  }
  return `${MONTH_NAMES[s.getMonth()]} ${s.getDate()} – ${MONTH_NAMES[e.getMonth()]} ${e.getDate()}`;
}

export function dayLetter(d: Date): string {
  return ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"][d.getDay()];
}
