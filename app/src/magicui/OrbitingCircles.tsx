import { Children, type CSSProperties, type ReactNode } from "react";

// Port of Magic UI OrbitingCircles: children spaced evenly on a circle of
// `radius`, each orbiting with the `orbit` keyframes over duration/speed.
export function OrbitingCircles({
  children,
  reverse = false,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}) {
  const count = Children.count(children);
  return (
    <>
      {path && (
        <svg className="mui-orbit__path" aria-hidden="true">
          <circle cx="50%" cy="50%" r={radius} fill="none" />
        </svg>
      )}
      {Children.map(children, (child, index) => (
        <div
          className={`mui-orbit__item${reverse ? " is-reverse" : ""}`}
          style={
            {
              "--duration": duration / speed,
              "--radius": radius,
              "--angle": (360 / count) * index,
              "--icon-size": `${iconSize}px`,
            } as CSSProperties
          }
        >
          {child}
        </div>
      ))}
    </>
  );
}
