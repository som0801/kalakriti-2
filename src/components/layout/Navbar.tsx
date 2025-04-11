
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Search, Upload, Users, User, Film, Image } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
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
    { name: "Ad Generator", path: "/ad-generator", icon: <Image className="w-5 h-5 mr-2" /> },
    { name: "Community", path: "/community", icon: <Users className="w-5 h-5 mr-2" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-5 h-5 mr-2" /> },
  ];

  return (
    <nav className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="flex items-center">
          <div className="text-2xl font-bold text-kala-primary">
            <span className="text-kala-primary">Kala</span>
            <span className="text-kala-accent">kriti</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-full transition-colors ${
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
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-md z-50 animate-fade-in">
          <div className="container mx-auto py-3 px-6 flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
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
