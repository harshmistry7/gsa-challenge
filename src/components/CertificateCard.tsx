"use client";

import { useEffect, useRef, useState } from "react";
import CertificateEditor from "./CertificateEditor";
import { Card, CardContent } from "@/components/ui/card";

interface CertificateCardProps {
  template: string;
}

export default function CertificateCard({ template }: CertificateCardProps) {
  const [name, setName] = useState("");
  const downloadFunctionRef = useRef<(() => string | null) | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedName = (localStorage.getItem("g5_name") || "").replace(
      /^"|"$/g,
      ""
    );
    setName(storedName);
  }, []);

  const handleDownloadFunction = (fn: () => string | null) => {
    downloadFunctionRef.current = fn;
  };

  const download = () => {
    const dataUrl = downloadFunctionRef.current?.();
    if (!dataUrl) return alert("Certificate is still loading. Please wait.");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${name || "user"}_gsa_certificate.png`;
    a.click();
  };

  const shareLinkedIn = async () => {
    if (!downloadFunctionRef.current)
      return alert("Certificate is not ready yet.");

    // Convert canvas to image URL
    const dataUrl = downloadFunctionRef.current();

    if (!dataUrl) {
      alert("Certificate not loaded yet. Please wait a moment.");
      return;
    }

    // Upload the generated certificate image to your own server or image host (e.g., Imgur, Cloudinary)
    // For demo purposes, let’s assume your backend can take a base64 image and return a public URL
    // Example API: POST /api/upload-certificate
    const res = await fetch("/api/upload-certificate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: dataUrl }),
    });

    const { imageUrl } = await res.json(); // e.g., https://yourcdn.com/uploads/user_certificate.png

    const message = `
🎉 I’m thrilled to share that I’ve successfully completed the **Gemini 5-Step Festive AI Challenge** and earned my certificate! 🏆  

A huge thanks to HARSH MISTRY — Google Student Ambassador at ADIT — for creating this engaging and educational challenge powered by AI. 🤖✨  

#GeminiChallenge #AI #LearningJourney #GoogleStudentAmbassador #ADIT #Achievement #Innovation
  `;

    // LinkedIn post composer with text and image preview link
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
      message + "\n\nView my certificate: " + imageUrl
    )}`;

    window.open(linkedInUrl, "_blank");
  };

  const tryAgain = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("g5_progress");
    localStorage.removeItem("g5_name");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8 pb-10 px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardContent className="text-center p-6">
            <div className="text-5xl mb-3 animate-bounce">🏆</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Quest Complete!
            </h2>
            <p className="text-green-700 text-sm font-medium truncate">
              Congratulations, {name || "Explorer"}!
            </p>
            <p className="text-green-600 text-xs mt-1">
              You&apos;ve successfully completed all 5 AI-powered challenges
            </p>
          </CardContent>
        </Card>

        {/* Certificate Display */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardContent className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <span>📜</span> Your Achievement Certificate
            </h3>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200 overflow-hidden">
              <CertificateEditor
                template={template}
                name={name}
                onDownload={handleDownloadFunction}
              />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              🎖️ Certified Gemini Festive Explorer
            </p>
          </CardContent>
        </Card>

        {/* Buttons */}
        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={download}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            📥 Download Certificate
          </button>
          {/* <button
              onClick={shareLinkedIn}
              className=" w-full border-2 border-blue-400 text-blue-600 hover:bg-green-50 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
               Share on Linkedin
            </button> */}

          <button
            onClick={tryAgain}
            className="w-full border-2 border-pink-400 text-pink-600 hover:bg-blue-50 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            🔄 Take Challenge Again
          </button>
        </div>
      </div>
    </div>
  );
}
