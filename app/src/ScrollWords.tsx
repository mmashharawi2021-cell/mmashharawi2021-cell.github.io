// Headings whose words light up one by one as the heading scrolls through
// the viewport. Words are plain <em> elements so existing `h2 > span`
// accent rules are unaffected.
export function ScrollWords({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((part, index) =>
        /^\s+$/.test(part) || part === "" ? (
          part
        ) : (
          <em key={index} className="scroll-word">
            {part}
          </em>
        ),
      )}
    </>
  );
}

export function initScrollWords(): () => void {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return () => {};
  const headings = Array.from(document.querySelectorAll<HTMLElement>("h2")).filter((h) =>
    h.querySelector(".scroll-word"),
  );
  if (!headings.length) return () => {};
  const groups = headings.map((h) => Array.from(h.querySelectorAll<HTMLElement>(".scroll-word")));
  let frame = 0;
  const update = () => {
    frame = 0;
    const vh = window.innerHeight;
    headings.forEach((heading, i) => {
      const top = heading.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, (vh * 0.88 - top) / (vh * 0.4)));
      const words = groups[i];
      const lit = Math.round(progress * words.length);
      words.forEach((word, w) => word.classList.toggle("is-lit", w < lit));
    });
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  document.documentElement.classList.add("words-ready");
  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    cancelAnimationFrame(frame);
    document.documentElement.classList.remove("words-ready");
  };
}
