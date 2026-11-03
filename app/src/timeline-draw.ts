// Career timeline: a vertical line draws itself as the list scrolls through
// the viewport, and each role's marker lights up once the line reaches it.
export function initTimelineDraw(): () => void {
  const list = document.querySelector<HTMLElement>(".experience-list");
  if (!list) return () => {};
  const items = Array.from(list.querySelectorAll<HTMLElement>(":scope > li"));
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    list.style.setProperty("--draw", "1");
    items.forEach((li) => li.classList.add("is-passed"));
    return () => {};
  }
  let frame = 0;
  const update = () => {
    frame = 0;
    const rect = list.getBoundingClientRect();
    const reach = window.innerHeight * 0.6 - rect.top;
    const draw = Math.min(1, Math.max(0, reach / rect.height));
    list.style.setProperty("--draw", draw.toFixed(4));
    items.forEach((li) => {
      const marker = li.offsetTop + 24;
      li.classList.toggle("is-passed", reach >= marker);
    });
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    cancelAnimationFrame(frame);
  };
}
