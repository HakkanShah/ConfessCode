'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import useSound from '@/hooks/use-sound';
import { SOUNDS } from '@/lib/sounds';
import { useEffect } from 'react';

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InfoDialog({ open, onOpenChange }: InfoDialogProps) {
  const playOpenSound = useSound(SOUNDS.dialogOpen, 0.2);

  useEffect(() => {
    if (open) {
      playOpenSound();
    }
  }, [open, playOpenSound]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[95vw] sm:w-full 
          max-w-md sm:max-w-lg md:max-w-xl
          max-h-[80vh]
          bg-black/90 border border-accent/40 
          shadow-[0_0_25px_#39ff14] 
          text-foreground scanlines font-mono
          overflow-hidden
          px-3 sm:px-6 py-4
        "
      >
        {/* 🖥 Header */}
        <DialogHeader>
          <DialogTitle className="glitch text-xl sm:text-2xl font-code text-accent text-center sm:text-left">
            &lt;ConfessCode Terminal/&gt;
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs sm:text-sm cursor-blink text-center sm:text-left">
            _loading instructions...
          </DialogDescription>
        </DialogHeader>

        {/* 📜 Scrollable Content */}
        <ScrollArea className="max-h-[55vh] sm:max-h-[60vh] mt-4 pr-2 sm:pr-4">
          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="text-keyword font-bold text-base sm:text-lg">What is this?</h3>
              <p className="text-default">
                ConfessCode is a <span className="text-string">safe space</span> for devs to anonymously
                share their coding sins, bugs, and late-night
                <span className="text-number"> coffee-driven commits</span>.
              </p>
            </section>

            <section>
              <h3 className="text-keyword font-bold text-base sm:text-lg">How it Works</h3>
              <pre className="bg-secondary/20 border border-secondary/40 rounded p-3 text-xs sm:text-sm text-default whitespace-pre-wrap">
{`1. Activate   -> use key 'WELCOME' to spawn anon_id;
2. Confess    -> submit story(); // sent for review
3. Engage     -> like(), comment(), share();`}
              </pre>
            </section>

            <section>
              <h3 className="text-keyword font-bold text-base sm:text-lg">Why Anonymous?</h3>
              <p>
                Your identity = <span className="text-string">anon_hash()</span>.  
                Stored only in <span className="text-tag">cookies</span>, never linked
                to <span className="text-number">IP / email / login</span>.  
                You stay safe & untraceable 🕶️.
              </p>
            </section>

            <section>
              <h3 className="text-keyword font-bold text-base sm:text-lg">Terms & Conditions</h3>
              <ul className="list-disc list-inside space-y-1 text-default">
                <li><span className="text-string">Respect()</span> → No hate / abuse / harassment.</li>
                <li><span className="text-string">NoPII()</span> → Don’t leak names, emails, numbers.</li>
                <li><span className="text-string">Moderation()</span> → All posts reviewed by admin.</li>
                <li><span className="text-string">Disclaimer()</span> → hobby project, use at own risk.</li>
              </ul>
            </section>
          </div>
        </ScrollArea>

        {/* 🚀 Footer */}
        <DialogFooter className="flex justify-center sm:justify-end pt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="btn-hacker w-full sm:w-auto"
          >
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
