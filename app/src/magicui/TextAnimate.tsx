import { useEffect, useRef, useState } from "react";

// Port of Magic UI TextAnimate, animation="blurInUp", by="word" (Arabic
// letters must stay joined, so words are the smallest unit). Each word goes
// from opacity 0 / blur(10px) / y 20px to rest (y .3s, opacity .4s, filter
// .3s); stagger = duration / segments, as in the original. Starts when in
// view and `ready` (e.g. after the loading intro). Reduced motion: static.
export function TextAnimate({
  text,
  duration = 0.3,
  delay = 0,
  ready = true,
  className = "",
}: {
  text: string;
  duration?: number;
  delay?: number;
  ready?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);
  const [still] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const words = text.split(/(\s+)/);
  const segments = words.filter((w) => w.trim()).length || 1;
  const stagger = duration / segments;

  useEffect(() => {
    if (still || !ready || shown || !ref.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ready, shown, still]);

  // Once every word has landed, render plain text again so the host element
  // behaves exactly as before (e.g. background-clip gradients and hover).
  useEffect(() => {
    if (!shown) return;
    const total = (delay + stagger * (segments - 1) + 0.45) * 1000;
    const timer = setTimeout(() => setDone(true), total);
    return () => clearTimeout(timer);
  }, [shown, delay, stagger, segments]);

  if (still || done) return <>{text}</>;
  let index = 0;
  return (
    <span ref={ref} className={`mui-text-animate${shown ? " is-shown" : ""} ${className}`.trim()} aria-label={text}>
      {words.map((part, i) =>
        part.trim() ? (
          <span
            key={i}
            className="mui-text-animate__word"
            aria-hidden="true"
            style={{ transitionDelay: `${delay + stagger * index++}s` }}
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
}
