import type { PointerEvent } from "react";

/** Pointer tracking shared by Magic Card surfaces; does not affect clicks or layout. */
export function trackMagicCard(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--magic-x", `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty("--magic-y", `${event.clientY - bounds.top}px`);
}
