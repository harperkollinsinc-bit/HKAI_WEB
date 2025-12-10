import { NavLink } from "@/components/NavLink";
import { Mail, Github, Twitter, Linkedin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="HKAI" className="h-[70px] w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Personalized AI-powered learning experiences tailored to your pace
              and style.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <NavLink
                to="/"
                className="text-sm text-muted-foreground hover:text-secondary transition-colors"
              >
                Home
              </NavLink>
              <NavLink
                to="/dashboard"
                className="text-sm text-muted-foreground hover:text-secondary transition-colors"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                className="text-sm text-muted-foreground hover:text-secondary transition-colors"
              >
                Profile
              </NavLink>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-secondary transition-colors"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-secondary transition-colors"
              >
                Help Center
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-secondary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-secondary transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-secondary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-secondary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-secondary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-secondary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HKAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
