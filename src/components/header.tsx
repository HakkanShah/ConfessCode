"use client";

import { Button } from "@/components/ui/button";
import { Code2, Power, Info, Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import InfoDialog from "./info-dialog";
import { TypeAnimation } from "react-type-animation";

const Header = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [anonHash, setAnonHash] = useState<string | undefined>(undefined);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const router = useRouter();

  /* 📲 Handle PWA Install */
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  };

  /*  🔐 Check Activation Status */
  useEffect(() => {
    const checkActivation = () => {
      const activated = Cookies.get("is_activated") === "true";
      const hash = Cookies.get("anon_hash");
      setIsActivated(activated);
      setAnonHash(hash);
    };
    checkActivation();
    const interval = setInterval(checkActivation, 1000);
    return () => clearInterval(interval);
  }, []);

  /* 👨‍💻 Hidden Admin Shortcut */
  useEffect(() => {
    if (logoClickCount === 3) {
      router.push("/admin/login");
      setLogoClickCount(0);
    }
    const timer = setTimeout(() => {
      if (logoClickCount > 0) setLogoClickCount(0);
    }, 1500);
    return () => clearTimeout(timer);
  }, [logoClickCount, router]);

  const handleLogoClick = () => setLogoClickCount((prev) => prev + 1);

  return (
    <>
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-30 
        w-[92%] max-w-3xl px-4 py-2 
        flex items-center justify-between 
        rounded-full bg-background/70 backdrop-blur-xl 
        border border-accent/30 shadow-[0_0_12px_rgba(0,255,255,0.25)]">
        
        {/* 🚀 Logo + Title */}
        <div className="flex items-center gap-2">
          <div
            onClick={handleLogoClick}
            className="cursor-pointer text-accent active:scale-95 transition-transform hover:drop-shadow-[0_0_6px_#00ffe0]"
            title="ConfessCode"
          >
            <Code2 className="h-6 w-6" />
          </div>
          <TypeAnimation
            sequence={[
              "<ConfessCode/>",
              1000,
              "<Anonymous/>",
              1000,
              "<Secrects/>",
              1000,
              "<Nobody Knows/>",
              1000,
              "<ConfessCode/>",
              1000,
            ]}
            wrapper="span"
            speed={50}
            className="text-base sm:text-lg font-code font-bold tracking-wide text-accent hover:text-primary transition-colors"
            repeat={Infinity}
          />
        </div>

        {/* 🔐 Right Section */}
        <div className="flex items-center gap-2">
          {/* 👤 Compact User Badge */}
          {isActivated && anonHash && (
            <span className="hidden sm:flex items-center text-[11px] px-2 py-0.5 rounded-full bg-muted/30 border border-accent/40 text-accent">
              usr::{anonHash.substring(0, 4)}
            </span>
          )}

          {/* ℹ️ Info */}
          <button
            onClick={() => setIsInfoOpen(true)}
            aria-label="Information"
            className="p-2 rounded-full border border-accent/40 hover:bg-accent/20 transition"
          >
            <Info className="h-4 w-4 text-accent" />
          </button>
 
          {/* 📲 Install App */}
          {installPrompt && (
            <button
              onClick={handleInstallClick}
              aria-label="Install App"
              title="Install ConfessCode"
              className="p-2 rounded-full border border-accent/40 hover:bg-accent/20 transition"
            >
              <Download className="h-4 w-4 text-accent" />
            </button>
          )}

          {/* 🔑 Activate */}
          {!isActivated && (
            <Link href="/activate">
              <Button className="px-3 py-1.5 rounded-full bg-accent text-black hover:bg-accent/90 transition text-xs sm:text-sm">
                <Power className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">activate</span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* ℹ️ Info Modal */}
      <InfoDialog open={isInfoOpen} onOpenChange={setIsInfoOpen} />
    </>
  );
};

export default Header; 
