
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Image, Video, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/context/LanguageContext";

const Home = () => {
  const isMobile = useIsMobile();
  const { language, translateText } = useLanguage();
  
  const [translations, setTranslations] = useState({
    welcome: "Welcome to Kalakriti",
    hello: "👋 Hello, Artisan!",
    showcase: "Showcase Your Handicraft",
    useAITools: "Use our AI tools to create stunning videos and marketing materials for your art",
    getStarted: "Get Started",
    watchTutorial: "Watch Tutorial",
    recentActivity: "Recent Community Activity",
    viewAllActivity: "View All Activity",
    artisanShowcase: "Artisan Showcase",
    newUpload: "New traditional handicraft video uploaded by Artisan",
    hoursAgo: "hours ago"
  });

  // Features data with translations
  const [features, setFeatures] = useState([
    {
      title: "Video Enhancer & Translator",
      description: "Enhance and translate your videos with multilingual narration",
      icon: <Film className="h-8 w-8 md:h-10 md:w-10 text-kala-primary" />,
      link: "/video-enhancer",
      color: "bg-purple-50",
    },
    {
      title: "AI Ad Generator",
      description: "Create beautiful ad templates for your handicraft products",
      icon: <Image className="h-8 w-8 md:h-10 md:w-10 text-kala-primary" />,
      link: "/ad-generator",
      color: "bg-blue-50",
    },
    {
      title: "AI Video Generator",
      description: "Generate videos from text prompts in multiple languages",
      icon: <Video className="h-8 w-8 md:h-10 md:w-10 text-kala-primary" />,
      link: "/video-generator",
      color: "bg-green-50",
    },
    {
      title: "Community Feed",
      description: "Connect with fellow artisans and explore their creations",
      icon: <Users className="h-8 w-8 md:h-10 md:w-10 text-kala-primary" />,
      link: "/community",
      color: "bg-orange-50",
    },
  ]);

  // Translate UI when language changes
  useEffect(() => {
    const translateUI = async () => {
      if (language === 'english') {
        setTranslations({
          welcome: "Welcome to Kalakriti",
          hello: "👋 Hello, Artisan!",
          showcase: "Showcase Your Handicraft",
          useAITools: "Use our AI tools to create stunning videos and marketing materials for your art",
          getStarted: "Get Started",
          watchTutorial: "Watch Tutorial",
          recentActivity: "Recent Community Activity",
          viewAllActivity: "View All Activity",
          artisanShowcase: "Artisan Showcase",
          newUpload: "New traditional handicraft video uploaded by Artisan",
          hoursAgo: "hours ago"
        });
      } else {
        const translatedTexts = await Promise.all([
          translateText("Welcome to Kalakriti"),
          translateText("👋 Hello, Artisan!"),
          translateText("Showcase Your Handicraft"),
          translateText("Use our AI tools to create stunning videos and marketing materials for your art"),
          translateText("Get Started"),
          translateText("Watch Tutorial"),
          translateText("Recent Community Activity"),
          translateText("View All Activity"),
          translateText("Artisan Showcase"),
          translateText("New traditional handicraft video uploaded by Artisan"),
          translateText("hours ago")
        ]);
        
        setTranslations({
          welcome: translatedTexts[0],
          hello: translatedTexts[1],
          showcase: translatedTexts[2],
          useAITools: translatedTexts[3],
          getStarted: translatedTexts[4],
          watchTutorial: translatedTexts[5],
          recentActivity: translatedTexts[6],
          viewAllActivity: translatedTexts[7],
          artisanShowcase: translatedTexts[8],
          newUpload: translatedTexts[9],
          hoursAgo: translatedTexts[10]
        });
      }

      // Translate features
      if (language !== 'english') {
        const translatedFeatures = await Promise.all(
          features.map(async (feature) => ({
            ...feature,
            title: await translateText(feature.title),
            description: await translateText(feature.description)
          }))
        );
        setFeatures(translatedFeatures);
      } else {
        setFeatures([
          {
            title: "Video Enhancer & Translator",
            description: "Enhance and translate your videos with multilingual narration",
            icon: <Film className="h-8 w-8 md:h-10 md:w-10 text-kala-primary" />,
            link: "/video-enhancer",
            color: "bg-purple-50",
          },
          {
            title: "AI Ad Generator",
            description: "Create beautiful ad templates for your handicraft products",
            icon: <Image className="h-8 w-8 md:h-10 md:w-10 text-kala-primary" />,
            link: "/ad-generator",
            color: "bg-blue-50",
          },
          {
            title: "AI Video Generator",
            description: "Generate videos from text prompts in multiple languages",
            icon: <Video className="h-8 w-8 md:h-10 md:w-10 text-kala-primary" />,
            link: "/video-generator",
            color: "bg-green-50",
          },
          {
            title: "Community Feed",
            description: "Connect with fellow artisans and explore their creations",
            icon: <Users className="h-8 w-8 md:h-10 md:w-10 text-kala-primary" />,
            link: "/community",
            color: "bg-orange-50",
          },
        ]);
      }
    };

    translateUI();
  }, [language, translateText]);

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
      <div className="max-w-5xl mx-auto">
        <section className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-kala-dark">{translations.welcome}</h1>
            <p className="text-kala-primary">{translations.hello}</p>
          </div>
          
          <div className="bg-gradient-to-r from-kala-primary to-kala-accent rounded-xl md:rounded-2xl p-4 md:p-6 text-white mb-6 md:mb-8">
            <h2 className="text-lg md:text-2xl font-bold mb-2">{translations.showcase}</h2>
            <p className="mb-4 text-sm md:text-base">{translations.useAITools}</p>
            <div className="flex space-x-3 md:space-x-4">
              <Link to="/create" className="bg-white text-kala-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:font-medium hover:bg-kala-light transition-colors">
                {translations.getStarted}
              </Link>
              <Link to="/tutorial" className="bg-transparent border border-white text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:font-medium hover:bg-white/10 transition-colors">
                {translations.watchTutorial}
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
            {features.map((feature, index) => (
              <Link to={feature.link} key={index}>
                <Card className={`card-hover h-full ${feature.color} border-none`}>
                  <CardHeader className="pb-2 md:pb-3 pt-3 md:pt-4 px-3 md:px-4">
                    <CardTitle className="flex items-center gap-2 md:gap-3 text-base md:text-lg">
                      {feature.icon}
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3 md:pb-4 px-3 md:px-4">
                    <CardDescription className="text-kala-dark text-sm md:text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        
        <section className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-kala-dark">{translations.recentActivity}</h2>
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4">
            <div className="space-y-3 md:space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-3 md:gap-4 pb-3 md:pb-4 border-b last:border-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-kala-light flex items-center justify-center">
                    <Users className="h-5 w-5 md:h-6 md:w-6 text-kala-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base">{translations.artisanShowcase} #{item}</h3>
                    <p className="text-kala-neutral text-xs md:text-sm">{translations.newUpload} #{item}</p>
                    <p className="text-xs text-gray-500 mt-1">2 {translations.hoursAgo}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 md:mt-4 text-center">
              <Link to="/community" className="text-kala-primary hover:underline text-sm">
                {translations.viewAllActivity}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
