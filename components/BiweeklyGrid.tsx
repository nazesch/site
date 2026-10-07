"use client";

import { fmt, num } from "@/lib/format";
import type { ActivityRow, Period } from "@/lib/types";
import { IconClose } from "./icons";

type Props = {
  periods: Period[];
  rows: ActivityRow[];
  onDeletePeriod: (id: number) => void;
  onClosePayment: (id: number) => void;
};

export function BiweeklyGrid({ periods, rows, onDeletePeriod, onClosePayment }: Props) {
  return (
    <div className="periods-grid">
      {periods.map((p) => {
        const snap = p.snapshot || [];
        const total = snap.reduce((s, x) => s + x.amount, 0);
        const isOpen = snap.length === 0;
        const pendingRows = isOpen ? rows.filter((r) => num(r.staging) > 0) : [];
        const pendingTotal = pendingRows.reduce(
          (s, r) => s + num(r.price) * num(r.staging),
          0,
        );

        return (
          <div key={p.id} className={`period-card${isOpen ? " is-open" : ""}`}>
            <div className="period-header">
              <span className="period-label">{p.label}</span>
              <button
                type="button"
                className="icon-btn"
                onClick={() => onDeletePeriod(p.id)}
                title="Eliminar"
              >
                <IconClose size={11} />
              </button>
            </div>
            <div className="period-amount">{fmt(total)}</div>
            <div className="period-sub">{isOpen ? "Quincena abierta" : "Pago cerrado"}</div>
            <div className="period-rows">
              {snap.length ? (
                snap.map((x) => (
                  <div key={x.name} className="period-row">
                    <span>{x.name}</span>
                    <span className="pr-val">{fmt(x.amount)}</span>
                  </div>
                ))
              ) : (
                <div className="period-empty">Sin movimientos</div>
              )}
            </div>
            {isOpen && pendingRows.length > 0 && (
              <div className="pending-preview">
                <div className="pp-title">⏳ Pendiente staging</div>
                {pendingRows.map((r) => (
                  <div key={r.id} className="pp-row">
                    <span>{r.name}</span>
                    <span>{fmt(num(r.price) * num(r.staging))}</span>
                  </div>
                ))}
                <div className="pp-total">
                  <span>Estimado quincena</span>
                  <span>{fmt(pendingTotal)}</span>
                </div>
              </div>
            )}
            {isOpen ? (
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", fontSize: 12 }}
                onClick={() => onClosePayment(p.id)}
              >
                Registrar pago quincena
              </button>
            ) : (
              <div className="paid-badge">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Pago registrado
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
