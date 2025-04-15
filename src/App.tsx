
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import VideoEnhancer from "./pages/VideoEnhancer"; // Keeping the file name the same
import Community from "./pages/Community";
import Explore from "./pages/Explore";
import AdGenerator from "./pages/AdGenerator";
import VideoGenerator from "./pages/VideoGenerator";
import CreatePost from "./pages/CreatePost";
import SharePost from "./pages/SharePost";
import Tutorial from "./pages/Tutorial";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/create" element={<VideoEnhancer />} />
      <Route path="/community" element={<Community />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/video-enhancer" element={<VideoEnhancer />} /> {/* Kept the same route */}
      <Route path="/ad-generator" element={<AdGenerator />} />
      <Route path="/video-generator" element={<VideoGenerator />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/share-post" element={<SharePost />} />
      <Route path="/tutorial" element={<Tutorial />} />
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Layout>
                <AppRoutes />
              </Layout>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
