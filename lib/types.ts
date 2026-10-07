export type ActivityUnit = "m2" | "m3" | "ml" | "m" | "und" | "gl" | "kg";

export type ActivityRow = {
  id: number;
  name: string;
  unit: ActivityUnit | string;
  price: number;
  qty: number;
  staging: number;
  accumulated: number;
  paid: number;
};

export type PeriodSnapshotItem = {
  name: string;
  qty: number;
  unit: string;
  amount: number;
};

export type Period = {
  id: number;
  label: string;
  snapshot: PeriodSnapshotItem[];
};

export type TabId = "cronograma" | "tracker";

export type GanttOverrides = Record<string, boolean>;

export type GanttActivity = {
  id: string;
  name: string;
  ranges: [string, string][];
};
