
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const isAuthPage = 
    location.pathname === "/login" || 
    location.pathname === "/register" || 
    location.pathname === "/";

  // Check if URL has auth parameters (could be email confirmation or password reset)
  const hasAuthParams = 
    window.location.hash && 
    (window.location.hash.includes('access_token') || 
     window.location.hash.includes('error'));

  useEffect(() => {
    if (loading) return;

    // Handle auth redirect completion
    if (hasAuthParams) {
      console.log("Handling auth redirect");
      return; // Let the AuthProvider handle this
    }

    // Handle authenticated user navigation
    if (user) {
      if (isAuthPage && location.pathname !== "/") {
        navigate("/home");
      }
    } else {
      // Handle unauthenticated user navigation
      if (!isAuthPage) {
        navigate("/login", { state: { from: location.pathname } });
      }
    }
  }, [user, loading, isAuthPage, location.pathname, navigate, hasAuthParams]);

  // Show loading state while checking auth
  if (loading || hasAuthParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-kala-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
