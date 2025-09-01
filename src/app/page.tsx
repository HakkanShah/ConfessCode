
"use client";

import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InfoDialog from "@/components/info-dialog";
import ConfessionForm from "@/components/confession-form";
import { ConfessionCard } from "@/components/confession-card";
import type { Confession } from "@/lib/types";
import { getConfessions } from "@/lib/actions";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* 🌀 Main Home Page */
export default function Home() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [activated, setActivated] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  /* 🔄 Fetch Confessions + Activation */
  const fetchData = useCallback(async () => {
    try {
      const fetchedConfessions = await getConfessions();
      setConfessions(fetchedConfessions);

      const isActivated = Cookies.get("is_activated") === "true";
      setActivated(isActivated);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ⬆️ Handle Scroll to Top Button Visibility */
  useEffect(() => {
    const checkScroll = () => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Show info dialog on first visit
    if (!localStorage.getItem("hasVisitedConfessCode")) {
      setIsInfoOpen(true);
      localStorage.setItem("hasVisitedConfessCode", "true");
    }

    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  /* 🕹️ Loading State */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center font-mono px-4">
        <p
          className="glitch text-lg xs:text-xl text-accent animate-pulse"
          data-text="booting::confessCode"
        >
          booting::ConfessCode
        </p>
        <p className="cursor-blink mt-2 text-muted-foreground text-xs xs:text-sm">
          [sys] initializing...
        </p>
        <p className="mt-1 text-[10px] xs:text-xs text-muted-foreground opacity-70">
          please wait
        </p>
      </div>
    );
  }

  return (
    <>
      <InfoDialog open={isInfoOpen} onOpenChange={setIsInfoOpen} />

      <div className="container max-w-2xl mx-auto py-6 px-3 xs:px-4">
        <div className="flex flex-col gap-6">
          {/* 🚀 Activation / Form */}
          {activated ? (
            <div className="relative rounded-lg border border-accent/40 p-4 xs:p-5 
              shadow-[0_0_15px_rgba(0,255,180,0.15)] bg-black/30 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-lg border border-accent/20 pointer-events-none animate-pulse" />
              <ConfessionForm />
            </div>
          ) : (
            <div className="text-center bg-muted/10 border border-destructive/40 
              rounded-lg p-5 xs:p-6 shadow-[0_0_15px_rgba(255,0,70,0.2)] relative overflow-hidden">
              <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
              <h2
                className="glitch text-base xs:text-lg mb-1 text-destructive"
                data-text="system::locked"
              >
                system::locked
              </h2>
              <p className="text-muted-foreground mb-4 font-mono text-xs xs:text-sm">
                &gt; activate your account to start confessing
              </p>
              <Button asChild className="btn-hacker text-xs xs:text-sm">
                <Link href="/activate">&gt; start_confessing()</Link>
              </Button>
            </div>
          )}

          {/* ✨ Recent Confessions Heading */}
          <div className="text-center pt-4">
            <h2 className="text-lg font-code text-accent tracking-wider glitch" data-text="Recent Confessions">
              Recent Confessions
            </h2>
            <div className="w-20 h-px bg-accent/50 mx-auto mt-2"></div>
          </div>

          {/* 📜 Confessions Feed */}
          <section className="flex flex-col divide-y divide-border/40 rounded-md">
            {confessions.length > 0 ? (
              confessions.map((confession) => (
                <div key={confession.id} className="py-4">
                  <ConfessionCard confession={confession} />
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-12 font-mono text-xs">
                log::no_confessions_found()
              </div>
            )}
          </section>
        </div>
      </div>
      
      {/* ⬆️ Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-20 right-4 z-50 p-3 rounded-full bg-accent/80 text-black backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-accent hover:scale-110 active:scale-95 shadow-[0_0_15px_theme(colors.accent)]",
          showScroll ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}
