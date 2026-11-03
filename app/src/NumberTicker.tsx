import { useEffect, useRef } from "react";

// Port of Magic UI NumberTicker. The original drives the number with
// motion's useSpring({ damping: 60, stiffness: 100 }) (mass 1) and starts
// once the element is in view (margin 0). Here the same spring is solved
// analytically (overdamped, zero initial velocity) with motion's rest
// thresholds (restDelta 0.5, restSpeed 2), so no new dependency is needed.
// Reduced motion shows the final value immediately (project requirement).
const STIFFNESS = 100;
const DAMPING = 60;
const MASS = 1;
const REST_DELTA = 0.5;
const REST_SPEED = 2;

type Props = {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  className?: string;
  /** Gate: counting starts only once this is true (e.g. after the loading intro). */
  ready?: boolean;
};

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  className = "",
  ready = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const format = (n: number) =>
      Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(Number(n.toFixed(decimalPlaces)));
    const from = direction === "down" ? value : startValue;
    const to = direction === "down" ? startValue : value;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = format(to);
      return;
    }
    el.textContent = format(from);
    if (!ready) return;

    const w0 = Math.sqrt(STIFFNESS / MASS);
    const zeta = DAMPING / (2 * Math.sqrt(STIFFNESS * MASS));
    const wd = w0 * Math.sqrt(zeta * zeta - 1);
    const c1 = from - to;
    const c2 = (zeta * w0 * c1) / wd;
    const position = (t: number) =>
      to + Math.exp(-zeta * w0 * t) * (c1 * Math.cosh(wd * t) + c2 * Math.sinh(wd * t));

    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = () => {
      const t0 = performance.now();
      const step = (now: number) => {
        const t = (now - t0) / 1000;
        const x = position(t);
        const v = (position(t + 0.001) - x) / 0.001;
        if (Math.abs(x - to) < REST_DELTA && Math.abs(v) < REST_SPEED) {
          el.textContent = format(to);
          return;
        }
        el.textContent = format(x);
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(run, delay * 1000);
      },
      { rootMargin: "0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, startValue, direction, delay, decimalPlaces, ready]);

  return (
    <span ref={ref} className={`number-ticker ${className}`.trim()}>
      {startValue}
    </span>
  );
}
