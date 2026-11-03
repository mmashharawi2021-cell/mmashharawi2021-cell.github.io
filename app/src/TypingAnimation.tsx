import { useEffect, useMemo, useRef, useState } from "react";

// Port of Magic UI TypingAnimation (words + loop). Same typing/pause/deleting
// state machine and timings; the motion `useInView` dependency is replaced by
// a native IntersectionObserver (amount 0.3, once) to avoid a new package.
type Props = {
  words: string[];
  className?: string;
  duration?: number;
  typeSpeed?: number;
  deleteSpeed?: number;
  delay?: number;
  pauseDelay?: number;
  loop?: boolean;
  startOnView?: boolean;
  showCursor?: boolean;
  blinkCursor?: boolean;
  cursorStyle?: "line" | "block" | "underscore";
};

const cursorChar = { line: "|", block: "▌", underscore: "_" } as const;

export function TypingAnimation({
  words,
  className = "",
  duration = 100,
  typeSpeed,
  deleteSpeed,
  delay = 0,
  pauseDelay = 1000,
  loop = false,
  startOnView = true,
  showCursor = true,
  blinkCursor = true,
  cursorStyle = "line",
}: Props) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");
  const [isInView, setIsInView] = useState(!startOnView);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const ref = useRef<HTMLSpanElement | null>(null);

  const hasMultipleWords = words.length > 1;
  const typingSpeed = typeSpeed ?? duration;
  const deletingSpeed = deleteSpeed ?? typingSpeed / 2;
  const sourceKey = useMemo(() => words.join("\u0000"), [words]);

  useEffect(() => {
    if (!startOnView || isInView || !ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [startOnView, isInView]);

  useEffect(() => {
    setDisplayedText("");
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setPhase("typing");
  }, [sourceKey]);

  useEffect(() => {
    if (reduced || !isInView || words.length === 0) return;
    const timeoutDelay =
      delay > 0 && displayedText === ""
        ? delay
        : phase === "typing"
          ? typingSpeed
          : phase === "deleting"
            ? deletingSpeed
            : pauseDelay;

    const timeout = setTimeout(() => {
      const graphemes = Array.from(words[currentWordIndex] || "");
      switch (phase) {
        case "typing":
          if (currentCharIndex < graphemes.length) {
            setDisplayedText(graphemes.slice(0, currentCharIndex + 1).join(""));
            setCurrentCharIndex(currentCharIndex + 1);
          } else if (hasMultipleWords || loop) {
            const isLastWord = currentWordIndex === words.length - 1;
            if (!isLastWord || loop) setPhase("pause");
          }
          break;
        case "pause":
          setPhase("deleting");
          break;
        case "deleting":
          if (currentCharIndex > 0) {
            setDisplayedText(graphemes.slice(0, currentCharIndex - 1).join(""));
            setCurrentCharIndex(currentCharIndex - 1);
          } else {
            setCurrentWordIndex((currentWordIndex + 1) % words.length);
            setPhase("typing");
          }
          break;
      }
    }, timeoutDelay);
    return () => clearTimeout(timeout);
  }, [reduced, isInView, phase, currentCharIndex, currentWordIndex, displayedText, words, hasMultipleWords, loop, typingSpeed, deletingSpeed, pauseDelay, delay]);

  const currentGraphemes = Array.from(words[currentWordIndex] || "");
  const isComplete =
    !loop &&
    currentWordIndex === words.length - 1 &&
    currentCharIndex >= currentGraphemes.length &&
    phase !== "deleting";
  const shouldShowCursor =
    !reduced && showCursor && !isComplete &&
    (hasMultipleWords || loop || currentCharIndex < currentGraphemes.length);

  const text = reduced ? words[0] ?? "" : displayedText;

  return (
    <span ref={ref} className={`typing-animation${phase === "pause" ? " is-complete" : ""} ${className}`.trim()}>
      <span className="sr-only">{words.join("، ")}</span>
      {/* Invisible sizers keep the box at the widest word so layout never shifts. */}
      {words.map((w) => (
        <span key={w} className="typing-animation__sizer" dir="auto" aria-hidden="true">
          {w}
          {showCursor && <span className="typing-animation__cursor">{cursorChar[cursorStyle]}</span>}
        </span>
      ))}
      <span className="typing-animation__text" dir="auto" aria-hidden="true">
        {text}
        {shouldShowCursor && (
          <span className={`typing-animation__cursor${blinkCursor ? " is-blinking" : ""}`}>
            {cursorChar[cursorStyle]}
          </span>
        )}
      </span>
    </span>
  );
}
