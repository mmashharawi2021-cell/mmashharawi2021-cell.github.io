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
          <iframe
            className="featured-portfolio-video__media"
            src={EMBED_URL}
            title="فيديو حصر الأضرار المتكامل على Facebook"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
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
              aria-label="فيديو حصر الأضرار المتكامل"
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
              <span>{isMuted ? "تشغيل الصوت" : "إيقاف الصوت"}</span>
            </button>
            {!playing && <span className="featured-portfolio-video__waiting" aria-live="polite">معاينة الفيديو</span>}
          </>
        )}
      </div>
      <div className="featured-portfolio-video__footer">
        <span>مشروع حصر الأضرار المتكامل</span>
        <a href={ORIGINAL_URL} target="_blank" rel="noopener noreferrer">
          الفيديو الأصلي تجده هنا <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
      {useFacebook && <span className="featured-portfolio-video__hint">يمكن التحكم بالصوت من مشغّل Facebook</span>}
    </div>
  );
}
