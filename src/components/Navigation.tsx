import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import {
  Home,
  LayoutDashboard,
  User,
  Moon,
  Sun,
  LogIn,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "@/lib/api";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="hover:opacity-80 transition-opacity">
            <img src={logo} alt="HKAI" className="h-[70px] w-auto" />
          </NavLink>

          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-secondary font-medium"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </NavLink>

            {user && (
              <NavLink
                to="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-secondary font-medium"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </NavLink>
            )}

            {user && (
              <NavLink
                to="/profile"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-secondary font-medium"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </NavLink>
            )}

            {user && (
              <div
                className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                onClick={async () => {
                  console.log("logging out");
                  const res = await axios.get(`${serverUrl}/logout`, {
                    withCredentials: true,
                  });
                  if (res.data.success) setUser(null);
                }}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </div>
            )}

            {!user && (
              <NavLink
                to="/login"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-secondary font-medium"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </NavLink>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hover:bg-secondary/10"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
