import React, { useEffect, useRef } from 'react';

/**
 * Full-page cinematic background video.
 *
 * The uploaded MP4 is scrubbed from 0 → 100% as the user scrolls
 * from the top → bottom of the document. A small RAF interpolation
 * keeps the movement smooth instead of jumping between scroll events.
 */
export default function ScrollVideoBackground({ isEnabled = true }) {
  const videoRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafRef = useRef(null);
  const lastSeekRef = useRef(-1);

  useEffect(() => {
    if (!isEnabled) return undefined;

    const updateTarget = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );

      targetProgressRef.current = Math.min(1, Math.max(0, scrollTop / maxScroll));
    };

    updateTarget();
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
    };
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled) return undefined;

    let active = true;

    const render = () => {
      if (!active) return;

      const video = videoRef.current;
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;

      currentProgressRef.current += (target - current) * 0.065;

      if (Math.abs(target - currentProgressRef.current) < 0.0002) {
        currentProgressRef.current = target;
      }

      if (
        video &&
        Number.isFinite(video.duration) &&
        video.duration > 0 &&
        video.readyState >= 2
      ) {
        const nextTime = Math.max(
          0,
          Math.min(video.duration - 0.001, currentProgressRef.current * video.duration)
        );

        if (Math.abs(nextTime - lastSeekRef.current) > 0.012) {
          try {
            video.currentTime = nextTime;
            lastSeekRef.current = nextTime;
          } catch {
            // Ignore browser seek races during rapid scrolling.
          }
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="scroll-video-background" aria-hidden="true">
      <video
        ref={videoRef}
        className="scroll-video-background__video"
        src="/freshfind-scroll-background.mp4"
        muted
        playsInline
        preload="auto"
        poster="/brand_logo.jpg"
        onLoadedMetadata={(event) => {
          event.currentTarget.currentTime = 0;
        }}
      />

      <div className="scroll-video-background__shade" />
      <div className="scroll-video-background__vignette" />
    </div>
  );
}
