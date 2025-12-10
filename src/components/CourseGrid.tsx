import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { Course, Lesson } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/authContext";

// --- MARKDOWN IMPORTS ---
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

interface CourseGridProps {
  course: Course;
}

export default function CourseGrid({ course }: CourseGridProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { setActiveVideo } = useAuthContext();

  const completedCount = 0;
  const progress = course.lessons?.length
    ? (completedCount / course.lessons.length) * 100
    : 0;

  const openLesson = (lesson: Lesson) => setSelectedLesson(lesson);
  const closeLesson = () => setSelectedLesson(null);

  // --- CONTENT PRE-PROCESSOR ---
  const markdownContent = useMemo(() => {
    if (!selectedLesson?.content) return "";

    let content = selectedLesson.content;

    // 1. LEGACY CLEANUP: If data still wraps in JSON, strip it
    if (content.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.content) content = parsed.content;
      } catch (e) {
        const match = content.match(/"content":\s*"([\s\S]*)"\s*}/);
        if (match && match[1]) content = match[1];
      }
    }

    // 2. CRITICAL FIXES
    return (
      content
        // A. Unescape quotes
        .replace(/\\"/g, '"')
        // B. Fix Spacing: Convert literal \n to actual newlines first
        .replace(/\\n/g, "\n")
    );
  }, [selectedLesson]);

  return (
    <div className="p-4 md:p-8 space-y-8 h-full overflow-y-auto bg-background text-foreground">
      {/* --- Header --- */}
      <header className="space-y-6 border-b border-border pb-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {course.title}
          </h1>
          <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
              {course.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.estimated_time}
            </span>
          </div>
          <div className="flex-1 min-w-[200px] max-w-sm flex items-center gap-3 text-xs text-muted-foreground ml-auto">
            <span className="whitespace-nowrap font-medium">
              {Math.round(progress)}% Complete
            </span>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      {!selectedLesson ? (
        // STATE A: Grid View
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {course.lessons?.map((lesson, index) => {
            const durationMin = Math.round(
              (lesson.time_end - lesson.time_start) / 60
            );
            return (
              <Card
                key={lesson.id}
                onClick={() => openLesson(lesson)}
                className="group cursor-pointer transition-all duration-300 h-[220px] w-full flex flex-col justify-between 
                bg-card border-border hover:border-primary/50 hover:bg-accent/5 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <CardContent className="p-6 space-y-4 h-full flex flex-col relative">
                  <div className="absolute -right-4 -top-4 text-[100px] font-bold text-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                    {index + 1}
                  </div>
                  <div className="flex-1 z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-60 text-xs uppercase tracking-wider font-semibold text-primary">
                      Module {index + 1}
                    </div>
                    <h3 className="font-semibold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-3">
                      {lesson.title}
                    </h3>
                  </div>
                  <div className="pt-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground z-10">
                    <span className="flex items-center gap-1.5">
                      <Play className="h-3 w-3" /> {durationMin} min
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 text-primary font-medium flex items-center gap-1">
                      Start Lesson <ArrowLeft className="h-3 w-3 rotate-180" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      ) : (
        // STATE B: Single Lesson View
        <div className="pb-32 animate-in fade-in slide-in-from-right-8 duration-300 absolute top-0 left-0 w-full h-full bg-background z-20 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-md py-4 border-b border-border z-30">
              <Button
                variant="ghost"
                onClick={closeLesson}
                className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-lg font-medium">Back to Course</span>
              </Button>
            </div>

            {/* Title Block */}
            <div className="space-y-6">
              {/* <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {selectedLesson.title}
              </h1> */}
              {selectedLesson.video_id && (
                <div
                  className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 text-primary cursor-pointer hover:bg-primary/10 transition-colors group"
                  onClick={() => {
                    setActiveVideo({
                      startTime: selectedLesson.time_start,
                      endTime: selectedLesson.time_end,
                      id: selectedLesson.video_id || "",
                    });
                  }}
                >
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="h-5 w-5 ml-0.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Watch Video Segment</p>
                  </div>
                </div>
              )}
            </div>

            {/* --- CUSTOM MARKDOWN RENDERER --- */}
            <article className="prose dark:prose-invert prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // 1. HEADER SHIFTING
                  h1: ({ className, ...props }) => (
                    <h2
                      className="text-3xl font-bold mt-12 mb-6 text-foreground border-b pb-4"
                      {...props}
                    />
                  ),
                  h2: ({ className, ...props }) => (
                    <h3
                      className="text-2xl font-semibold mt-10 mb-4 text-foreground/90"
                      {...props}
                    />
                  ),
                  h3: ({ className, ...props }) => (
                    <h4
                      className="text-xl font-medium mt-8 mb-3 text-primary"
                      {...props}
                    />
                  ),

                  // 2. PARAGRAPH SPACING
                  p: ({ className, ...props }) => (
                    <p
                      className="mb-6 leading-loose text-foreground/90"
                      {...props}
                    />
                  ),

                  // 3. PRE TAG (Code block wrapper - triple backticks)
                  pre({ children, ...props }) {
                    // Extract the code element from children
                    const codeElement = children as any;
                    const className = codeElement?.props?.className || "";
                    const match = /language-(\w+)/.exec(className);
                    const lang = match ? match[1].toUpperCase() : "CODE";

                    return (
                      <div className="relative my-8 rounded-lg overflow-hidden border border-border bg-card shadow-lg not-prose">
                        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border text-xs text-muted-foreground font-mono select-none">
                          <span>Snippet</span>
                          <span className="font-semibold text-primary">
                            {lang}
                          </span>
                        </div>
                        <pre className="p-5 overflow-x-auto text-sm font-mono bg-[#0d1117] text-white m-0">
                          {children}
                        </pre>
                      </div>
                    );
                  },

                  // 4. CODE (Inline code - single backtick)
                  code({ node, inline, className, children, ...props }) {
                    // If it's inline code (single backtick), render as inline
                    if (inline) {
                      return (
                        <code
                          className="bg-primary/10 px-1.5 py-0.5 rounded text-sm font-mono text-primary border border-primary/20"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }

                    // Otherwise, it's part of a code block (handled by pre component)
                    // Just return the code element without extra styling
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },

                  // 5. IMAGES
                  img({ src, alt }) {
                    return src === "PLACEHOLDER" || !src ? (
                      <div className="my-10 rounded-xl bg-muted/20 border border-dashed border-border p-10 flex flex-col items-center justify-center text-center gap-4 not-prose">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <p className="font-medium text-lg text-foreground">
                          {alt || "Visual Concept"}
                        </p>
                      </div>
                    ) : (
                      <img
                        src={src}
                        alt={alt}
                        className="rounded-lg border border-border shadow-md my-8 w-full object-cover"
                      />
                    );
                  },

                  // 6. LISTS
                  ol({ children, ...props }) {
                    return (
                      <ol
                        className="list-decimal list-inside my-8 space-y-3 marker:text-primary marker:font-semibold"
                        {...props}
                      >
                        {children}
                      </ol>
                    );
                  },
                  ul({ children, ...props }) {
                    return (
                      <ul
                        className="list-disc list-inside my-8 space-y-3 marker:text-primary"
                        {...props}
                      >
                        {children}
                      </ul>
                    );
                  },
                  li({ children, ...props }) {
                    return (
                      <li
                        className="pl-2 leading-relaxed text-foreground/90"
                        {...props}
                      >
                        {children}
                      </li>
                    );
                  },

                  // 7. BLOCKQUOTES
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground my-8 py-2 bg-muted/10 rounded-r-lg">
                        {children}
                      </blockquote>
                    );
                  },

                  // 8. LINKS
                  a({ href, children }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors font-medium"
                      >
                        {children}
                      </a>
                    );
                  },

                  // 9. TABLES
                  table({ children }) {
                    return (
                      <div className="my-8 overflow-x-auto rounded-lg border border-border shadow-md not-prose">
                        <table className="w-full border-collapse bg-card">
                          {children}
                        </table>
                      </div>
                    );
                  },
                  thead({ children }) {
                    return (
                      <thead className="bg-muted/50 border-b-2 border-border">
                        {children}
                      </thead>
                    );
                  },
                  tbody({ children }) {
                    return (
                      <tbody className="divide-y divide-border">
                        {children}
                      </tbody>
                    );
                  },
                  tr({ children }) {
                    return (
                      <tr className="transition-colors hover:bg-muted/30">
                        {children}
                      </tr>
                    );
                  },
                  th({ children }) {
                    return (
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                        {children}
                      </th>
                    );
                  },
                  td({ children }) {
                    return (
                      <td className="px-6 py-4 text-sm text-foreground/90">
                        {children}
                      </td>
                    );
                  },
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </article>

            {/* Footer */}
            <div className="pt-10 border-t border-border flex justify-end">
              <Button
                size="lg"
                className="gap-2"
                onClick={() =>
                  toast({ title: "Action", description: "Not implemented yet" })
                }
              >
                Take test <CheckCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
