"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconDrag } from "@/components/icons";
import {
  buildDayList,
  buildMonths,
  buildWeeks,
  dayLetter,
  fmtDate,
  inRange,
  weekLabel,
} from "@/lib/gantt-utils";
import type { GanttActivity, GanttOverrides } from "@/lib/types";

type Props = {
  activities: GanttActivity[];
  endDate: string;
  overrides: GanttOverrides;
  onSetDays: (keys: string[], active: boolean) => void;
  onReorder: (srcId: string, targetId: string) => void;
  onRenameActivity: (id: string, name: string) => void;
};

type PaintState = {
  actName: string;
  startIdx: number;
  value: boolean;
  dragged: boolean;
};

function barSegmentClass(active: boolean, prevActive: boolean, nextActive: boolean): string {
  if (!active) return "";
  if (!prevActive && !nextActive) return "bar-solo";
  if (!prevActive && nextActive) return "bar-start";
  if (prevActive && nextActive) return "bar-mid";
  return "bar-end";
}

export function GanttChart({
  activities,
  endDate,
  overrides,
  onSetDays,
  onReorder,
  onRenameActivity,
}: Props) {
  const days = buildDayList(endDate);
  const months = buildMonths(days);
  const weeks = buildWeeks(days);
  const todayIso = useMemo(() => fmtDate(new Date()), []);
  const [dragSrcId, setDragSrcId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const paintRef = useRef<PaintState | null>(null);
  const [painting, setPainting] = useState(false);

  const isDayActive = useCallback(
    (act: GanttActivity, ds: string) => {
      const key = `${act.name}|${ds}`;
      const def = inRange(ds, act.ranges);
      return overrides[key] !== undefined ? overrides[key] : def;
    },
    [overrides],
  );

  const keysForRange = useCallback(
    (actName: string, fromIdx: number, toIdx: number) => {
      const lo = Math.min(fromIdx, toIdx);
      const hi = Math.max(fromIdx, toIdx);
      const keys: string[] = [];
      for (let i = lo; i <= hi; i++) {
        keys.push(`${actName}|${fmtDate(days[i])}`);
      }
      return keys;
    },
    [days],
  );

  const applyPaintRange = useCallback(
    (actName: string, fromIdx: number, toIdx: number, value: boolean) => {
      onSetDays(keysForRange(actName, fromIdx, toIdx), value);
    },
    [keysForRange, onSetDays],
  );

  useEffect(() => {
    const onUp = () => {
      const p = paintRef.current;
      if (p && !p.dragged) {
        onSetDays([`${p.actName}|${fmtDate(days[p.startIdx])}`], p.value);
      }
      paintRef.current = null;
      setPainting(false);
    };
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, [days, onSetDays]);

  const handleDrop = useCallback(
    (targetId: string) => {
      if (dragSrcId === null || dragSrcId === targetId) return;
      onReorder(dragSrcId, targetId);
      setDragSrcId(null);
      setDragOverId(null);
    },
    [dragSrcId, onReorder],
  );

  const onDayPointerDown = (
    act: GanttActivity,
    dayIdx: number,
    ds: string,
    e: React.PointerEvent,
  ) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const show = isDayActive(act, ds);
    paintRef.current = {
      actName: act.name,
      startIdx: dayIdx,
      value: !show,
      dragged: false,
    };
    setPainting(true);
  };

  const onDayPointerEnter = (act: GanttActivity, dayIdx: number) => {
    const p = paintRef.current;
    if (!p || p.actName !== act.name) return;
    if (dayIdx !== p.startIdx) p.dragged = true;
    applyPaintRange(p.actName, p.startIdx, dayIdx, p.value);
  };

  return (
    <div className="gantt-shell">
      <div className={`gantt-wrap${painting ? " is-painting" : ""}`}>
      <table id="gantt-table">
        <thead className="gantt-head">
          <tr className="gantt-month-row">
            <th rowSpan={3} className="g-act-col hdr" scope="col">
              Actividad
            </th>
            {months.map((m) => (
              <th key={`${m.label}-${m.count}`} colSpan={m.count} className="g-month-hdr" scope="col">
                {m.label}
              </th>
            ))}
          </tr>
          <tr className="gantt-week-row">
            {weeks.map((w, i) => (
              <th key={i} colSpan={w.days.length} className="g-week-hdr" scope="col">
                {weekLabel(w.days)}
              </th>
            ))}
          </tr>
          <tr className="gantt-day-row">
            {days.map((d) => {
              const ds = fmtDate(d);
              return (
              <th
                key={ds}
                className={`g-day-hdr${ds === todayIso ? " is-today" : ""}`}
                scope="col"
              >
                <span className="g-day-hdr-inner">
                  <span className="dl">{dayLetter(d)}</span>
                  <span className="dn">{d.getDate()}</span>
                </span>
              </th>
            );
            })}
          </tr>
        </thead>
        <tbody>
          {activities.map((act) => (
            <tr
              key={act.id}
              className={`gantt-row${dragSrcId === act.id ? " dragging" : ""}${dragOverId === act.id ? " drag-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverId(act.id);
              }}
              onDragLeave={() => setDragOverId((id) => (id === act.id ? null : id))}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(act.id);
              }}
            >
              <td className="g-act-col">
                <div className="g-act-cell">
                  <span
                    className="drag-handle gantt-drag-handle"
                    draggable
                    onDragStart={(e) => {
                      setDragSrcId(act.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => {
                      setDragSrcId(null);
                      setDragOverId(null);
                    }}
                  >
                    <IconDrag />
                  </span>
                  <input
                    type="text"
                    className="g-act-name-input"
                    value={act.name}
                    onChange={(e) => onRenameActivity(act.id, e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    aria-label="Nombre de actividad"
                  />
                </div>
              </td>
              {days.map((d, dayIdx) => {
                const ds = fmtDate(d);
                const show = isDayActive(act, ds);
                const prevDs = dayIdx > 0 ? fmtDate(days[dayIdx - 1]) : null;
                const nextDs = dayIdx < days.length - 1 ? fmtDate(days[dayIdx + 1]) : null;
                const prevActive = prevDs ? isDayActive(act, prevDs) : false;
                const nextActive = nextDs ? isDayActive(act, nextDs) : false;
                const seg = barSegmentClass(show, prevActive, nextActive);
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                return (
                  <td
                    key={`${act.id}|${ds}`}
                    className={`g-day${isWeekend ? " weekend" : ""}${ds === todayIso ? " is-today" : ""}${show ? ` active-day ${seg}` : ""}`}
                    title={`${act.name} – ${ds}`}
                    onPointerDown={(e) => onDayPointerDown(act, dayIdx, ds, e)}
                    onPointerEnter={() => onDayPointerEnter(act, dayIdx)}
                  >
                    <span className="g-day-bar" aria-hidden />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
