
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/";
  const requiresAuth = !isAuthPage;

  useEffect(() => {
    // If user is authenticated and tries to access auth pages, redirect to home
    if (user && isAuthPage && location.pathname !== "/") {
      navigate("/home");
    }
    
    // If user is not authenticated and tries to access protected pages, redirect to login
    if (!loading && !user && requiresAuth) {
      navigate("/login");
    }
  }, [user, loading, isAuthPage, requiresAuth, location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
