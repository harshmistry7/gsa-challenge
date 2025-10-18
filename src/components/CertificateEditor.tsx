"use client";

import { useEffect, useRef, useState } from "react";
type CanvasTextAlign = CanvasRenderingContext2D['textAlign'];

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

// Stable TEXT_CONFIG outside component to avoid hook dependency warnings
const TEXT_CONFIG: Record<string, TextConfig> = {
  name: { x: 873, y: 570, fontSize: 40, fontFamily: "GoogleSans", fontWeight: "bold", color: "#000000", align: "center" },
  date: { x: 494, y: 989, fontSize: 16, fontFamily: "GoogleSans", fontWeight: "500", color: "#000000", align: "center" },
};

export default function CertificateEditor({ template, name, onDownload }: CertificateEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts: prefer local TTF, fallback to Google link
  useEffect(() => {
    const fontFiles = [
      { name: "GoogleSans", weight: "400", url: "/fonts/GoogleSans-Regular.ttf" },
      { name: "GoogleSans", weight: "500", url: "/fonts/GoogleSans-Medium.ttf" },
      { name: "GoogleSans", weight: "700", url: "/fonts/GoogleSans-Bold.ttf" },
    ];

    const loadFont = async (font: typeof fontFiles[0]) => {
      try {
        const f = new FontFace(font.name, `url(${font.url})`, { weight: font.weight });
        await f.load();
        document.fonts.add(f);
      } catch {
        // fallback to Google hosted font
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=Google+Sans:wght@${font.weight}&display=swap`;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    };

    Promise.all(fontFiles.map(loadFont)).then(() => setFontsLoaded(true));
  }, []);

  // Draw certificate whenever image, fonts, or name change
  useEffect(() => {
    if (imageLoaded && fontsLoaded && name) drawCertificate();
  }, [imageLoaded, fontsLoaded, name]);

  const getCurrentDate = (): string => {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, "0")}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getFullYear()}`;
  };

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = template || "/cert-template.png";
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const drawText = (text: string, cfg: TextConfig) => {
        ctx.font = `${cfg.fontWeight} ${cfg.fontSize}pt "${cfg.fontFamily}", Arial, sans-serif`;
        ctx.fillStyle = cfg.color;
        ctx.textAlign = cfg.align;
        ctx.textBaseline = "middle";
        ctx.fillText(text, cfg.x, cfg.y);
      };

      drawText(name, TEXT_CONFIG.name);
      drawText(getCurrentDate(), TEXT_CONFIG.date);
    };
  };

  // Provide download function to parent
  useEffect(() => {
    if (onDownload) onDownload(() => canvasRef.current?.toDataURL("image/png") || null);
  }, [imageLoaded, fontsLoaded, name, onDownload]);

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="mx-auto max-w-full h-auto rounded-lg shadow-md" />
      {(!imageLoaded || !fontsLoaded) && (
        <div className="text-center text-gray-500 text-sm mt-2">Loading certificate...</div>
      )}
    </div>
  );
}
