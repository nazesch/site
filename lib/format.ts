export function num(v: unknown): number {
  return parseFloat(String(v ?? "")) || 0;
}

export function fmt(n: number): string {
  if (Number.isNaN(n) || n === null) return "$0";
  return (
    "$" +
    Number(n).toLocaleString("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}

export function fmtQty(n: number, maxFraction = 2): string {
  return n.toLocaleString("es-CO", { maximumFractionDigits: maxFraction });
}
