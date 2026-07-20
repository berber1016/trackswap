/**
 * FIT pipeline verbose logging (disabled unless TRACKSWAP_FIT_DEBUG=1 or TRACKSWAP_DEBUG=1).
 */
export function fitDebugEnabled(): boolean {
  return (
    process.env.TRACKSWAP_FIT_DEBUG === "1" ||
    process.env.TRACKSWAP_DEBUG === "1"
  );
}

export function fitDebugLog(...args: unknown[]): void {
  if (fitDebugEnabled()) console.log(...args);
}

export function fitDebugWarn(...args: unknown[]): void {
  if (fitDebugEnabled()) console.warn(...args);
}
