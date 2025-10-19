// app/layout.tsx
import "./globals.css";
import MobileGuard from "@/components/MobileGuard";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "Gemini Festive Challenge",
  description:
    "🎯 Complete 5 fun AI-powered tasks and unlock your achievement!",
  openGraph: {
    title: "Gemini Festive Challenge",
    description:
      "🎯 Complete 5 fun AI-powered tasks and unlock your achievement!",
    url: "https://gsa-challenge.vercel.app/", 
    siteName: "Gemini Festive Challenge",
    author: "Harsh Mistry",
    images: [
      {
        url: "https://gsa-challenge.vercel.app/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Gemini Festive Challenge Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gemini Festive Challenge",
    description:
      "🎯 Complete 5 fun AI-powered tasks and unlock your achievement!",
    site: "@yourTwitterHandle", // optional
    creator: "@yourTwitterHandle", // optional
    images: ["https://gsa-challenge.vercel.app/og-image.jpg"], // same OG image
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-inter text-gray-800 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
        {/* Header */}
        <AppHeader />

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center pt-[var(--header-height,4rem)]">
          <MobileGuard>{children}</MobileGuard>
        </main>

        {/* Footer */}
        <AppFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}


