"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BiweeklyGrid } from "@/components/BiweeklyGrid";
import { GanttChart } from "@/components/GanttChart";
import { IconExport, IconPlus } from "@/components/icons";
import { TrackerTable } from "@/components/TrackerTable";
import { exportTrackerCsv } from "@/lib/csv-export";
import { STORAGE_KEYS } from "@/lib/constants";
import { fmt, num } from "@/lib/format";
import {
  createDefaultPeriods,
  createDefaultRows,
  weightedProgress,
} from "@/lib/tracker-data";
import type { ActivityRow, GanttOverrides, Period, TabId } from "@/lib/types";

const TOPBAR_TITLES: Record<TabId, string> = {
  cronograma: "Cronograma",
  tracker: "Actividades",
};

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function CasaTrackerApp() {
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<TabId>("cronograma");
  const [rows, setRows] = useState<ActivityRow[]>(createDefaultRows);
  const [periods, setPeriods] = useState<Period[]>(createDefaultPeriods);
  const [ganttOv, setGanttOv] = useState<GanttOverrides>({});
  const [actividadColWidth, setActividadColWidth] = useState<number | null>(null);

  useEffect(() => {
    let loadedRows = loadJson<ActivityRow[]>(STORAGE_KEYS.rows, []);
    let loadedPeriods = loadJson<Period[]>(STORAGE_KEYS.periods, []);
    if (!loadedRows.length) loadedRows = createDefaultRows();
    if (!loadedPeriods.length) loadedPeriods = createDefaultPeriods();
    setRows(loadedRows);
    setPeriods(loadedPeriods);
    setGanttOv(loadJson<GanttOverrides>(STORAGE_KEYS.ganttOv, {}));
    const savedW = localStorage.getItem(STORAGE_KEYS.colWidthActividad);
    if (savedW) setActividadColWidth(parseInt(savedW, 10));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEYS.rows, JSON.stringify(rows));
    localStorage.setItem(STORAGE_KEYS.periods, JSON.stringify(periods));
    localStorage.setItem(STORAGE_KEYS.ganttOv, JSON.stringify(ganttOv));
  }, [rows, periods, ganttOv, hydrated]);

  const persistColWidth = useCallback((width: number) => {
    setActividadColWidth(width);
    localStorage.setItem(STORAGE_KEYS.colWidthActividad, String(width));
  }, []);

  const setField = useCallback((id: number, field: keyof ActivityRow, value: string) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        if (field === "name" || field === "unit") {
          return { ...row, [field]: value };
        }
        return { ...row, [field]: num(value) };
      }),
    );
  }, []);

  const commitStaging = useCallback((id: number) => {
    setRows((prev) => {
      const row = prev.find((r) => r.id === id);
      if (!row) return prev;
      const qty = num(row.staging);
      if (qty <= 0) {
        alert("Ingresa una cantidad mayor a 0 antes de confirmar.");
        return prev;
      }
      return prev.map((r) =>
        r.id === id
          ? {
              ...r,
              accumulated: r.accumulated + qty,
              paid: r.paid + num(r.price) * qty,
              staging: 0,
            }
          : r,
      );
    });
  }, []);

  const addRow = useCallback(() => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "Nueva Actividad",
        unit: "m2",
        price: 0,
        qty: 0,
        staging: 0,
        accumulated: 0,
        paid: 0,
      },
    ]);
  }, []);

  const deleteRow = useCallback((id: number) => {
    if (!confirm("¿Eliminar esta actividad?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const reorderRows = useCallback((srcId: number, targetId: number) => {
    setRows((prev) => {
      const srcIdx = prev.findIndex((r) => r.id === srcId);
      const tgtIdx = prev.findIndex((r) => r.id === targetId);
      if (srcIdx === -1 || tgtIdx === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(srcIdx, 1);
      const newIdx = next.findIndex((r) => r.id === targetId);
      next.splice(newIdx, 0, moved);
      return next;
    });
  }, []);

  const addPeriod = useCallback(() => {
    const label = prompt("Nombre de la quincena (ej: Nov 23 – Dic 05):", "");
    if (!label?.trim()) return;
    setPeriods((prev) => [...prev, { id: Date.now(), label: label.trim(), snapshot: [] }]);
  }, []);

  const deletePeriod = useCallback((id: number) => {
    if (!confirm("¿Eliminar esta quincena?")) return;
    setPeriods((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const closePayment = useCallback(
    (periodId: number) => {
      const period = periods.find((p) => p.id === periodId);
      if (!period) return;
      const toCommit = rows.filter((r) => num(r.staging) > 0);
      if (!toCommit.length) {
        alert(
          "No hay cantidades en staging.\nIngresa cantidades en la columna 'Cant. Ejecutada' primero.",
        );
        return;
      }
      const snap = toCommit.map((r) => ({
        name: r.name,
        qty: num(r.staging),
        unit: r.unit,
        amount: num(r.price) * num(r.staging),
      }));
      const totalPay = snap.reduce((s, x) => s + x.amount, 0);
      if (!confirm(`Registrar pago de quincena "${period.label}"\nTotal: ${fmt(totalPay)}`)) {
        return;
      }

      setRows((prev) =>
        prev.map((row) => {
          const e = snap.find((s) => s.name === row.name);
          if (!e) return row;
          return {
            ...row,
            accumulated: row.accumulated + e.qty,
            paid: row.paid + e.amount,
            staging: 0,
          };
        }),
      );
      setPeriods((prev) =>
        prev.map((p) => (p.id === periodId ? { ...p, snapshot: snap } : p)),
      );
    },
    [periods, rows],
  );

  const toggleGanttDay = useCallback((key: string, active: boolean) => {
    setGanttOv((prev) => ({ ...prev, [key]: active }));
  }, []);

  const stats = useMemo(() => {
    const totContract = rows.reduce((s, r) => s + num(r.price) * num(r.qty), 0);
    const totPaid = rows.reduce((s, r) => s + num(r.paid), 0);
    const wpct = weightedProgress(rows);
    return { totContract, totPaid, totRemain: totContract - totPaid, wpct };
  }, [rows]);

  if (!hydrated) {
    return (
      <div className="app">
        <div className="main" style={{ alignItems: "center", justifyContent: "center" }}>
          <span className="topbar-sub">Cargando…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏗</div>
          <div>
            <div className="sidebar-logo-text">Casa Tracker</div>
            <div className="sidebar-logo-sub">Construcción</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Vistas</div>
          <button
            type="button"
            className={`nav-item${tab === "cronograma" ? " active" : ""}`}
            onClick={() => setTab("cronograma")}
          >
            <span className="ni-icon">📅</span> Cronograma
          </button>
          <button
            type="button"
            className={`nav-item${tab === "tracker" ? " active" : ""}`}
            onClick={() => setTab("tracker")}
          >
            <span className="ni-icon">📊</span> Actividades
            <span className="ni-count">{rows.length}</span>
          </button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Quincenas</div>
          {periods.map((p) => {
            const isOpen = (p.snapshot || []).length === 0;
            return (
              <div key={p.id} className="nav-item" style={{ fontSize: 12, cursor: "default" }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: isOpen ? "var(--accent)" : "var(--green)",
                    display: "inline-block",
                    marginRight: 4,
                  }}
                />
                {p.label}
              </div>
            );
          })}
        </div>

        <div className="sidebar-bottom">
          <div className="nav-item" style={{ cursor: "default" }}>
            <span className="ni-icon">💾</span> Auto-guardado
            <span
              style={{
                marginLeft: "auto",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--green)",
                display: "inline-block",
              }}
            />
          </div>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <span className="topbar-title">{TOPBAR_TITLES[tab]}</span>
          <span className="topbar-sep">/</span>
          <span className="topbar-sub">Sep 14 – Nov 21, 2025</span>
          <div className="topbar-actions">
            {tab === "tracker" && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => exportTrackerCsv(rows, periods)}
              >
                <IconExport />
                Exportar CSV
              </button>
            )}
          </div>
        </div>

        <div className="content">
          {tab === "cronograma" && (
            <div id="tab-cronograma" className="tab-panel">
              <div className="section-hdr">
                <div className="section-hdr-left">
                  <span className="section-title">Cronograma de Actividades Faltantes</span>
                </div>
                <span className="section-hint">Clic en una celda para activar / desactivar</span>
              </div>
              <GanttChart overrides={ganttOv} onToggleDay={toggleGanttDay} />
              <div className="notes">
                <strong>Notas</strong>
                <div>
                  <b style={{ color: "var(--text)" }}>Nota 1 —</b> Periodo sin actividades en
                  cubierta y cielo razo: 5 días en espera del caballete de Comaderas.
                </div>
                <div>
                  <b style={{ color: "var(--text)" }}>Nota 2 —</b> Trabajos en altura (bajo
                  rendimiento): Pañete Interior/Exterior, Cubierta, Redoblón, Cielo Razo, Acabados.
                </div>
                <div>
                  <b style={{ color: "var(--text)" }}>Nota 3 —</b> Terminación Plantilla Pulida: se
                  ejecuta al finalizar la última actividad; requiere mínimo 3 semanas.
                </div>
              </div>
            </div>
          )}

          {tab === "tracker" && (
            <div id="tab-tracker" className="tab-panel">
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-label">Contrato Total</div>
                  <div className="stat-value v-accent">{fmt(stats.totContract)}</div>
                  <div className="stat-sub">Valor acordado total</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Pagado</div>
                  <div className="stat-value v-green">{fmt(stats.totPaid)}</div>
                  <div className="stat-sub">Quincenas cerradas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Saldo Pendiente</div>
                  <div className="stat-value v-red">{fmt(stats.totRemain)}</div>
                  <div className="stat-sub">Por pagar</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Avance Global</div>
                  <div className="stat-value v-text">{stats.wpct.toFixed(1)}%</div>
                  <div className="mini-bar">
                    <div className="mini-bar-fill" style={{ width: `${stats.wpct.toFixed(1)}%` }} />
                  </div>
                </div>
              </div>

              <div className="section-hdr">
                <div className="section-hdr-left">
                  <span className="section-title">Actividades</span>
                </div>
                <button type="button" className="btn btn-primary" onClick={addRow}>
                  <IconPlus />
                  Nueva actividad
                </button>
              </div>

              <TrackerTable
                rows={rows}
                actividadColWidth={actividadColWidth}
                onColWidthChange={persistColWidth}
                onSetField={setField}
                onCommitStaging={commitStaging}
                onDeleteRow={deleteRow}
                onReorder={reorderRows}
              />

              <div style={{ marginTop: 32 }}>
                <div className="section-hdr">
                  <div className="section-hdr-left">
                    <span className="section-title">Quincenas</span>
                    <span className="section-hint">
                      Registra lo ejecutado y cierra el pago de cada quincena
                    </span>
                  </div>
                  <button type="button" className="btn btn-ghost" onClick={addPeriod}>
                    <IconPlus />
                    Nueva quincena
                  </button>
                </div>
                <BiweeklyGrid
                  periods={periods}
                  rows={rows}
                  onDeletePeriod={deletePeriod}
                  onClosePayment={closePayment}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
