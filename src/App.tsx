import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import ScrollTracker from "./components/ScrollTracker";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import { AuthProvider } from "./context/authContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollTracker />
          <Navigation />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/workspace/:workspaceId" element={<Workspace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Signin />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
