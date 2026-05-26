"use client";

import { useState } from "react";

const DRIVE_GIF_EMBED =
  "https://drive.google.com/file/d/1P3jFwvfvrsjE21b2t3khYVGeUugoq0jk/preview";

export default function SachetVideo() {
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-white/5 min-h-[320px] md:min-h-[400px]">
      {!iframeError ? (
        /* GIF via Google Drive preview embed – autoplay, sem chrome */
        <iframe
          src={DRIVE_GIF_EMBED}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay"
          loading="lazy"
          title="CarboZé — Sequência de Takes"
          onError={() => setIframeError(true)}
        />
      ) : (
        /* Fallback: vídeo local */
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/sache-moto.jpg"
        >
          <source src="/sache-video.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
