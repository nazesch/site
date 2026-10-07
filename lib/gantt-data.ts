import { GANTT_END, GANTT_SCHEDULE, GANTT_START } from "./constants";
import { fmtDate } from "./gantt-utils";
import type { GanttActivity } from "./types";

export function createDefaultGanttActivities(): GanttActivity[] {
  return Object.entries(GANTT_SCHEDULE).map(([name, ranges]) => ({
    id: slugId(name),
    name,
    ranges,
  }));
}

export function slugId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function addCalendarDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T12:00:00");
  d.setDate(d.getDate() + days);
  return fmtDate(d);
}

export function formatGanttRange(endDate: string): string {
  const start = parseIso(GANTT_START);
  const end = parseIso(endDate);
  const sm = MONTH_SHORT[start.getMonth()];
  const em = MONTH_SHORT[end.getMonth()];
  if (start.getMonth() === end.getMonth()) {
    return `${sm} ${start.getDate()} – ${em} ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${sm} ${start.getDate()} – ${em} ${end.getDate()}, ${end.getFullYear()}`;
}

const MONTH_SHORT = [
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

function parseIso(iso: string): Date {
  return new Date(iso + "T12:00:00");
}
