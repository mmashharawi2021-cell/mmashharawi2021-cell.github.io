import type { CSSProperties, ReactNode } from "react";

// Port of Magic UI Marquee (horizontal): `repeat` copies of the children
// scroll by -100% - gap over --duration, optional pause on hover.
export function Marquee({
  children,
  repeat = 4,
  reverse = false,
  pauseOnHover = false,
  duration = "40s",
  gap = "1rem",
  className = "",
  label,
}: {
  children: ReactNode;
  repeat?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  duration?: string;
  gap?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`mui-marquee${pauseOnHover ? " pause-on-hover" : ""}${reverse ? " is-reverse" : ""} ${className}`.trim()}
      style={{ "--duration": duration, "--gap": gap } as CSSProperties}
      role={label ? "group" : undefined}
      aria-label={label}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div key={i} className="mui-marquee__track" aria-hidden={i > 0 ? true : undefined}>
          {children}
        </div>
      ))}
    </div>
  );
}
