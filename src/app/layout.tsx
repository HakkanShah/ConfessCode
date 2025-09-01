
import type { Metadata, Viewport } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const fontCode = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-code",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "<ConfessCode/>",
  description: "An anonymous platform where coders, college students, and users can confess their secrets, share gossips, vent frustrations, and reveal dark truths — all safely and privately without saving credentials.",
  manifest: "/manifest.webmanifest",
  keywords: [
    "anonymous confessions",
    "coding confessions",
    "college secrets",
    "gossip platform",
    "vent anonymously",
    "dark truths",
    "online confessions",
    "anonymous chat",
    "fun confessions",
    "privacy-first",
    "hakkan parbej shah",
    "hakkan confesscode",
    "vercel confesscode"
  ],
  authors: [
    { name: "Hakkan Shah" }
  ],
  creator: "Hakkan Shah",
  category: "Social / Anonymous Confessions",
  applicationName: "<ConfessCode/>",
  robots: "index, follow",
  themeColor: "#00ffe0",
  openGraph: {
    title: "<ConfessCode/>",
    description: "Confess your coding sins, secrets, gossips, and dark truths anonymously. Interact safely with others without revealing your identity.",
    url: "https://www.concode.vercel.app/",
    siteName: "<ConfessCode/>",
    images: [
      {
        url: "https://assets.clever.com/resource-icons/apps/53e92d20fc1adfa44400fe87/icon_7585b0c.png",
        width: 1200,
        height: 630,
        alt: "ConfessCode - Anonymous Confessions"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "<ConfessCode/>",
    description: "Share your secrets, confessions, and gossips anonymously with other coders and students.",
    creator: "@HakkanShah",
    images: ["https://assets.clever.com/resource-icons/apps/53e92d20fc1adfa44400fe87/icon_7585b0c.png"]
  }
};


export const viewport: Viewport = {
  themeColor: "#00ffe0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={cn(
          "relative min-h-screen antialiased font-body flex flex-col bg-background text-foreground selection:bg-accent/30 selection:text-accent",
          fontBody.variable,
          fontCode.variable
        )}
      >
        {/* 🌌 Cyber Background */}
        <div id="stars1"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div className="scanlines pointer-events-none"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none"></div>

        {/* 🛰️ Floating Sticky Header */}
        <Header />

        {/* 📜 Main Content */}
        <main className="flex-1 w-full relative z-10 pt-24 pb-12">
          <div className="container max-w-2xl mx-auto px-4">
            {children}
          </div>
        </main>

        {/* ⚡ Hacker Footer (Enhanced) */}
        <footer className="w-full fixed bottom-0 left-0 z-10 
  flex items-center justify-between gap-4
  max-w-2xl mx-auto px-5 py-3 
  rounded-t-2xl bg-background/80 backdrop-blur-sm
  border-t border-accent/30">
  
  <p className="text-xs font-mono text-muted-foreground truncate">
    &gt; crafted by{" "}
    <a
      href="https://github.com/HakkanShah"
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-dotted text-accent hover:text-primary transition-colors"
    >
      Hakkan
    </a>
  </p>

  <p className="text-[11px] text-muted-foreground font-mono opacity-70 whitespace-nowrap">
    v1.0.0&nbsp;|&nbsp;online
  </p>
</footer>


        {/* 🔔 Toast Notifications */}
        <Toaster />
      </body>
    </html>
  );
}
