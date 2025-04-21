
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Search, Video, Image, Users, Globe } from "lucide-react";
import Logo from "@/components/ui/logo";
import { useIsMobile } from "@/hooks/use-mobile";
import UserMenu from "@/components/auth/UserMenu";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: t('home'), path: "/home", icon: Home },
    { name: t('explore'), path: "/explore", icon: Search },
    { name: t('videoEnhancer'), path: "/video-enhancer", icon: Video },
    { name: t('adGenerator'), path: "/ad-generator", icon: Image },
    { name: t('community'), path: "/community", icon: Users },
  ];

  return (
    <nav className="bg-white shadow-sm py-2 md:py-4 px-3 md:px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Logo size={isMobile ? "medium" : "large"} withText={!isMobile} />

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 lg:space-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center gap-2 px-3 py-2 rounded-full transition-colors duration-300",
                isActive(item.path)
                  ? "bg-kala-light text-kala-primary font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-kala-primary"
              )}
            >
              <item.icon 
                className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isActive(item.path) ? "scale-110" : "group-hover:scale-110"
                )} 
              />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <UserMenu />
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
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-[50px] inset-x-0 bg-white shadow-md z-50 animate-fade-in max-h-[calc(100vh-50px)] overflow-y-auto">
          <div className="container mx-auto py-2 px-4 flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-300",
                  isActive(item.path)
                    ? "bg-kala-light text-kala-primary font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-kala-primary"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
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
