import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VideoResource } from '@/lib/api';
import { Play } from 'lucide-react';

interface VideoSidebarProps {
  videos: VideoResource[];
  currentVideoId?: string;
  onVideoSelect: (video: VideoResource) => void;
}

const VideoSidebar = ({ videos, currentVideoId, onVideoSelect }: VideoSidebarProps) => {
  return (
    <div className="h-full border-r border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Video Resources</h2>
        <p className="text-sm text-muted-foreground">Click to play</p>
      </div>
      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="p-4 space-y-3">
          {videos.map((video) => (
            <Card
              key={video.id}
              onClick={() => onVideoSelect(video)}
              className={`p-3 cursor-pointer transition-all hover:border-secondary hover:shadow-md ${
                currentVideoId === video.id ? 'border-secondary bg-secondary/5' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  {currentVideoId === video.id ? (
                    <div className="text-2xl">{video.thumbnail}</div>
                  ) : (
                    <Play className="h-5 w-5 text-secondary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{video.duration}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VideoSidebar;
