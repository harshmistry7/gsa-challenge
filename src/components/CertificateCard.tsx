"use client";

import { useEffect, useRef, useState } from "react";
import CertificateEditor from "./CertificateEditor";

interface CertificateCardProps {
  template: string;
}

export default function CertificateCard({ template }: CertificateCardProps) {
  const [name, setName] = useState("");
  const downloadFunctionRef = useRef<(() => string | null) | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("g5_name") || "";
      // Remove any surrounding double quotes
      const cleanName = storedName.replace(/^"|"$/g, "");
      setName(cleanName);
    }
  }, []);

  // Handle download function from CertificateEditor
  const handleDownloadFunction = (getDataUrlFn: () => string | null) => {
    downloadFunctionRef.current = getDataUrlFn;
  };

  async function download() {
    if (!downloadFunctionRef.current) {
      alert("Certificate is still loading. Please wait.");
      return;
    }

    try {
      const dataUrl = downloadFunctionRef.current();
      if (!dataUrl) {
        alert("Unable to generate certificate. Please try again.");
        return;
      }

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${name || "user"}_gsa_certificate.jpg`;
      a.click();
    } catch (e) {
      console.error("Download error:", e);
      alert("Unable to generate image. Please try again.");
    }
  }

  function shareWhatsApp() {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `🎉 I just completed the Gemini 5-Step Festive Challenge and earned my certificate as a Certified Gemini Festive Explorer! 🏆\n\nCheck it out: ${url}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function shareInstagram() {
    const caption = `🎉 Just completed the Gemini 5-Step Festive Challenge! 🏆 #GeminiFestiveChallenge #AIChallenge #Achievement`;
    navigator.clipboard.writeText(caption);
    alert("✨ Caption copied! Paste it on Instagram when sharing your image.");
  }

  function tryAgain() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("g5_progress");
    localStorage.removeItem("g5_name");
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 pb-10 px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header Section */}
        <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-lg">
          <div className="text-5xl mb-3 animate-bounce">🏆</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Quest Complete!
          </h2>
          <p className="text-green-700 text-sm font-medium truncate">
            Congratulations, {name || "Explorer"}!
          </p>
          <p className="text-green-600 text-xs mt-1">
            You've successfully completed all 5 AI-powered challenges
          </p>
        </div>

        {/* Certificate Preview */}
        <div className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <span>📜</span> Your Achievement Certificate
            </h3>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-dashed border-blue-200 overflow-hidden">
              <CertificateEditor
                template={template}
                name={name}
                onDownload={handleDownloadFunction}
              />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              🎖️ Certified Gemini Festive Explorer
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={download}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            📥 Download Certificate
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareWhatsApp}
              className="border-2 border-green-400 text-green-600 hover:bg-green-50 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span className="mr-1">📤</span> WhatsApp
            </button>
            <button
              onClick={shareInstagram}
              className="border-2 border-pink-400 text-pink-600 hover:bg-pink-50 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span className="mr-1">📸</span> Instagram
            </button>
          </div>

          <button
            onClick={tryAgain}
            className="w-full border-2 border-blue-400 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            🔄 Take Challenge Again
          </button>
        </div>
      </div>
    </div>
  );
}
