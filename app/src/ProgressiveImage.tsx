import { useEffect, useRef, useState } from "react";

/** Reserved image space prevents layout shifts; shimmer follows actual loading. */
export default function ProgressiveImage({
  src,
  alt,
  eager = false,
  sizes,
}: {
  src: string;
  alt: string;
  eager?: boolean;
  /** Rendered width hint; enables the 720w variant for project screenshots. */
  sizes?: string;
}) {
  const image = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  // Project screenshots ship a 720px-wide copy next to the 1440px original.
  const srcSet =
    sizes && /\/assets\/projects\/[^/]+\.webp$/.test(src)
      ? `${src.replace(/\.webp$/, "-720.webp")} 720w, ${src} 1440w`
      : undefined;
  useEffect(() => {
    if (image.current?.complete) {
      setStatus(image.current.naturalWidth ? "loaded" : "error");
    } else {
      setStatus("loading");
    }
  }, [src]);
  return (
    <span
      className={`progressive-image is-${status}`}
      aria-busy={status === "loading"}
    >
      {status === "loading" && (
        <span className="image-skeleton" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      )}
      <img
        ref={image}
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
      {status === "error" && (
        <span className="image-error" role="status">
          تعذّر تحميل الصورة. يمكنك متابعة قراءة تفاصيل المشروع.
        </span>
      )}
    </span>
  );
}
