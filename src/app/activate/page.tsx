"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { activateAccount } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Terminal } from "lucide-react";
import useSound from "@/hooks/use-sound";
import { SOUNDS } from "@/lib/sounds";

/* 🔄 Submit Button with Loader */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="btn-hacker w-full group relative overflow-hidden"
    >
      {pending ? (
        <>
          <span className="absolute inset-0 animate-pulse bg-accent/10" />
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-accent"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 
              0 5.373 0 12h4zm2 5.291A7.962 
              7.962 0 014 12H0c0 3.042 
              1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          verifying...
        </>
      ) : (
        <>
          <KeyRound className="mr-2 h-4 w-4 animate-pulse" />
          access system
        </>
      )}
    </Button>
  );
}

export default function ActivatePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [state, formAction] = useActionState(activateAccount, {
    message: "",
    success: false,
    anonHash: null,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const playSuccessSound = useSound(SOUNDS.notification);

  /* 🎯 Handle Success / Error */
  useEffect(() => {
    if (state.success && state.anonHash) {
      Cookies.set("is_activated", "true", { expires: 365 });
      Cookies.set("anon_hash", state.anonHash, { expires: 365 });

      playSuccessSound();
      toast({ title: "Access Granted", description: state.message });

      const timer = setTimeout(() => {
        router.push("/");
      }, 1500);

      return () => clearTimeout(timer);
    } else if (!state.success && state.message) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: state.message,
      });
    }
  }, [state, toast, router, playSuccessSound]);

  return (
    <div className="container max-w-lg mx-auto py-20 px-4 relative z-10">
      <Card className="bg-background/80 backdrop-blur-md border border-cyan-400/40 shadow-[0_0_15px_rgba(0,255,255,0.3)] rounded-2xl overflow-hidden relative">
        {/* 💡 Decorative top neon bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

        <form action={formAction} ref={formRef} className="relative z-10">
          <CardHeader>
            <CardTitle
              className="glitch text-xl text-accent font-mono"
              data-text="system::activation"
            >
              system:activation
            </CardTitle>
            <CardDescription className="cursor-blink text-xs font-mono mt-1">
              &gt; enter secret access key: <span className="text-accent">'WELCOME'</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="relative">
              <Terminal className="absolute left-2 top-2.5 h-4 w-4 text-accent opacity-80" />
              <Input
                name="activationKey"
                placeholder="> ********"
                required
                className="bg-black/50 pl-8 text-accent font-mono border border-cyan-400/40 focus:ring-1 focus:ring-accent rounded-lg"
              />
            </div>
          </CardContent>

          <CardFooter className="flex-col items-stretch gap-4">
            <SubmitButton />
            <p className="text-[10px] font-mono text-muted-foreground text-center">
              _sys-> unauthorized access will be logged
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
