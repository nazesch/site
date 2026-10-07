export const DEFAULT_ACTIVITY_NAMES = [
  "Inst. Eléctricas",
  "Inst. Hidráulicas",
  "Inst. Sanitarias",
  "Inst. Aguas Lluvias",
  "Viga Superior – Machones",
  "Pañete Interior",
  "Pañete Exterior",
  "Relleno Zona Piscina",
  "Andén",
  "Poza Séptica",
  "Cubierta",
  "Redoblón",
  "Molduras Cubierta",
  "Cielo Raso",
  "Acabado Muros Interiores",
  "Acabado Muros Exteriores",
  "Impermeab. Viga Canal",
  "Carpintería Metálica",
  "Carpintería Madera",
  "Terminación Plantilla",
] as const;

export const GANTT_SCHEDULE: Record<string, [string, string][]> = {
  "Inst. Eléctricas": [
    ["2026-09-14", "2026-09-19"],
    ["2026-09-21", "2026-09-26"],
  ],
  "Inst. Hidráulicas": [["2026-09-14", "2026-09-22"]],
  "Inst. Sanitarias": [["2026-09-14", "2026-09-19"]],
  "Inst. Aguas Lluvias": [
    ["2026-09-14", "2026-09-19"],
    ["2026-09-21", "2026-09-24"],
  ],
  "Viga Superior – Machones": [
    ["2026-09-14", "2026-09-26"],
    ["2026-09-28", "2026-10-01"],
  ],
  "Pañete Interior": [
    ["2026-09-21", "2026-10-03"],
    ["2026-10-05", "2026-10-17"],
  ],
  "Pañete Exterior": [["2026-09-28", "2026-10-17"]],
  "Relleno Zona Piscina": [
    ["2026-09-21", "2026-09-30"],
    ["2026-10-01", "2026-10-17"],
  ],
  Andén: [["2026-09-28", "2026-10-17"]],
  "Poza Séptica": [
    ["2026-09-14", "2026-09-19"],
    ["2026-09-21", "2026-09-22"],
  ],
  Cubierta: [
    ["2026-09-14", "2026-09-19"],
    ["2026-10-05", "2026-10-17"],
  ],
  Redoblón: [
    ["2026-09-21", "2026-09-26"],
    ["2026-10-12", "2026-10-17"],
  ],
  "Molduras Cubierta": [["2026-10-05", "2026-10-10"]],
  "Cielo Raso": [["2026-10-05", "2026-10-24"]],
  "Acabado Muros Interiores": [["2026-09-28", "2026-10-24"]],
  "Acabado Muros Exteriores": [["2026-10-19", "2026-11-02"]],
  "Impermeab. Viga Canal": [["2026-09-21", "2026-09-30"]],
  "Carpintería Metálica": [["2026-10-19", "2026-10-31"]],
  "Carpintería Madera": [["2026-10-19", "2026-10-31"]],
  "Terminación Plantilla": [["2026-11-02", "2026-11-21"]],
};

export const ACTIVITY_UNITS = ["m2", "m3", "ml", "m", "und", "gl", "kg"] as const;

export const STORAGE_KEYS = {
  rows: "tRows",
  periods: "tPeriods",
  ganttOv: "ganttOv",
  ganttActivities: "ganttActivities",
  ganttEndDate: "ganttEndDate",
  colWidthActividad: "colWidthActividad",
} as const;

export const GANTT_START = "2026-09-14";
export const GANTT_END = "2026-11-21";
