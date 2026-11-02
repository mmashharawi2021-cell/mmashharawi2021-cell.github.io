import { useEffect, useRef } from "react";

// Port of Magic UI DiaTextReveal (single text). Same gradient band (±17%),
// sweep range, cubic in-out easing, colours, delay and duration. motion's
// animate/useInView/useReducedMotion are replaced by requestAnimationFrame,
// IntersectionObserver (amount 0.1, once) and matchMedia to avoid a new
// dependency. `direction="rtl"` mirrors the sweep so Arabic reveals from the right.
const DEFAULT_COLORS = ["#c679c4", "#fa3d1d", "#ffb005", "#e1e1fe", "#0358f7"];
const BAND_HALF = 17;
const SWEEP_START = -BAND_HALF;
const SWEEP_END = 100 + BAND_HALF;

const sweepEase = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

function buildGradient(pos: number, colors: string[], textColor: string, angle: number) {
  const bandStart = pos - BAND_HALF;
  const bandEnd = pos + BAND_HALF;
  if (bandStart >= 100) return `linear-gradient(${angle}deg, ${textColor}, ${textColor})`;
  const n = colors.length;
  const parts: string[] = [];
  if (bandStart > 0) parts.push(`${textColor} 0%`, `${textColor} ${bandStart.toFixed(2)}%`);
  colors.forEach((c, i) => {
    const pct = n === 1 ? pos : bandStart + (i / (n - 1)) * BAND_HALF * 2;
    parts.push(`${c} ${pct.toFixed(2)}%`);
  });
  if (bandEnd < 100) parts.push(`transparent ${bandEnd.toFixed(2)}%`, `transparent 100%`);
  return `linear-gradient(${angle}deg, ${parts.join(", ")})`;
}

type Props = {
  text: string;
  colors?: string[];
  textColor?: string;
  duration?: number;
  delay?: number;
  startOnView?: boolean;
  direction?: "ltr" | "rtl";
  className?: string;
};

export function DiaTextReveal({
  text,
  colors = DEFAULT_COLORS,
  textColor = "var(--text)",
  duration = 1.5,
  delay = 0,
  startOnView = true,
  direction = "ltr",
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const angle = direction === "rtl" ? 270 : 90;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const paint = (pos: number) => {
      el.style.backgroundImage = buildGradient(pos, colors, textColor, angle);
    };
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      paint(SWEEP_END);
      return;
    }
    paint(SWEEP_START);
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const play = () => {
      timer = setTimeout(() => {
        const t0 = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - t0) / (duration * 1000));
          paint(SWEEP_START + (SWEEP_END - SWEEP_START) * sweepEase(t));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      }, delay * 1000);
    };
    let io: IntersectionObserver | undefined;
    if (startOnView) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            io?.disconnect();
            play();
          }
        },
        { threshold: 0.1 },
      );
      io.observe(el);
    } else play();
    return () => {
      io?.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [text, colors.join(), textColor, duration, delay, startOnView, angle]);

  return (
    <span ref={ref} className={`dia-text-reveal ${className}`.trim()}>
      {text}
    </span>
  );
}
