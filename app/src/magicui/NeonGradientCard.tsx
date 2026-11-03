import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// Port of Magic UI NeonGradientCard: a gradient border (borderSize) plus a
// blurred copy (blur = width / 3) whose background position spins up/down.
export function NeonGradientCard({
  children,
  borderSize = 2,
  borderRadius = 20,
  neonColors = { firstColor: "#ff00aa", secondColor: "#00FFF1" },
  className = "",
}: {
  children: ReactNode;
  borderSize?: number;
  borderRadius?: number;
  neonColors?: { firstColor: string; secondColor: string };
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`mui-neon ${className}`.trim()}
      style={
        {
          "--border-size": `${borderSize}px`,
          "--border-radius": `${borderRadius}px`,
          "--neon-first-color": neonColors.firstColor,
          "--neon-second-color": neonColors.secondColor,
          "--card-content-radius": `${borderRadius - borderSize}px`,
          "--pseudo-element-width": `${size.width + borderSize * 2}px`,
          "--pseudo-element-height": `${size.height + borderSize * 2}px`,
          "--after-blur": `${size.width / 3}px`,
        } as CSSProperties
      }
    >
      <div className="mui-neon__content">{children}</div>
    </div>
  );
}
