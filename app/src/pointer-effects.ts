// Pointer-only touches (devices with a fine hovering pointer):
// - magnetic primary buttons that lean toward the cursor when it comes close
// - a soft spotlight that follows the cursor inside service cards
const MAGNETIC = ".hero .actions .button.primary, .header-cta";
const RANGE = 90; // px around the button where it starts to pull
const PULL = 0.28; // fraction of the distance it moves
const MAX = 10; // px cap

export function initPointerEffects(): () => void {
  const fine = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
  const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!fine) return () => {};

  const buttons = still ? [] : Array.from(document.querySelectorAll<HTMLElement>(MAGNETIC));
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".services-grid > .service"));
  let frame = 0;
  let pointer: { x: number; y: number } | null = null;

  const update = () => {
    frame = 0;
    buttons.forEach((button) => {
      const r = button.getBoundingClientRect();
      // Measure from the resting position, not the shifted one.
      const [tx, ty] = (button.style.translate || "0px 0px").split(" ").map((v) => parseFloat(v) || 0);
      const cx = r.left - tx + r.width / 2;
      const cy = r.top - ty + r.height / 2;
      let x = 0;
      let y = 0;
      if (pointer) {
        const dx = pointer.x - cx;
        const dy = pointer.y - cy;
        const near =
          Math.abs(dx) < r.width / 2 + RANGE && Math.abs(dy) < r.height / 2 + RANGE;
        if (near) {
          x = Math.max(-MAX, Math.min(MAX, dx * PULL));
          y = Math.max(-MAX, Math.min(MAX, dy * PULL));
        }
      }
      button.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const move = (event: PointerEvent) => {
    pointer = { x: event.clientX, y: event.clientY };
    schedule();
  };
  const leave = () => {
    pointer = null;
    schedule();
  };
  const spot = (event: PointerEvent) => {
    const card = event.currentTarget as HTMLElement;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - r.left}px`);
    card.style.setProperty("--my", `${event.clientY - r.top}px`);
  };

  // Organisation logos: a name tooltip that follows the pointer.
  const tip = document.createElement("div");
  tip.className = "org-tooltip";
  tip.setAttribute("aria-hidden", "true");
  document.body.appendChild(tip);
  const tipMove = (event: PointerEvent) => {
    const logo = (event.target as HTMLElement).closest<HTMLElement>(".org-avatar");
    if (!logo) {
      tip.classList.remove("is-visible");
      return;
    }
    tip.textContent = logo.dataset.name ?? logo.getAttribute("aria-label") ?? "";
    tip.style.left = `${event.clientX}px`;
    tip.style.top = `${event.clientY}px`;
    tip.classList.add("is-visible");
  };
  const tipHide = () => tip.classList.remove("is-visible");
  const logos = document.querySelector<HTMLElement>(".work-avatar-circles");
  logos?.addEventListener("pointermove", tipMove, { passive: true });
  logos?.addEventListener("pointerleave", tipHide);
  window.addEventListener("scroll", tipHide, { passive: true });

  if (buttons.length) {
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
  }
  cards.forEach((card) => {
    card.classList.add("has-spotlight");
    card.addEventListener("pointermove", spot, { passive: true });
  });
  return () => {
    logos?.removeEventListener("pointermove", tipMove);
    logos?.removeEventListener("pointerleave", tipHide);
    window.removeEventListener("scroll", tipHide);
    tip.remove();
    window.removeEventListener("pointermove", move);
    document.removeEventListener("pointerleave", leave);
    cancelAnimationFrame(frame);
    buttons.forEach((b) => (b.style.translate = ""));
    cards.forEach((card) => {
      card.classList.remove("has-spotlight");
      card.removeEventListener("pointermove", spot);
    });
  };
}
