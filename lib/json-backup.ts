import type { ActivityRow, GanttActivity, GanttOverrides, Period } from "@/lib/types";

export const BACKUP_VERSION = 1;

export type CasaTrackerBackup = {
  version: number;
  exportedAt: string;
  rows: ActivityRow[];
  periods: Period[];
  ganttOv: GanttOverrides;
  ganttActivities: GanttActivity[];
  ganttEndDate: string;
  actividadColWidth: number | null;
};

export function buildBackup(data: Omit<CasaTrackerBackup, "version" | "exportedAt">): CasaTrackerBackup {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    ...data,
  };
}

export function parseBackup(raw: string): CasaTrackerBackup | null {
  try {
    const data = JSON.parse(raw) as Partial<CasaTrackerBackup>;
    if (!Array.isArray(data.rows) || !Array.isArray(data.periods)) return null;
    if (!Array.isArray(data.ganttActivities)) return null;
    if (typeof data.ganttEndDate !== "string") return null;
    return {
      version: data.version ?? 1,
      exportedAt: data.exportedAt ?? "",
      rows: data.rows,
      periods: data.periods,
      ganttOv: data.ganttOv ?? {},
      ganttActivities: data.ganttActivities,
      ganttEndDate: data.ganttEndDate,
      actividadColWidth:
        data.actividadColWidth === null || data.actividadColWidth === undefined
          ? null
          : Number(data.actividadColWidth),
    };
  } catch {
    return null;
  }
}

export function downloadBackupJson(backup: CasaTrackerBackup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `casa-tracker-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
