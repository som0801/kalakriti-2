
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Search, Upload, Users, User, Film, Image, Video } from "lucide-react";
import Logo from "@/components/ui/logo";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Home", path: "/home", icon: <Home className="w-5 h-5 mr-2" /> },
    { name: "Explore", path: "/explore", icon: <Search className="w-5 h-5 mr-2" /> },
    { name: "Video Enhancer", path: "/video-enhancer", icon: <Film className="w-5 h-5 mr-2" /> },
    { name: "Video Generator", path: "/video-generator", icon: <Video className="w-5 h-5 mr-2" /> },
    { name: "Ad Generator", path: "/ad-generator", icon: <Image className="w-5 h-5 mr-2" /> },
    { name: "Community", path: "/community", icon: <Users className="w-5 h-5 mr-2" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-5 h-5 mr-2" /> },
  ];

  return (
    <nav className="bg-white shadow-sm py-2 md:py-4 px-3 md:px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Logo size={isMobile ? "small" : "medium"} withText={!isMobile} />

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 lg:space-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-2 lg:px-3 py-2 rounded-full transition-colors ${
                isActive(item.path)
                  ? "bg-kala-light text-kala-primary font-medium"
                  : "text-gray-600 hover:text-kala-primary hover:bg-gray-50"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-[50px] inset-x-0 bg-white shadow-md z-50 animate-fade-in max-h-[calc(100vh-50px)] overflow-y-auto">
          <div className="container mx-auto py-2 px-4 flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-kala-light text-kala-primary font-medium"
                    : "text-gray-600 hover:text-kala-primary hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
