import { useEffect, useRef, useState } from "react";
import { ExternalLink, Volume2, VolumeX } from "lucide-react";

const ORIGINAL_URL = "https://www.facebook.com/share/v/1Qs6f1TQYa/";
const EMBED_URL = "https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(ORIGINAL_URL) + "&show_text=false&autoplay=true&mute=true&allowfullscreen=true";

export default function FeaturedPortfolioVideo({ poster }: { poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [useFacebook, setUseFacebook] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || useFacebook) return;
    video.muted = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting && !document.hidden) {
        void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        video.pause();
        setPlaying(false);
      }
    }, { threshold: 0.15 });
    observer.observe(video);
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (video.getBoundingClientRect().bottom > 0 && video.getBoundingClientRect().top < window.innerHeight) {
        void video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [useFacebook]);

  const toggleAudio = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    if (video.paused) void video.play().catch(() => {});
  };

  return (
    <div className="featured-portfolio-video">
      <div className="featured-portfolio-video__viewport">
        {useFacebook ? (
          <div className="featured-portfolio-video__fallback">
            <img
              src={poster}
              alt="معاينة الفيديو الخاص بتوثيق أضرار المباني"
              className="featured-portfolio-video__media"
              loading="lazy"
              decoding="async"
            />
            <a
              className="featured-portfolio-video__fallback-link"
              href={ORIGINAL_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={17} aria-hidden="true" />
              مشاهدة الفيديو على Facebook
            </a>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="featured-portfolio-video__media"
              src={import.meta.env.BASE_URL + "assets/damage-assessment.mp4"}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={poster}
              aria-label="نظم المعلومات الجغرافية في توثيق أضرار المباني"
              onError={() => setUseFacebook(true)}
              onPlaying={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
            <button
              type="button"
              className="featured-portfolio-video__sound"
              onClick={toggleAudio}
              aria-label={isMuted ? "تشغيل صوت الفيديو" : "إيقاف صوت الفيديو"}
              aria-pressed={!isMuted}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              <span className="sr-only">{isMuted ? "تشغيل الصوت" : "إيقاف الصوت"}</span>
            </button>
            {!playing && <span className="featured-portfolio-video__waiting" aria-live="polite">معاينة الفيديو</span>}
          </>
        )}
      </div>
      <div className="featured-portfolio-video__footer">
        <h3 className="featured-portfolio-video__title">نظم المعلومات الجغرافية في توثيق أضرار المباني</h3>
        <p className="featured-portfolio-video__summary">جانب من تجربتي في توثيق الأضرار ميدانيًا وإدارة البيانات الجغرافية ضمن فريق العمل</p>
        <a href={ORIGINAL_URL} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={15} aria-hidden="true" />
          مشاهدة الفيديو الأصلي على Facebook
        </a>
      </div>
      {useFacebook && <span className="featured-portfolio-video__hint">تعذّر تشغيل الفيديو في هذا المتصفح، ويمكن مشاهدته على Facebook</span>}
    </div>
  );
}
