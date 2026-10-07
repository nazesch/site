"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ACTIVITY_UNITS } from "@/lib/constants";
import { fmt, fmtQty, num } from "@/lib/format";
import { rowProgressPct } from "@/lib/tracker-data";
import type { ActivityRow } from "@/lib/types";
import { IconClose, IconDrag } from "./icons";

type Props = {
  rows: ActivityRow[];
  actividadColWidth: number | null;
  onColWidthChange: (width: number) => void;
  onSetField: (id: number, field: keyof ActivityRow, value: string) => void;
  onCommitStaging: (id: number) => void;
  onDeleteRow: (id: number) => void;
  onReorder: (srcId: number, targetId: number) => void;
};

function progressBarClass(pct: number): string {
  if (pct >= 100) return "row-bar bar-full";
  if (pct >= 50) return "row-bar bar-mid";
  if (pct > 0) return "row-bar bar-low";
  return "row-bar bar-zero";
}

function statusBadge(pct: number) {
  if (pct >= 100) return <span className="badge badge-done">Completado</span>;
  if (pct > 0) return <span className="badge badge-prog">En progreso</span>;
  return <span className="badge badge-idle">Sin iniciar</span>;
}

export function TrackerTable({
  rows,
  actividadColWidth,
  onColWidthChange,
  onSetField,
  onCommitStaging,
  onDeleteRow,
  onReorder,
}: Props) {
  const thRef = useRef<HTMLTableCellElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [dragSrcId, setDragSrcId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  useEffect(() => {
    const th = thRef.current;
    if (!th || actividadColWidth == null) return;
    th.style.minWidth = `${actividadColWidth}px`;
    th.style.width = `${actividadColWidth}px`;
  }, [actividadColWidth]);

  useEffect(() => {
    const handle = handleRef.current;
    const th = thRef.current;
    if (!handle || !th) return;

    let startX = 0;
    let startW = 0;

    const onMove = (e: MouseEvent) => {
      const newW = Math.max(120, startW + (e.clientX - startX));
      th.style.minWidth = `${newW}px`;
      th.style.width = `${newW}px`;
    };

    const onUp = () => {
      handle.classList.remove("resizing");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      onColWidthChange(th.offsetWidth);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    const onDown = (e: MouseEvent) => {
      e.preventDefault();
      startX = e.clientX;
      startW = th.offsetWidth;
      handle.classList.add("resizing");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    handle.addEventListener("mousedown", onDown);
    return () => handle.removeEventListener("mousedown", onDown);
  }, [onColWidthChange]);

  const handleDrop = useCallback(
    (targetId: number) => {
      if (dragSrcId === null || dragSrcId === targetId) return;
      onReorder(dragSrcId, targetId);
      setDragSrcId(null);
      setDragOverId(null);
    },
    [dragSrcId, onReorder],
  );

  return (
    <div className="tbl-wrap">
      <table className="tbl" id="tracker-table">
        <thead>
          <tr>
            <th style={{ width: 28 }} />
            <th style={{ width: 32, textAlign: "center" }}>#</th>
            <th
              ref={thRef}
              style={{ minWidth: 170 }}
              className="resizable-th"
              id="th-actividad"
            >
              Actividad
              <div className="col-resize-handle" ref={handleRef} id="resize-actividad" />
            </th>
            <th style={{ width: 90, minWidth: 90 }}>Unidad</th>
            <th style={{ width: 100 }}>Cant. Total</th>
            <th style={{ width: 110 }}>Precio/Unidad</th>
            <th style={{ width: 110 }}>Total Contrato</th>
            <th style={{ width: 140 }}>
              Cant. Ejecutada{" "}
              <span style={{ color: "var(--text3)", fontWeight: 400 }}>(staging)</span>
            </th>
            <th style={{ width: 110 }}>Cant. Acumulada</th>
            <th style={{ width: 110 }}>Pago Quincena</th>
            <th style={{ width: 105 }}>Total Pagado</th>
            <th style={{ width: 105 }}>Saldo</th>
            <th style={{ width: 130 }}>Avance</th>
            <th style={{ width: 32 }} />
          </tr>
        </thead>
        <tbody id="tracker-body">
          {rows.map((row, idx) => {
            const contract = num(row.price) * num(row.qty);
            const stagingPay = num(row.price) * num(row.staging);
            const accum = num(row.accumulated);
            const paid = num(row.paid);
            const remaining = contract - paid;
            const pct = rowProgressPct(row);
            const isDragging = dragSrcId === row.id;
            const isDragOver = dragOverId === row.id && dragSrcId !== row.id;

            return (
              <tr
                key={row.id}
                data-id={row.id}
                draggable
                className={[isDragging && "dragging", isDragOver && "drag-over"]
                  .filter(Boolean)
                  .join(" ") || undefined}
                onDragStart={(e) => {
                  setDragSrcId(row.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={() => {
                  setDragSrcId(null);
                  setDragOverId(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  setDragOverId(row.id);
                }}
                onDragLeave={() => {
                  if (dragOverId === row.id) setDragOverId(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(row.id);
                }}
              >
                <td>
                  <span className="drag-handle" title="Arrastrar para reordenar">
                    <IconDrag />
                  </span>
                </td>
                <td className="dim">{idx + 1}</td>
                <td>
                  <input
                    className="cell-input"
                    value={row.name}
                    onChange={(e) => onSetField(row.id, "name", e.target.value)}
                    style={{ minWidth: 150 }}
                  />
                </td>
                <td>
                  <select
                    className="cell-input"
                    style={{ minWidth: 70, width: 70 }}
                    value={row.unit}
                    onChange={(e) => onSetField(row.id, "unit", e.target.value)}
                  >
                    {ACTIVITY_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className="cell-input num"
                    type="number"
                    min={0}
                    step={0.01}
                    value={row.qty || ""}
                    onChange={(e) => onSetField(row.id, "qty", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="cell-input num"
                    type="number"
                    min={0}
                    step={100}
                    value={row.price || ""}
                    onChange={(e) => onSetField(row.id, "price", e.target.value)}
                  />
                </td>
                <td className="num v-text2" style={{ fontWeight: 500 }}>
                  {fmt(contract)}
                </td>
                <td>
                  <div className="staging-cell">
                    <input
                      className="cell-input num"
                      type="number"
                      min={0}
                      step={0.01}
                      value={row.staging || ""}
                      placeholder="0"
                      onChange={(e) => onSetField(row.id, "staging", e.target.value)}
                      style={{ width: 72 }}
                    />
                    <button
                      type="button"
                      className="commit-btn"
                      onClick={() => onCommitStaging(row.id)}
                    >
                      ✓ OK
                    </button>
                  </div>
                </td>
                <td className="num v-text2">
                  {fmtQty(accum)}{" "}
                  <span style={{ color: "var(--text3)" }}>{row.unit}</span>
                </td>
                <td className="num v-accent" style={{ fontWeight: 500 }}>
                  {fmt(stagingPay)}
                </td>
                <td className="num v-green" style={{ fontWeight: 500 }}>
                  {fmt(paid)}
                </td>
                <td
                  className={`num ${remaining > 0 ? "v-red" : "v-green"}`}
                  style={{ fontWeight: 500 }}
                >
                  {fmt(remaining)}
                </td>
                <td>
                  <div className="row-bar-wrap">
                    <div className={progressBarClass(pct)} style={{ width: `${pct.toFixed(1)}%` }} />
                  </div>
                  <div className="row-bar-label">
                    {pct.toFixed(1)}% {statusBadge(pct)}
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => onDeleteRow(row.id)}
                    title="Eliminar"
                  >
                    <IconClose />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
