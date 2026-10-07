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
    ["2026-10-01", "2026-10-06"],
    ["2026-10-08", "2026-10-13"],
  ],
  "Inst. Hidráulicas": [["2026-10-01", "2026-10-09"]],
  "Inst. Sanitarias": [["2026-10-01", "2026-10-06"]],
  "Inst. Aguas Lluvias": [
    ["2026-10-01", "2026-10-06"],
    ["2026-10-08", "2026-10-11"],
  ],
  "Viga Superior – Machones": [
    ["2026-10-01", "2026-10-13"],
    ["2026-10-15", "2026-10-18"],
  ],
  "Pañete Interior": [
    ["2026-10-08", "2026-10-20"],
    ["2026-10-22", "2026-11-03"],
  ],
  "Pañete Exterior": [["2026-10-15", "2026-11-03"]],
  "Relleno Zona Piscina": [
    ["2026-10-08", "2026-10-17"],
    ["2026-10-18", "2026-11-03"],
  ],
  Andén: [["2026-10-15", "2026-11-03"]],
  "Poza Séptica": [
    ["2026-10-01", "2026-10-06"],
    ["2026-10-08", "2026-10-09"],
  ],
  Cubierta: [
    ["2026-10-01", "2026-10-06"],
    ["2026-10-22", "2026-11-03"],
  ],
  Redoblón: [
    ["2026-10-08", "2026-10-13"],
    ["2026-10-29", "2026-11-03"],
  ],
  "Molduras Cubierta": [["2026-10-22", "2026-10-27"]],
  "Cielo Raso": [["2026-10-22", "2026-11-10"]],
  "Acabado Muros Interiores": [["2026-10-15", "2026-11-10"]],
  "Acabado Muros Exteriores": [["2026-11-05", "2026-11-19"]],
  "Impermeab. Viga Canal": [["2026-10-08", "2026-10-17"]],
  "Carpintería Metálica": [["2026-11-05", "2026-11-17"]],
  "Carpintería Madera": [["2026-11-05", "2026-11-17"]],
  "Terminación Plantilla": [["2026-11-19", "2026-12-08"]],
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

export const GANTT_START = "2026-10-01";
export const GANTT_END = "2026-12-08";
