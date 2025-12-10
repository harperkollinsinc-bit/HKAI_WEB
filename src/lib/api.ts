// Central API file for all backend interactions

// --- ENUMS ---
export type ChatRole = "user" | "assistant" | "system";
export type UserRole = "user" | "admin" | "tester";
export type AccountStatus = "pending" | "active" | "suspended" | "deleted";

// --- LEAF NODES (Bottom of the tree) ---
export interface CourseQuiz {
  id: string;
  lesson_id: string;
  question: string;
  type: string; // 'multiple_choice'
  options: string[];
  answer: string;
  created_at: string;
}

// --- CONTENT NODES ---
export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  time_start: number;
  time_end: number;
  objectives: string[];
  content?: string;
  quizzes: CourseQuiz[];
  video_id?: string;
  video_provider_id?: string;
  created_at: string;
  updated_at: string;
}

// --- THE COURSE (The Product) ---
export interface Course {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_time: string;
  content?: string;
  video_url?: string;
  video_provider_id?: string;
  lessons: Lesson[];
  created_at: string;
  updated_at: string;
}

// --- THE WORKSPACE (The Root) ---
export interface Workspace {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

// --- CHAT MESSAGES (Usually fetched separately or alongside) ---
export interface Message {
  id: string;
  workspace_id: string;
  role: ChatRole;
  content: string;
  created_at: string;
}

export interface formR {
  name: formObj;
  email: formObj;
  password: formObj;
  dob: formObj;
}

export interface formObj {
  title: string;
  type: string;
  value: string;
  placeholder: string;
}

export interface USER {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  dob: string;
  role: string;
  acc_status: string;
}

// Mock data
const mockWorkspaces: Workspace[] = [
  {
    id: "1",
    user_id: "1",
    course_id: null,
    title: "Introduction to AI",
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    user_id: "1",
    course_id: null,
    title: "Web Development",
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    user_id: "1",
    course_id: null,
    title: "Data Science Fundamentals",
    created_at: "2023-01-01T00:00:00.000Z",
    updated_at: "2023-01-01T00:00:00.000Z",
  },
];

// API Functions
export const api = {
  // Fetch all workspaces
  async getWorkspaces(): Promise<Workspace[]> {
    await delay(500);
    return mockWorkspaces;
  },

  // Fetch a specific workspace
  async getWorkspace(id: string): Promise<Workspace | undefined> {
    await delay(300);
    return mockWorkspaces.find((w) => w.id === id);
  },

  async sendMessage(workspaceId: string, content: string): Promise<Message> {
    await delay(300);
    return {
      id: "1",
      workspace_id: workspaceId,
      role: "assistant",
      content,
      created_at: new Date().toISOString(),
    };
  }
};

// Helper function to simulate API delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// export const serverUrl: string = "http://localhost:3000";
// export const serverUrl: string = "http://192.168.23.176:3000";
export const serverUrl: string = "https://hkai-server.onrender.com";

