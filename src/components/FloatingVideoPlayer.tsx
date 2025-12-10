import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Maximize2,
  GripHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/authContext";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export default function FloatingVideoPlayer() {
  const { activeVideo, setActiveVideo } = useAuthContext();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [touchStart, setTouchStart] = useState(0);
  const [currentTime, setCurrentTime] = useState(activeVideo?.startTime || 0);
  const [showOverlay, setShowOverlay] = useState(false);

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerWrapperRef = useRef<HTMLDivElement>(null);

  // Track time and end of video
  const startTrackingTime = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!playerRef.current || !playerRef.current.getPlayerState) return;
      const state = playerRef.current.getPlayerState();
      if (state !== window.YT.PlayerState.PLAYING) return;

      const t = playerRef.current.getCurrentTime();
      const start = activeVideo?.startTime || 0;
      const end = activeVideo?.endTime;

      setCurrentTime(t);
      if (end) setShowOverlay(t >= end - 0.1);
    }, 200);
  }, [activeVideo]);

  // Load YouTube player
  const loadPlayer = useCallback(() => {
    if (!activeVideo?.id || !playerWrapperRef.current) return;

    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {}
      playerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    playerWrapperRef.current.innerHTML = "";
    const newDiv = document.createElement("div");
    newDiv.id = `yt-player-${activeVideo.id}`;
    // Essential: Ensure the placeholder also fills the parent
    newDiv.style.width = "100%";
    newDiv.style.height = "100%";
    playerWrapperRef.current.appendChild(newDiv);

    playerRef.current = new window.YT.Player(`yt-player-${activeVideo.id}`, {
      videoId: activeVideo.id,
      height: '100%', // FIX: Set height to 100%
      width: '100%',  // FIX: Set width to 100%
      playerVars: {
        controls: 0,
        modestbranding: 1,
        autoplay: 1,
        rel: 0,
        start: activeVideo.startTime,
        end: activeVideo.endTime || undefined,
        fs: 0, // Disable native fullscreen button to avoid conflicts
      },
      events: {
        onReady: (e: any) => {
          e.target.playVideo();
          setCurrentTime(activeVideo.startTime || 0);
          startTrackingTime();
        },
        onStateChange: (e: any) => {
          if (e.data === window.YT.PlayerState.PLAYING) startTrackingTime();
          else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        },
      },
    });
  }, [activeVideo, startTrackingTime]);

  // Initialize YouTube API
  useEffect(() => {
    if (!activeVideo) {
      if (playerRef.current)
        try {
          playerRef.current.destroy();
        } catch (e) {}
      playerRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setCurrentTime(activeVideo.startTime || 0);

    if (!window.YT && !document.getElementById("youtube-iframe-api-script")) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = "youtube-iframe-api-script";
      document.head.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => loadPlayer();
    } else if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      const existing = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (existing) existing();
        loadPlayer();
      };
    }

    return () => {
      if (playerRef.current)
        try {
          playerRef.current.destroy();
        } catch (e) {}
      playerRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeVideo, loadPlayer]);

  // REMOVED: ResizeObserver useEffect. 
  // We now rely on CSS (w-full h-full) which is much more performant and accurate.

  // Touch / drag logic
  const handleTouch = () => {
    const now = Date.now();
    if (now - touchStart < 300) setIsFullscreen(!isFullscreen);
    setTouchStart(now);
  };

  const startDrag = (e: any) => {
    if (isFullscreen) return;
    e.preventDefault();

    const startX = e.touches ? e.touches[0].clientX : e.clientX;
    const startY = e.touches ? e.touches[0].clientY : e.clientY;
    const initX = position.x;
    const initY = position.y;

    const move = (ev: any) => {
      const x = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const y = ev.touches ? ev.touches[0].clientY : ev.clientY;
      setPosition({ x: initX + (x - startX), y: initY + (y - startY) });
    };

    const end = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
  };

  const seekTo = (time: number) => {
    if (!playerRef.current || !playerRef.current.seekTo) return;
    const start = activeVideo?.startTime || 0;
    const end = activeVideo?.endTime;
    const target = Math.max(start, Math.min(time, end || time));
    playerRef.current.seekTo(target, true);
    setCurrentTime(target);
  };

  if (!activeVideo) return null;

  const videoStartTime = activeVideo.startTime || 0;
  const playerDuration = playerRef.current?.getDuration?.() || 0;
  const totalDuration =
    (activeVideo.endTime || playerDuration) - videoStartTime;
  const progress =
    totalDuration > 0
      ? ((currentTime - videoStartTime) / totalDuration) * 100
      : 0;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.25 }}
        onTouchStart={handleTouch}
        className={cn(
          "fixed z-50 transition-all duration-300 shadow-2xl rounded-xl overflow-hidden border border-border bg-card",
          isFullscreen
            ? "inset-0 w-full h-full rounded-none"
            : "w-[380px] aspect-video"
        )}
        style={{
          left: isFullscreen ? 0 : position.x,
          top: isFullscreen ? 0 : position.y,
        }}
      >
        {/* Header */}
        <div
          className="absolute top-0 left-0 w-full h-8 bg-black/50 backdrop-blur-sm flex items-center justify-between px-2 z-10"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <GripHorizontal className="w-4 h-4 text-white/70 cursor-move" />
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(!isFullscreen);
              }}
            >
              {isFullscreen ? (
                <Maximize2 className="h-3 w-3 rotate-180" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-red-500/80"
              onClick={(e) => {
                e.stopPropagation();
                setActiveVideo(null);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div
          className={cn(
            "absolute left-0 w-full px-3 z-20 flex flex-col gap-2",
            isFullscreen ? "bottom-12" : "bottom-2"
          )}
        >
          <div
            className="w-full h-2 bg-gray-600 rounded-full overflow-hidden cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = (clickX / rect.width) * 100;
              const newTime =
                videoStartTime + (totalDuration * percentage) / 100;
              seekTo(newTime);
            }}
          >
            <motion.div
              className="h-full bg-purple-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
          </div>

          <div className="flex justify-center gap-3 mt-1">
            <Button
              onClick={() => seekTo(currentTime - 5)}
              className="bg-black/60 text-white px-3"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => seekTo(currentTime + 5)}
              className="bg-black/60 text-white px-3"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Player Wrapper */}
        <div
          ref={playerWrapperRef}
          // FIX: Added specific styles to force the inner iframe to fill 100% of space
          className="w-full h-full bg-black relative [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:absolute [&>iframe]:inset-0"
        />

        {showOverlay && <div className="absolute inset-0 bg-black z-50" />}
      </motion.div>
    </AnimatePresence>
  );
}