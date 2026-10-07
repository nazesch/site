import { fmtDate, parseLocalDate } from "@/lib/gantt-utils";
import type { GanttActivity, GanttOverrides } from "@/lib/types";

const LEGACY_YEAR_PREFIX = "2025-";
const TARGET_YEAR_PREFIX = "2026-";
const OCTOBER_START = "2026-10-01";
const SEPTEMBER_2026_PREFIX = "2026-09-";
/** Days from former planning start (2026-09-14) to 2026-10-01. */
const SEPT_TO_OCT_SHIFT = 17;

function bumpLegacyIsoDate(iso: string): string {
  return iso.startsWith(LEGACY_YEAR_PREFIX)
    ? `${TARGET_YEAR_PREFIX}${iso.slice(LEGACY_YEAR_PREFIX.length)}`
    : iso;
}

function shiftIsoByDays(iso: string, days: number): string {
  const d = parseLocalDate(iso);
  d.setDate(d.getDate() + days);
  return fmtDate(d);
}

function shiftGanttDates(
  activities: GanttActivity[],
  ov: GanttOverrides,
  endDate: string,
  days: number,
): { activities: GanttActivity[]; ov: GanttOverrides; endDate: string } {
  const nextActivities = activities.map((a) => ({
    ...a,
    ranges: a.ranges.map(([s, e]) => [shiftIsoByDays(s, days), shiftIsoByDays(e, days)] as [string, string]),
  }));

  const nextOv: GanttOverrides = {};
  for (const [key, value] of Object.entries(ov)) {
    const sep = key.indexOf("|");
    if (sep === -1) {
      nextOv[key] = value;
      continue;
    }
    const name = key.slice(0, sep);
    const date = key.slice(sep + 1);
    nextOv[`${name}|${shiftIsoByDays(date, days)}`] = value;
  }

  return {
    activities: nextActivities,
    ov: nextOv,
    endDate: shiftIsoByDays(endDate, days),
  };
}

function hasSeptember2026(
  activities: GanttActivity[],
  ov: GanttOverrides,
  endDate: string,
): boolean {
  if (endDate.startsWith(SEPTEMBER_2026_PREFIX)) return true;
  if (
    activities.some((a) =>
      a.ranges.some(([s, e]) => s.startsWith(SEPTEMBER_2026_PREFIX) || e.startsWith(SEPTEMBER_2026_PREFIX)),
    )
  ) {
    return true;
  }
  return Object.keys(ov).some((k) => {
    const date = k.slice(k.indexOf("|") + 1);
    return date.startsWith(SEPTEMBER_2026_PREFIX);
  });
}

export function needsGanttYearMigration(
  activities: GanttActivity[],
  endDate: string,
): boolean {
  if (endDate.startsWith(LEGACY_YEAR_PREFIX)) return true;
  return activities.some((a) => a.ranges.some(([s, e]) => s.startsWith(LEGACY_YEAR_PREFIX) || e.startsWith(LEGACY_YEAR_PREFIX)));
}

export function migrateGanttFrom2025To2026(
  activities: GanttActivity[],
  ov: GanttOverrides,
  endDate: string,
): { activities: GanttActivity[]; ov: GanttOverrides; endDate: string } {
  if (!needsGanttYearMigration(activities, endDate)) {
    return { activities, ov, endDate };
  }

  const nextActivities = activities.map((a) => ({
    ...a,
    ranges: a.ranges.map(([s, e]) => [bumpLegacyIsoDate(s), bumpLegacyIsoDate(e)] as [string, string]),
  }));

  const nextOv: GanttOverrides = {};
  for (const [key, value] of Object.entries(ov)) {
    const sep = key.indexOf("|");
    if (sep === -1) {
      nextOv[key] = value;
      continue;
    }
    const name = key.slice(0, sep);
    const date = key.slice(sep + 1);
    nextOv[`${name}|${bumpLegacyIsoDate(date)}`] = value;
  }

  return {
    activities: nextActivities,
    ov: nextOv,
    endDate: bumpLegacyIsoDate(endDate),
  };
}

/** Shift saved schedules that still begin in September 2026 to October planning start. */
export function migrateGanttToOctoberStart(
  activities: GanttActivity[],
  ov: GanttOverrides,
  endDate: string,
): { activities: GanttActivity[]; ov: GanttOverrides; endDate: string } {
  if (!hasSeptember2026(activities, ov, endDate)) {
    return { activities, ov, endDate };
  }
  return shiftGanttDates(activities, ov, endDate, SEPT_TO_OCT_SHIFT);
}

export function migrateGanttStorage(
  activities: GanttActivity[],
  ov: GanttOverrides,
  endDate: string,
): { activities: GanttActivity[]; ov: GanttOverrides; endDate: string } {
  let next = migrateGanttFrom2025To2026(activities, ov, endDate);
  next = migrateGanttToOctoberStart(next.activities, next.ov, next.endDate);
  if (next.endDate < OCTOBER_START) {
    next = { ...next, endDate: OCTOBER_START };
  }
  return next;
}
