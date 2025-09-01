"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitConfession } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Terminal, Send } from "lucide-react";
import useSound from "@/hooks/use-sound";
import { SOUNDS } from "@/lib/sounds";

const MAX_LENGTH = 1000;

/* 📊 Character Counter Component */
function CharacterCounter({ count }: { count: number }) {
  const isOverLimit = count > MAX_LENGTH;
  return (
    <div
      className={`text-xs font-mono transition-colors ${
        isOverLimit ? "text-red-500" : "text-cyan-400"
      }`}
    >
      {count} / {MAX_LENGTH}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="rounded-2xl border border-cyan-500 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-500 
      px-5 py-2 text-white font-mono shadow-[0_0_12px_#00eaff] 
      hover:shadow-[0_0_20px_#00eaff] hover:scale-105 active:scale-95 
      transition-all duration-200 ease-in-out"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
          <span className="cursor-blink">Posting...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          <span className="cursor-blink">Confess()</span>
        </span>
      )}
    </Button>
  );
}

export default function ConfessionForm() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(submitConfession, {
    message: "",
    success: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [content, setContent] = useState("");
  const playSubmitSound = useSound(SOUNDS.submit);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        playSubmitSound();
        toast({
          title: "✅ Confession Submitted!",
          description: state.message,
        });
        formRef.current?.reset();
        setContent(""); // Reset character counter state
      } else {
        toast({
          variant: "destructive",
          title: "⚠️ Oops! Something went wrong",
          description: state.message,
        });
      }
    }
  }, [state, toast, playSubmitSound]);

  return (
    <div className="w-full px-3 sm:px-0">
      <form
        action={formAction}
        ref={formRef}
        className="flex flex-col gap-4 mx-auto max-w-lg font-mono"
      >
        {/* 🖥️ Header */}
        <div className="text-center mb-2">
          <h2 className="flex items-center justify-center gap-2 text-xl sm:text-2xl text-cyan-400 drop-shadow-[0_0_6px_#00eaff]">
            <Terminal className="h-5 w-5" />
            <span className="cursor-blink">Confess Here</span>
          </h2>
          <p className="text-xs text-cyan-500 sm:text-sm">
            Write anything anonymously and hit 'Confess'
          </p>
        </div>

        {/* 📝 Input */}
        <Textarea
          name="confession"
          placeholder="> Mera bestfriend Gay hai..."
          rows={5}
          required
          minLength={10}
          maxLength={MAX_LENGTH}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="rounded-2xl border border-cyan-500 bg-black/80 p-3 text-sm text-cyan-300 
          shadow-[0_0_10px_#00eaff] resize-none transition 
          focus:shadow-[0_0_18px_#00eaff] focus:ring-cyan-400 sm:text-base"
        />

        {/* 🚀 Footer */}
        <div className="flex items-center justify-between">
          <CharacterCounter count={content.length} />
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
