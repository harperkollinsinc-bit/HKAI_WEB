import { useState, useRef, useEffect } from "react";
import { Loader2, Send, Sparkles, Image as ImageIcon } from "lucide-react";
import { Message, serverUrl } from "@/lib/api";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface ChatInterfaceProps {
  workspaceId: string;
  generateCourse?: () => void;
}

// --- TEXT PROCESSOR ---
const preprocessContent = (content: string) => {
  if (!content) return "";
  return (
    content
      // H2: ## text
      .replace(
        /(^|\n)##\s+(.*?)(?=\n|$)/g,
        '$1<h2 class="text-2xl font-bold mt-6 mb-3 text-primary">$2</h2>'
      )
      // H3: ### text
      .replace(
        /(^|\n)###\s+(.*?)(?=\n|$)/g,
        '$1<h3 class="text-xl font-semibold mt-4 mb-2 text-foreground">$2</h3>'
      )
      // Bold: **text**
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Unordered Lists: * text (Matches * followed by space)
      .replace(
        /(^|\n)\*\s+(.*?)(?=\n|$)/g,
        '$1<div class="flex items-start ml-4 mb-1"><span class="mr-2 mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span><span class="leading-relaxed">$2</span></div>'
      )
      // Italics: *text* (Matches * followed by non-space, to distinguish from lists)
      // We check for (^|[^*]) to ensure we don't match the middle of **bold** if it wasn't caught yet, though bold is processed first.
      .replace(
        /(^|[^\*])\*([^\s\*][^\*]*?)\*/g,
        '$1<em class="italic text-muted-foreground">$2</em>'
      )
      // Line Breaks
      .replace(/\n/g, "<br>")
  );
};

export default function ChatInterface({
  workspaceId,
  generateCourse,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [genCourse, setGenCourse] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (genCourse) generateCourse();
  }, [genCourse]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/workspaces/${workspaceId}/messages`,
          {
            withCredentials: true,
          }
        );
        const history = Array.isArray(res.data) ? res.data : res.data.data;
        setMessages([...(history || [])]);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    if (workspaceId) loadMessages();
  }, [workspaceId]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      Math.min(textareaRef.current.scrollHeight, 200) + "px";
  }, [input]);

  const sendMessage = async () => {
    console.log("Sending message...");
    if (!input.trim() || isLoading) return;

    const text = input.trim();
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg: Message = {
      id: (messages.length + 1).toString(),
      workspace_id: workspaceId,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const reply = await axios.post(
        `${serverUrl}/workspaces/${workspaceId}/messages`,
        { content: text },
        { withCredentials: true }
      );

      const { trigger_generation, message: aiMessage } =
        reply.data.data || reply.data;
      setMessages((prev) => [...prev, aiMessage]);
      setGenCourse(trigger_generation);
    } catch (error) {
      console.error("Send error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-background">
      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-8 pb-32">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={cn(
                  "flex w-full animate-in slide-in-from-bottom-2 duration-300",
                  isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "relative px-4 py-3 text-base leading-relaxed shadow-sm",
                    isUser
                      ? // User: Constrained width (chat bubble style)
                        "max-w-[90%] sm:max-w-[85%] bg-secondary text-secondary-foreground rounded-2xl rounded-tr-sm"
                      : // AI: Full width allowed
                        "w-full max-w-full bg-transparent text-foreground border-none px-0 py-0 pl-1 shadow-none"
                  )}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="prose dark:prose-invert max-w-none w-full">
                      {/** Split content by code blocks or image placeholders manually **/}
                      {message.content
                        .split(/(```[\s\S]*?```|!\[PLACEHOLDER\]\([^\)]*\))/g)
                        .map((chunk, idx) => {
                          if (chunk.startsWith("```")) {
                            // code block
                            const langMatch = /```(\w+)/.exec(chunk);
                            const lang = langMatch
                              ? langMatch[1].toUpperCase()
                              : "CODE";
                            const code = chunk
                              .replace(/```(\w+)?/, "")
                              .replace(/```/, "");
                            return (
                              <div
                                key={idx}
                                className="relative my-6 rounded-lg overflow-hidden border border-border bg-[#0d1117] shadow-sm w-full"
                              >
                                <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border text-xs text-muted-foreground font-mono select-none">
                                  <span></span>
                                  <span className="font-semibold text-primary/80">
                                    {lang}
                                  </span>
                                </div>
                                <pre className="p-4 overflow-x-auto text-sm font-mono bg-[#0d1117] text-gray-300 m-0 w-full">
                                  <code>{code}</code>
                                </pre>
                              </div>
                            );
                          } else if (chunk.startsWith("![PLACEHOLDER]")) {
                            // image placeholder
                            const altMatch = /!\[PLACEHOLDER\]\(([^)]+)\)/.exec(
                              chunk
                            );
                            const alt = altMatch
                              ? altMatch[1]
                              : "Visual Concept";
                            return (
                              <div
                                key={idx}
                                className="my-8 rounded-xl bg-muted/20 border border-dashed border-border p-8 flex flex-col items-center justify-center text-center gap-3 transition-colors hover:bg-muted/30 w-full"
                              >
                                <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
                                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                  <p className="font-medium text-sm text-foreground">
                                    {alt}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    AI suggested an image here.
                                  </p>
                                </div>
                              </div>
                            );
                          } else {
                            // Normal text
                            return (
                              <div
                                key={idx}
                                dangerouslySetInnerHTML={{
                                  __html: preprocessContent(chunk),
                                }}
                                className="mb-4 last:mb-0 w-full"
                              />
                            );
                          }
                        })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex w-full justify-start animate-in fade-in duration-300 pl-1">
              <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground font-medium">
                  Thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-card border border-border rounded-3xl shadow-lg p-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message AI..."
              className="flex-1 max-h-[200px] min-h-[44px] w-full resize-none bg-transparent border-0 px-4 py-3 text-sm focus:outline-none placeholder:text-muted-foreground scrollbar-hide"
              style={{ overflow: "hidden" }}
            />
            <Button
              variant="default"
              size="icon"
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 shrink-0 rounded-full mb-0.5 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
