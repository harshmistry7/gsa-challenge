"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // ShadCN skeleton

interface CertificateEditorProps {
  template: string;
  name: string;
  onDownload?: (getDataUrlFn: () => string | null) => void;
}

interface TextConfig {
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  align: CanvasTextAlign;
}

export default function CertificateEditor({
  template,
  name,
  onDownload,
}: CertificateEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const TEXT_CONFIG: Record<string, TextConfig> = {
    name: { x: 873, y: 570, fontSize: 40, fontFamily: "GoogleSans", fontWeight: "bold", color: "#000000", align: "center" },
    date: { x: 494, y: 989, fontSize: 16, fontFamily: "GoogleSans", fontWeight: "500", color: "#000000", align: "center" },
  };

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Load fonts with race between local and Google URL
  useEffect(() => {
    const loadFontFast = async (name: string, local: string, google: string) => {
      try {
        const font = await Promise.race([
          new FontFace(name, `url(${local})`).load(),
          new FontFace(name, `url(${google})`).load(),
        ]);
        document.fonts.add(font);
      } catch (err) {
        console.error("Font loading failed", err);
      }
    };

    const loadAllFonts = async () => {
      await Promise.all([
        loadFontFast("GoogleSans", "/fonts/GoogleSans-Regular.ttf", "https://fonts.gstatic.com/s/googlesans/v58/4Ua_rENHsxJlGDuGo1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6cAwhX9RFD48TE63OOYKtrwEIJllpyk.woff2"),
        loadFontFast("GoogleSans", "/fonts/GoogleSans-Medium.ttf", "https://fonts.gstatic.com/s/googlesans/v58/4Ua_rENHsxJlGDuGo1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6cAwhX9RFD48TE63OOYKtpgEIJllpyk.woff2"),
        loadFontFast("GoogleSans", "/fonts/GoogleSans-Bold.ttf", "https://fonts.gstatic.com/s/googlesans/v58/4Ua_rENHsxJlGDuGo1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6cAwhX9RFD48TE63OOYKtrwEIJllpyk.woff2"),
      ]);
      setFontsLoaded(true);
    };

    loadAllFonts();
  }, []);

  // Draw certificate
  useEffect(() => {
    if (imageLoaded && fontsLoaded && name) {
      const canvas = canvasRef.current;
      const img = imageRef.current;
      if (!canvas || !img) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0);

      const drawText = (text: string, config: TextConfig) => {
        ctx.font = `${config.fontWeight} ${config.fontSize}pt "${config.fontFamily}", Arial, sans-serif`;
        ctx.fillStyle = config.color;
        ctx.textAlign = config.align;
        ctx.textBaseline = "middle";
        ctx.fillText(text, config.x, config.y);
      };

      drawText(name, TEXT_CONFIG.name);
      drawText(getCurrentDate(), TEXT_CONFIG.date);
    }
  }, [imageLoaded, fontsLoaded, name, template]);

  // Expose download
  useEffect(() => {
    if (onDownload) {
      onDownload(() => canvasRef.current?.toDataURL("image/png") || null);
    }
  }, [imageLoaded, fontsLoaded, name, onDownload]);

  return (
    <div className="w-full relative">
      {!imageLoaded || !fontsLoaded ? (
        <Skeleton className="w-full h-[350px] md:h-[450px] rounded-xl" />
      ) : null}

      <img
        ref={imageRef}
        src={template || "/cert-template.png"}
        alt="certificate template"
        className="hidden"
        onLoad={() => setImageLoaded(true)}
        crossOrigin="anonymous"
      />

      <canvas
        ref={canvasRef}
        className={`mx-auto max-w-full h-auto rounded-lg shadow-md transition-opacity duration-500 ${
          imageLoaded && fontsLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
