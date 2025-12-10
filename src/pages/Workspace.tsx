import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRightLeft,
  Loader2,
  MessageSquare,
  LayoutGrid,
} from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import FloatingVideoPlayer from "@/components/FloatingVideoPlayer";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/authContext";
import { api, Course, Workspace as IWorkspace } from "@/lib/api";
import axios from "axios";
import { serverUrl } from "@/lib/api";
import CourseGrid from "@/components/CourseGrid";

type ViewMode = "chat" | "course";

const Workspace = () => {
  const { workspaces, user } = useAuthContext();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState("");

  // VIEW STATE: Default to chat
  const [activeView, setActiveView] = useState<ViewMode>("chat");

  const [isPageLoading, setIsPageLoading] = useState(false);

  const initWorkspace = useCallback(async () => {
    setIsPageLoading(true);
    try {
      // 1. Try Global Context
      let currentWorkspace = workspaces?.find((w) => w.id === workspaceId);

      // 2. Fallback API Fetch
      if (!currentWorkspace) {
        const res = await axios.get(`${serverUrl}/workspace/${workspaceId}`, {
          withCredentials: true,
        });
        if (res.data.success) currentWorkspace = res.data.data;
      }

      if (!currentWorkspace) throw new Error("Workspace not found");
      setWorkspace(currentWorkspace);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load workspace",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setIsPageLoading(false);
    }
  }, [workspaceId, workspaces, navigate, toast]);

  const fetchCourse = useCallback(async () => {
    if (!workspaceId) return;

    try {
      const { data } = await axios.get(
        `${serverUrl}/workspace/${workspaceId}/course`,
        { withCredentials: true }
      );

      if (data.success) {
        // Check if course is being generated
        if (data.data.generating) {
          const jobStatus = data.data.jobStatus;
          setIsGeneratingCourse(true);
          setGenerationProgress(jobStatus.progress || 0);
          setGenerationStep(jobStatus.currentStep || "Starting...");

          // Continue polling if still generating
          if (
            jobStatus.status === "queued" ||
            jobStatus.status === "processing"
          ) {
            setTimeout(fetchCourse, 2000); // Poll every 2 seconds
          }
        } else if (data.data.error) {
          // Generation failed
          setIsGeneratingCourse(false);
          toast({
            title: "Course Generation Failed",
            description: data.data.error,
            variant: "destructive",
          });
        } else {
          // Course exists and is ready
          setCourse(data.data);
          setIsGeneratingCourse(false);
          setGenerationProgress(0);
          setGenerationStep("");
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  }, [workspaceId, toast]);

  const generateCourse = useCallback(async () => {
    if (course || !workspaceId || isGeneratingCourse) return;

    setIsGeneratingCourse(true);
    setGenerationProgress(0);
    setGenerationStep("Initializing...");

    toast({
      title: "Course Generation",
      description: "Starting course generation...",
    });

    try {
      const { data } = await axios.post(
        `${serverUrl}/workspace/${workspaceId}/course`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        // Start polling for progress
        setTimeout(fetchCourse, 1000);
      }

      console.log("Course generation started:", data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to start course generation",
        variant: "destructive",
      });
      setIsGeneratingCourse(false);
      setGenerationProgress(0);
      setGenerationStep("");
    }
  }, [workspaceId, course, isGeneratingCourse, fetchCourse, toast]);

  // Initialize Data
  useEffect(() => {
    if (!workspaceId) return;

    initWorkspace();
    fetchCourse();
  }, [workspaceId, initWorkspace, fetchCourse]);

  if (isPageLoading || !workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* --- HEADER --- */}
      <div className="border-b border-border bg-card px-4 py-3 flex flex-col gap-2 shadow-sm shrink-0 z-20">
        <div className="flex items-center justify-between">
          {/* Left: Title & Back */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="hover:bg-secondary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex flex-col">
              <h1 className="font-semibold text-lg leading-none">
                {workspace.title}
              </h1>
              {course && (
                <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  {course.title}
                </span>
              )}
            </div>
          </div>

          {/* Right: View Toggle (Only visible if a course exists) */}
          {course && (
            <Button
              variant={activeView === "chat" ? "default" : "secondary"}
              size="sm"
              onClick={() =>
                setActiveView(activeView === "chat" ? "course" : "chat")
              }
              className="gap-2 transition-all"
            >
              <ArrowRightLeft className="h-4 w-4" />
              <span className="hidden sm:inline">
                Switch to {activeView === "chat" ? "Course" : "Chat"}
              </span>
              {activeView === "chat" ? (
                <LayoutGrid className="h-4 w-4 ml-1" />
              ) : (
                <MessageSquare className="h-4 w-4 ml-1" />
              )}
            </Button>
          )}
        </div>

        {/* Progress Bar (Only visible when generating) */}
        {isGeneratingCourse && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {generationStep || "Generating course..."}
              </span>
              <span className="font-medium">{generationProgress}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
          </div>
        )}
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 overflow-hidden relative bg-background/50">
        {/* VIEW 1: CHAT (Full Screen) */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            activeView === "chat"
              ? "opacity-100 z-10 pointer-events-auto"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <ChatInterface
            workspaceId={workspace.id}
            generateCourse={generateCourse}
          />
        </div>

        {/* VIEW 2: COURSE GRID (Full Screen) */}
        {course && (
          <div
            className={`absolute inset-0 transition-opacity duration-300 ease-in-out bg-background ${
              activeView === "course"
                ? "opacity-100 z-10 pointer-events-auto"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <div className="h-full w-full max-w-7xl mx-auto p-4 md:p-8 overflow-y-auto ">
              <CourseGrid course={course} />
            </div>
          </div>
        )}
      </div>

      {/* --- FLOATING PLAYER (Persistent) --- */}
      <FloatingVideoPlayer />
    </div>
  );
};

export default Workspace;
