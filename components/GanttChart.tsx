"use client";

import { GANTT_SCHEDULE } from "@/lib/constants";
import {
  buildDayList,
  buildMonths,
  buildWeeks,
  dayLetter,
  fmtDate,
  inRange,
  weekLabel,
} from "@/lib/gantt-utils";
import type { GanttOverrides } from "@/lib/types";

type Props = {
  overrides: GanttOverrides;
  onToggleDay: (key: string, active: boolean) => void;
};

export function GanttChart({ overrides, onToggleDay }: Props) {
  const days = buildDayList();
  const months = buildMonths(days);
  const weeks = buildWeeks(days);

  return (
    <div className="gantt-wrap">
      <table id="gantt-table">
        <tbody>
          <tr className="gantt-month-row">
            <th rowSpan={3} className="g-act-col hdr">
              ACTIVIDAD
            </th>
            {months.map((m) => (
              <th key={`${m.label}-${m.count}`} colSpan={m.count} className="g-month-hdr">
                {m.label.toUpperCase()}
              </th>
            ))}
          </tr>
          <tr className="gantt-week-row">
            {weeks.map((w, i) => (
              <th key={i} colSpan={w.days.length} className="g-week-hdr">
                {weekLabel(w.days)}
              </th>
            ))}
          </tr>
          <tr className="gantt-day-row">
            {days.map((d) => (
              <th key={fmtDate(d)} className="g-day-hdr">
                <div className="dl">{dayLetter(d)}</div>
                <div className="dn">{d.getDate()}</div>
              </th>
            ))}
          </tr>
          {Object.entries(GANTT_SCHEDULE).map(([act, ranges]) => (
            <tr key={act}>
              <td className="g-act-col">{act}</td>
              {days.map((d) => {
                const ds = fmtDate(d);
                const key = `${act}|${ds}`;
                const def = inRange(ds, ranges);
                const show = overrides[key] !== undefined ? overrides[key] : def;
                const isSat = d.getDay() === 6;
                return (
                  <td
                    key={key}
                    className={`g-day${isSat ? " sat" : ""}${show ? " active-day" : ""}`}
                    title={`${act} – ${ds}`}
                    onClick={() => onToggleDay(key, !show)}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
