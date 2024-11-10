// components/ui/video-dialog.tsx
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";

interface VideoDialogProps {
  shouldShow?: boolean;
}

export function VideoDialog({ shouldShow = true }: VideoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [videoFiles, setVideoFiles] = useState<string[]>([]);
  const [playedVideos, setPlayedVideos] = useState<string[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        const data = await response.json();
        if (data.videos) {
          setVideoFiles(data.videos);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const getRandomVideo = () => {
    const availableVideos = videoFiles.filter(video => !playedVideos.includes(video));
    
    if (availableVideos.length === 0) {
      setPlayedVideos([]);
      const randomVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)];
      return `/videos/${randomVideo}`;
    }

    const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
    setPlayedVideos(prev => [...prev, randomVideo]);
    return `/videos/${randomVideo}`;
  };

  const handleOpenDialog = () => {
    if (videoFiles.length > 0) {
      setCurrentVideo(getRandomVideo());
      setIsOpen(true);
    }
  };

  if (!shouldShow) return null;

  return (
    <>
      <Button 
        variant="outline" 
        onClick={handleOpenDialog}
        className="flex items-center gap-2"
      >
       How should I react?
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 bg-black w-[300px] sm:w-[400px] rounded-lg overflow-hidden flex items-center justify-center">
          <DialogTitle className="aspect-video"></DialogTitle>
          <video
            className="w-full h-full object-fill m-0 p-0 block"
            autoPlay
            loop
            playsInline
            src={currentVideo}
            style={{
                minWidth: '100%',
                minHeight: '100%',
              }}
            onError={(e) => console.error('Video playback error:', e)}
          >
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </>
  );
}