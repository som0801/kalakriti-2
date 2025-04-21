
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Film, 
  MonitorPlay, 
  Image as ImageIcon, 
  Users, 
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/context/LanguageContext";

const Home = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { language, translatePage } = useLanguage();
  
  const defaultContent = {
    welcome: "Welcome to Kalakriti",
    greeting: "Hello, Artisan!",
    showcaseTitle: "Showcase Your Handicraft",
    showcaseDesc: "Use our AI tools to create stunning videos and marketing materials for your art",
    getStarted: "Get Started",
    watchTutorial: "Watch Tutorial",
    videoEnhancer: "Video Enhancer & Translator",
    videoEnhancerDesc: "Enhance and translate your videos with multilingual narration",
    adGenerator: "AI Ad Generator",
    adGeneratorDesc: "Create beautiful ad templates for your handicraft products",
    videoGenerator: "AI Video Generator",
    videoGeneratorDesc: "Generate videos from text prompts in multiple languages",
    communityFeed: "Community Feed",
    communityFeedDesc: "Connect with fellow artisans and explore their creations",
    recentActivity: "Recent Community Activity",
    hoursAgo: "hours ago",
    artisanShowcase: "Artisan Showcase #1",
    newTraditionalHandicraft: "New traditional handicraft video uploaded by Artisan #1"
  };
  
  const [content, setContent] = useState(defaultContent);
  
  useEffect(() => {
    const updateTranslations = async () => {
      if (language === 'english') {
        setContent(defaultContent);
      } else {
        const translatedContent = await translatePage(defaultContent);
        setContent(translatedContent);
      }
    };
    
    updateTranslations();
  }, [language, translatePage]);

  return (
    <div className="container mx-auto py-6 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{content.welcome}</h1>
        {user && profile && (
          <div className="flex items-center gap-2">
            <span className="text-kala-primary">👋 {content.greeting}</span>
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl p-6 md:p-8 text-white">
        <h2 className="text-xl md:text-2xl font-bold mb-2">{content.showcaseTitle}</h2>
        <p className="mb-6 opacity-90">{content.showcaseDesc}</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" asChild>
            <Link to="/video-enhancer">{content.getStarted}</Link>
          </Button>
          <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20">
            <Link to="/tutorial">{content.watchTutorial}</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="bg-purple-50 border-purple-100 hover:border-purple-200 transition-all">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="mb-4 text-purple-500">
                <Film className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">{content.videoEnhancer}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{content.videoEnhancerDesc}</p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/video-enhancer" className="flex justify-between items-center">
                  <span>{content.getStarted}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-100 hover:border-blue-200 transition-all">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="mb-4 text-blue-500">
                <ImageIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">{content.adGenerator}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{content.adGeneratorDesc}</p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/ad-generator" className="flex justify-between items-center">
                  <span>{content.getStarted}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-100 hover:border-green-200 transition-all">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="mb-4 text-green-500">
                <MonitorPlay className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">{content.videoGenerator}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{content.videoGeneratorDesc}</p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/video-generator" className="flex justify-between items-center">
                  <span>{content.getStarted}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-violet-50 border-violet-100 hover:border-violet-200 transition-all">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="mb-4 text-violet-500">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">{content.communityFeed}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{content.communityFeedDesc}</p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/community" className="flex justify-between items-center">
                  <span>{content.getStarted}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">{content.recentActivity}</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3 py-4 border-b border-gray-100">
              <Avatar>
                <AvatarFallback>A1</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{content.artisanShowcase}</h4>
                <p className="text-gray-600 text-sm">{content.newTraditionalHandicraft}</p>
                <p className="text-gray-400 text-xs mt-1">2 {content.hoursAgo}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
