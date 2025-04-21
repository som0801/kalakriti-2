
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    success: boolean;
  }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{
    error: any | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isEmailConfirmed: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle any auth links in the URL (email confirmations, password resets)
    const handleAuthRedirect = async () => {
      const url = new URL(window.location.href);
      if (url.hash && url.hash.includes('access_token')) {
        // Process the auth redirect
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error processing auth redirect:", error);
          toast.error("Authentication failed. Please try again.");
        } else if (data.session) {
          // Clear the URL hash
          window.history.replaceState({}, document.title, window.location.pathname);
          toast.success("Email confirmed successfully!");
          navigate("/home");
        }
        setLoading(false);
      }
    };

    handleAuthRedirect();

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check email confirmation status
        if (session?.user) {
          setIsEmailConfirmed(session.user.email_confirmed_at !== null);
        }
        
        setLoading(false);
        
        // Handle successful sign-in events
        if (event === 'SIGNED_IN') {
          toast.success("Signed in successfully!");
          navigate("/home");
        } else if (event === 'SIGNED_OUT') {
          toast.success("Signed out successfully!");
          navigate("/login");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Check email confirmation status
      if (session?.user) {
        setIsEmailConfirmed(session.user.email_confirmed_at !== null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes("Email not confirmed")) {
          setIsEmailConfirmed(false);
          toast.error("Please check your email and confirm your account before logging in.");
        } else {
          toast.error(error.message || "Failed to sign in");
        }
        return { error, success: false };
      }

      return { error: null, success: true };
    } catch (error) {
      toast.error("An unexpected error occurred during sign in");
      return { error, success: false };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        toast.error(error.message || "Failed to sign up");
        return { error, success: false };
      }

      // Check if email confirmation is required
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error("This email is already registered");
        return { error: new Error("Email already registered"), success: false };
      }

      if (data.user && !data.user.email_confirmed_at) {
        setIsEmailConfirmed(false);
        toast.success("Sign up successful! Please check your email to confirm your account.");
      } else {
        toast.success("Sign up successful!");
      }

      return { error: null, success: true };
    } catch (error) {
      toast.error("An unexpected error occurred during sign up");
      return { error, success: false };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      signIn, 
      signUp, 
      signOut, 
      loading,
      isEmailConfirmed
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
