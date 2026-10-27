"use client";

import { useEffect, useRef, useState } from "react";

// Leitor de QR Code via câmera (universal, usando jsQR). O jsQR é importado
// dinamicamente só quando o leitor abre, pra não pesar o bundle do painel.
export default function LeitorQR({
  onLer,
  onFechar,
}: {
  onLer: (texto: string) => void;
  onFechar: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    let parado = false;
    const canvas = document.createElement("canvas");

    async function iniciar() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setErro("Este navegador não permite acesso à câmera. Use a validação manual.");
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
      } catch {
        setErro("Não foi possível acessar a câmera. Autorize o acesso ou valide manualmente.");
        return;
      }

      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      try {
        await video.play();
      } catch {
        /* alguns navegadores só tocam após interação — segue tentando ler */
      }

      const jsQR = (await import("jsqr")).default;

      const tick = () => {
        if (parado) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          const w = video.videoWidth;
          const h = video.videoHeight;
          if (w && h) {
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(video, 0, 0, w, h);
              const img = ctx.getImageData(0, 0, w, h);
              const code = jsQR(img.data, w, h, { inversionAttempts: "dontInvert" });
              if (code && code.data) {
                parado = true;
                onLer(code.data.trim());
                return;
              }
            }
          }
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    iniciar();

    return () => {
      parado = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [onLer]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-black">
        <video ref={videoRef} playsInline muted className="w-full" />
        <div className="pointer-events-none absolute inset-8 rounded-xl border-2 border-limao/80" />
      </div>
      <p className="mt-4 max-w-sm text-center font-[family-name:var(--font-archivo)] text-sm text-white/70">
        {erro || "Aponte a câmera para o QR Code do voucher."}
      </p>
      <button
        onClick={onFechar}
        className="mt-4 rounded-xl border border-white/20 px-6 py-2.5 font-[family-name:var(--font-archivo)] text-sm font-semibold text-white transition hover:border-white"
      >
        Fechar
      </button>
    </div>
  );
}
