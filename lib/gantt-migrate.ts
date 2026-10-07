import type { GanttActivity, GanttOverrides } from "@/lib/types";

const LEGACY_YEAR_PREFIX = "2025-";
const TARGET_YEAR_PREFIX = "2026-";

function bumpLegacyIsoDate(iso: string): string {
  return iso.startsWith(LEGACY_YEAR_PREFIX)
    ? `${TARGET_YEAR_PREFIX}${iso.slice(LEGACY_YEAR_PREFIX.length)}`
    : iso;
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
