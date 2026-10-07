import { STORAGE_KEYS } from "@/lib/constants";
import { fmtDate, parseLocalDate } from "@/lib/gantt-utils";
import type { GanttActivity, GanttOverrides } from "@/lib/types";

const VAULT_KEY = "ganttRecoveryVault";
const MAX_SNAPSHOTS = 20;

export type GanttSnapshot = {
  savedAt: string;
  ganttOv: GanttOverrides;
  ganttActivities: GanttActivity[];
  ganttEndDate: string;
  overrideCount: number;
};

export function loadGanttVault(): GanttSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GanttSnapshot[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveVault(snapshots: GanttSnapshot[]) {
  localStorage.setItem(VAULT_KEY, JSON.stringify(snapshots.slice(0, MAX_SNAPSHOTS)));
}

/** Keep rolling local backups of cronograma state (browser-only). */
export function appendGanttVaultSnapshot(
  ganttOv: GanttOverrides,
  ganttActivities: GanttActivity[],
  ganttEndDate: string,
) {
  const overrideCount = Object.keys(ganttOv).length;
  if (overrideCount < 3) return;

  const vault = loadGanttVault();
  const head = vault[0];
  const sameAsHead =
    head &&
    head.ganttEndDate === ganttEndDate &&
    head.overrideCount === overrideCount &&
    JSON.stringify(head.ganttOv) === JSON.stringify(ganttOv);

  if (sameAsHead) return;

  const entry: GanttSnapshot = {
    savedAt: new Date().toISOString(),
    ganttOv,
    ganttActivities,
    ganttEndDate,
    overrideCount,
  };

  vault.unshift(entry);
  saveVault(vault);
}

export function restoreGanttSnapshot(snapshot: GanttSnapshot) {
  localStorage.setItem(STORAGE_KEYS.ganttOv, JSON.stringify(snapshot.ganttOv));
  localStorage.setItem(STORAGE_KEYS.ganttActivities, JSON.stringify(snapshot.ganttActivities));
  localStorage.setItem(STORAGE_KEYS.ganttEndDate, snapshot.ganttEndDate);
}

export function formatSnapshotLabel(snapshot: GanttSnapshot): string {
  const d = new Date(snapshot.savedAt);
  const when = d.toLocaleString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${when} · ${snapshot.overrideCount} celdas`;
}

const OCTOBER_SHIFT_DAYS = 17;

function shiftAllDates(
  activities: GanttActivity[],
  ov: GanttOverrides,
  endDate: string,
  days: number,
): { activities: GanttActivity[]; ov: GanttOverrides; endDate: string } {
  const shiftIso = (iso: string) => {
    const d = parseLocalDate(iso);
    d.setDate(d.getDate() + days);
    return fmtDate(d);
  };

  const nextActivities = activities.map((a) => ({
    ...a,
    ranges: a.ranges.map(([s, e]) => [shiftIso(s), shiftIso(e)] as [string, string]),
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
    nextOv[`${name}|${shiftIso(date)}`] = value;
  }

  return {
    activities: nextActivities,
    ov: nextOv,
    endDate: shiftIso(endDate),
  };
}

/** Undo the one-time October planning migration (+17 days) if it was applied. */
export function undoOctoberPlanningShift(
  activities: GanttActivity[],
  ov: GanttOverrides,
  endDate: string,
) {
  return shiftAllDates(activities, ov, endDate, -OCTOBER_SHIFT_DAYS);
}
