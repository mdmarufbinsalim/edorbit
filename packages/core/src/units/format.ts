/** Format a number to a given count of significant figures, switching to scientific notation for extremes. */
export function formatSig(value: number, sig = 4): string {
  if (!Number.isFinite(value)) return value > 0 ? "∞" : value < 0 ? "−∞" : "—";
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1e6 || abs < 1e-3) {
    const [m, e] = value.toExponential(sig - 1).split("e");
    return `${m} × 10^${Number(e)}`;
  }
  return Number(value.toPrecision(sig)).toLocaleString("en-US", { maximumSignificantDigits: sig });
}

/** Format a quantity with its unit, e.g. "7.546 km/s". */
export const formatQuantity = (value: number, unit: string, sig = 4): string =>
  unit ? `${formatSig(value, sig)} ${unit}` : formatSig(value, sig);
