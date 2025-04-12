
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading, isEmailConfirmed } = useAuth();
  const location = useLocation();

  // Check if URL has auth parameters (could be email confirmation or password reset)
  const hasAuthParams = 
    window.location.hash && 
    (window.location.hash.includes('access_token') || 
     window.location.hash.includes('error'));

  // Display loading state while authentication is being checked
  if (loading || hasAuthParams) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-kala-primary" />
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // For protected routes, check if email is confirmed
  if (!isEmailConfirmed) {
    return <Navigate to="/login" state={{ emailNotConfirmed: true }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default PrivateRoute;
