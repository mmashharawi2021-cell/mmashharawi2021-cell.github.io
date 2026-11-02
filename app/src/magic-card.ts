import type { PointerEvent } from "react";

/** Magic UI-inspired spotlight gradient; uses existing site's theme variables. */
export function trackMagicCard(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--magic-x", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--magic-y", `${event.clientY - rect.top}px`);
}
