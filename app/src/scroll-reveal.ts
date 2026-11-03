// Sections fade and slide into view as the visitor scrolls to them.
// Hidden state applies only once <html> has .reveal-ready (set here), so the
// page stays fully visible without JS or with reduced motion.
const SINGLE = [
  ".section-heading",
  ".about-intro",
  ".experience-head",
  ".stats-section > .eyebrow",
  ".process-section > .eyebrow",
  ".contact-panel",
];
const GROUPS = [
  ".stats-grid > .stat-card",
  ".services-grid > .service",
  ".skills-list > .skill-row",
  ".experience-list > li",
  ".process-grid > article",
];

export function initScrollReveal(root: ParentNode = document): () => void {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return () => {};
  if (!("IntersectionObserver" in window)) return () => {};

  const targets: HTMLElement[] = [];
  root.querySelectorAll<HTMLElement>(SINGLE.join(",")).forEach((el) => targets.push(el));
  GROUPS.forEach((selector) => {
    const byParent = new Map<Element, number>();
    root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      const parent = el.parentElement!;
      const index = byParent.get(parent) ?? 0;
      byParent.set(parent, index + 1);
      el.style.setProperty("--reveal-delay", `${Math.min(index, 6) * 80}ms`);
      targets.push(el);
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );
  targets.forEach((el) => {
    // Anything already on screen at start is shown without animating.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-revealed");
    el.setAttribute("data-reveal", "");
    io.observe(el);
  });
  document.documentElement.classList.add("reveal-ready");

  return () => {
    io.disconnect();
    document.documentElement.classList.remove("reveal-ready");
  };
}
