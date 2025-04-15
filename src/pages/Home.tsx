
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Image, Video, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Home = () => {
  const isMobile = useIsMobile();
  
  const features = [
    {
      title: "AI Video Enhancer",
      description: "Improve your videos with AI and add multilingual narration",
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
  ];

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
      <div className="max-w-5xl mx-auto">
        <section className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-kala-dark">Welcome to Kalakriti</h1>
            <p className="text-kala-primary">👋 Hello, Artisan!</p>
          </div>
          
          <div className="bg-gradient-to-r from-kala-primary to-kala-accent rounded-xl md:rounded-2xl p-4 md:p-6 text-white mb-6 md:mb-8">
            <h2 className="text-lg md:text-2xl font-bold mb-2">Showcase Your Handicraft</h2>
            <p className="mb-4 text-sm md:text-base">Use our AI tools to create stunning videos and marketing materials for your art</p>
            <div className="flex space-x-3 md:space-x-4">
              <Link to="/create" className="bg-white text-kala-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:font-medium hover:bg-kala-light transition-colors">
                Get Started
              </Link>
              <Link to="/tutorial" className="bg-transparent border border-white text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:font-medium hover:bg-white/10 transition-colors">
                Watch Tutorial
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
          <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-kala-dark">Recent Community Activity</h2>
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4">
            <div className="space-y-3 md:space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-3 md:gap-4 pb-3 md:pb-4 border-b last:border-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-kala-light flex items-center justify-center">
                    <Users className="h-5 w-5 md:h-6 md:w-6 text-kala-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm md:text-base">Artisan Showcase #{item}</h3>
                    <p className="text-kala-neutral text-xs md:text-sm">New traditional handicraft video uploaded by Artisan #{item}</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 md:mt-4 text-center">
              <Link to="/community" className="text-kala-primary hover:underline text-sm">
                View All Activity
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
