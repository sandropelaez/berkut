import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Berkut — Learn Kazakh",
  description:
    "A gamified language-learning app that teaches Kazakh to English speakers through bite-sized lessons, speech practice, and cultural immersion.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Berkut — Learn Kazakh",
    description: "Learn Kazakh the fun way with dual-script support.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#00B4D8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-berkut-bg min-h-screen">
        <div className="max-w-[480px] mx-auto min-h-screen relative">
          {children}
        </div>
      </body>
    </html>
  );
}
