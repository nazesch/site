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
    ["2025-09-14", "2025-09-19"],
    ["2025-09-21", "2025-09-26"],
  ],
  "Inst. Hidráulicas": [["2025-09-14", "2025-09-22"]],
  "Inst. Sanitarias": [["2025-09-14", "2025-09-19"]],
  "Inst. Aguas Lluvias": [
    ["2025-09-14", "2025-09-19"],
    ["2025-09-21", "2025-09-24"],
  ],
  "Viga Superior – Machones": [
    ["2025-09-14", "2025-09-26"],
    ["2025-09-28", "2025-10-01"],
  ],
  "Pañete Interior": [
    ["2025-09-21", "2025-10-03"],
    ["2025-10-05", "2025-10-17"],
  ],
  "Pañete Exterior": [["2025-09-28", "2025-10-17"]],
  "Relleno Zona Piscina": [
    ["2025-09-21", "2025-09-30"],
    ["2025-10-01", "2025-10-17"],
  ],
  Andén: [["2025-09-28", "2025-10-17"]],
  "Poza Séptica": [
    ["2025-09-14", "2025-09-19"],
    ["2025-09-21", "2025-09-22"],
  ],
  Cubierta: [
    ["2025-09-14", "2025-09-19"],
    ["2025-10-05", "2025-10-17"],
  ],
  Redoblón: [
    ["2025-09-21", "2025-09-26"],
    ["2025-10-12", "2025-10-17"],
  ],
  "Molduras Cubierta": [["2025-10-05", "2025-10-10"]],
  "Cielo Raso": [["2025-10-05", "2025-10-24"]],
  "Acabado Muros Interiores": [["2025-09-28", "2025-10-24"]],
  "Acabado Muros Exteriores": [["2025-10-19", "2025-11-02"]],
  "Impermeab. Viga Canal": [["2025-09-21", "2025-09-30"]],
  "Carpintería Metálica": [["2025-10-19", "2025-10-31"]],
  "Carpintería Madera": [["2025-10-19", "2025-10-31"]],
  "Terminación Plantilla": [["2025-11-02", "2025-11-21"]],
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

export const GANTT_START = "2025-09-14";
export const GANTT_END = "2025-11-21";
