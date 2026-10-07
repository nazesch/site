import { GANTT_START } from "@/lib/constants";
import {
  buildDayList,
  firstWorkDayOnOrAfter,
  fmtDate,
  inRange,
  nextWorkDayAfter,
} from "@/lib/gantt-utils";
import type { GanttActivity, GanttOverrides } from "@/lib/types";

function isDayActive(
  act: GanttActivity,
  ds: string,
  overrides: GanttOverrides,
): boolean {
  const key = `${act.name}|${ds}`;
  const def = inRange(ds, act.ranges);
  return overrides[key] !== undefined ? overrides[key] : def;
}

/** Adds one work day (non-Sunday) after each activity's last scheduled day. */
export function applyRainyDayToAll(
  activities: GanttActivity[],
  overrides: GanttOverrides,
  endDate: string,
): { overrides: GanttOverrides; endDate: string } {
  const days = buildDayList(endDate);
  const next = { ...overrides };
  let newEnd = endDate;

  for (const act of activities) {
    const activeDates = days.map((d) => fmtDate(d)).filter((ds) => isDayActive(act, ds, next));
    const lastActive = activeDates.length > 0 ? activeDates[activeDates.length - 1] : null;
    const addIso = lastActive ? nextWorkDayAfter(lastActive) : firstWorkDayOnOrAfter(GANTT_START);
    next[`${act.name}|${addIso}`] = true;
    if (addIso > newEnd) newEnd = addIso;
  }

  return { overrides: next, endDate: newEnd };
}
