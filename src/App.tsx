
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import VideoEnhancer from "./pages/VideoEnhancer";
import VideoGenerator from "./pages/VideoGenerator";
import AdGenerator from "./pages/AdGenerator";
import Community from "./pages/Community";
import CreatePost from "./pages/CreatePost";
import SharePost from "./pages/SharePost";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Tutorial from "./pages/Tutorial";
import Layout from "./components/layout/Layout";
import Translation from "./pages/Translation";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/video-enhancer" element={<VideoEnhancer />} />
            <Route path="/video-generator" element={<VideoGenerator />} />
            <Route path="/ad-generator" element={<AdGenerator />} />
            <Route path="/community" element={<Community />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/share-post" element={<SharePost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/translation" element={<Translation />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
}
