// components/ui/video-dialog.tsx
"use client"

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoDialogProps {
  shouldShow: boolean;
}

export function VideoDialog({ shouldShow }: VideoDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play when dialog opens
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          How should I react? 🤔
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="border border-gray-700 bg-neutral-900/95 backdrop-blur-sm p-3 w-[400px] shadow-2xl" 
        style={{ maxWidth: '90vw' }}
      >
        <DialogTitle className="sr-only">Reaction Video</DialogTitle>
        <div className="rounded-xl overflow-hidden shadow-inner">
          <video
            ref={videoRef}
            className="w-full aspect-video"
            preload="auto"
            autoPlay
            loop
            playsInline // Better mobile support
          >
            <source src="/images/reaction.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}