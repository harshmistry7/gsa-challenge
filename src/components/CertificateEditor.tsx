"use client";

import { useEffect, useRef, useState } from "react";

type CanvasTextAlign = CanvasRenderingContext2D["textAlign"];

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

const TEXT_CONFIG: Record<string, TextConfig> = {
  name: {
    x: 873,
    y: 570,
    fontSize: 40,
    fontFamily: "GoogleSans",
    fontWeight: "700",
    color: "#000",
    align: "center",
  },
  date: {
    x: 494,
    y: 989,
    fontSize: 16,
    fontFamily: "GoogleSans",
    fontWeight: "500",
    color: "#000",
    align: "center",
  },
};

export default function CertificateEditor({
  template,
  name,
  onDownload,
}: CertificateEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

  /** ✅ Load fonts safely (client-side only) */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const fonts = [
      { name: "GoogleSans", weight: "400", url: "/fonts/GoogleSans-Regular.ttf" },
      { name: "GoogleSans", weight: "500", url: "/fonts/GoogleSans-Medium.ttf" },
      { name: "GoogleSans", weight: "700", url: "/fonts/GoogleSans-Bold.ttf" },
    ];

    const loadFont = async (font: (typeof fonts)[0]) => {
      try {
        const f = new FontFace(font.name, `url(${font.url})`, { weight: font.weight });
        await f.load();
        document.fonts.add(f);
      } catch {
        console.warn("⚠️ Failed to load font:", font.name);
      }
    };

    Promise.all(fonts.map(loadFont)).then(() => setFontsLoaded(true));
  }, []);

  /** ✅ Load certificate image safely */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const img = new Image();
    img.src = template;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImgRef(img);
      setImageLoaded(true);
    };
  }, [template]);

  /** ✅ Draw text after image and fonts load */
  useEffect(() => {
    if (!fontsLoaded || !imageLoaded || !canvasRef.current || !imgRef) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = imgRef.naturalWidth;
    canvas.height = imgRef.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgRef, 0, 0);

    const drawText = (text: string, cfg: TextConfig) => {
      ctx.font = `${cfg.fontWeight} ${cfg.fontSize}pt ${cfg.fontFamily}, Arial, sans-serif`;
      ctx.fillStyle = cfg.color;
      ctx.textAlign = cfg.align;
      ctx.textBaseline = "middle";
      ctx.fillText(text, cfg.x, cfg.y);
    };

    drawText(name, TEXT_CONFIG.name);
    const dateStr = new Date().toLocaleDateString("en-GB");
    drawText(dateStr, TEXT_CONFIG.date);
  }, [fontsLoaded, imageLoaded, name, imgRef]);

  /** ✅ Expose download function */
  useEffect(() => {
    if (!onDownload || !canvasRef.current) return;
    onDownload(() => canvasRef.current?.toDataURL("image/png") || null);
  }, [fontsLoaded, imageLoaded, name, onDownload]);

  return (
    <div className="w-full flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto rounded-lg shadow-md"
      />
      {(!fontsLoaded || !imageLoaded) && (
        <p className="text-gray-500 text-sm mt-2">Loading certificate...</p>
      )}
    </div>
  );
}
