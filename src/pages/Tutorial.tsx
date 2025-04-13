
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, PlayCircle, Book, CheckCircle, Calendar, Map, User, ShoppingBag, Camera, Palette } from "lucide-react";
import BackButton from "@/components/ui/back-button";

const Tutorial = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex items-center mb-6">
        <BackButton />
        <div className="ml-2">
          <h1 className="text-2xl font-bold text-kala-primary">Artisan Tutorials</h1>
          <p className="text-gray-600">Learn and master traditional craft techniques</p>
        </div>
      </div>

      <Tabs defaultValue="featured" className="mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookmarked" className="mt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Book className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No bookmarked tutorials yet</h3>
            <p className="text-gray-500 mb-4 text-center max-w-md">
              Save your favorite tutorials to easily access them later
            </p>
            <Button variant="outline">Browse Tutorials</Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="bg-kala-light/40 p-3 rounded-full mb-3">
                  <category.icon className="h-6 w-6 text-kala-primary" />
                </div>
                <h3 className="font-medium text-center">{category.name}</h3>
                <p className="text-sm text-gray-500 text-center">{category.count} tutorials</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Learning Path</CardTitle>
          <CardDescription>Start your journey in artisan crafts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningPath.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 border-l-2 border-kala-light pl-4 relative"
              >
                <div
                  className={`absolute w-4 h-4 rounded-full left-[-9px] top-1 ${
                    index === 0
                      ? "bg-kala-primary"
                      : "bg-gray-200 border-2 border-kala-light"
                  }`}
                ></div>
                <div className="flex-1">
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className={`${
                        index === 0
                          ? "bg-kala-light/50 text-kala-primary"
                          : "bg-gray-100"
                      }`}
                    >
                      {step.duration}
                    </Badge>
                    {index === 0 && (
                      <Button size="sm" className="bg-kala-primary hover:bg-kala-secondary">
                        Start Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TutorialCard = ({ tutorial }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={tutorial.thumbnail}
          alt={tutorial.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3">
          <Badge
            variant="outline"
            className="bg-white/90 text-kala-primary border-0 mb-2"
          >
            {tutorial.category}
          </Badge>
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="bg-black/40 text-white border-0">
              {tutorial.duration}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full bg-white text-kala-primary hover:bg-white/90"
            >
              <PlayCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="pt-4">
        <h3 className="font-medium mb-1 line-clamp-2">{tutorial.title}</h3>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{tutorial.author}</span>
          <div className="flex items-center">
            <span className="mr-1">{tutorial.rating}</span>
            <span className="text-yellow-500">★</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {tutorial.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 h-4 w-4 mr-1" />
            <span className="text-xs text-gray-500">
              {tutorial.completedCount} completed
            </span>
          </div>
          <Button size="sm" variant="ghost" className="text-kala-primary">
            View <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const featuredTutorials = [
  {
    id: 1,
    title: "Introduction to Natural Dyes for Textile Art",
    author: "Priya Sharma",
    description:
      "Learn how to create and use natural dyes from plants, flowers, and minerals for your textile projects.",
    thumbnail: "https://images.unsplash.com/photo-1618344572523-3c9543ae0241?q=80&w=500",
    duration: "45 min",
    rating: 4.8,
    completedCount: 1892,
    category: "Textile Art",
  },
  {
    id: 2,
    title: "Fundamentals of Blue Pottery",
    author: "Vikram Patel",
    description:
      "Master the basic techniques of traditional Blue Pottery from Jaipur, including clay preparation and glazing.",
    thumbnail: "https://images.unsplash.com/photo-1594813901385-dfc3d96e0403?q=80&w=500",
    duration: "1 hr 20 min",
    rating: 4.7,
    completedCount: 1245,
    category: "Pottery",
  },
  {
    id: 3,
    title: "Traditional Embroidery Patterns",
    author: "Meera Reddy",
    description:
      "Explore various embroidery patterns from different regions of India and learn how to incorporate them in modern designs.",
    thumbnail: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=500",
    duration: "1 hr 5 min",
    rating: 4.9,
    completedCount: 2053,
    category: "Embroidery",
  },
];

const trendingTutorials = [
  {
    id: 4,
    title: "Sustainable Materials in Artisan Crafts",
    author: "Ankit Gupta",
    description:
      "Discover sustainable materials and eco-friendly practices that can be incorporated into your artisan craft business.",
    thumbnail: "https://images.unsplash.com/photo-1534105615256-13940a56ff44?q=80&w=500",
    duration: "55 min",
    rating: 4.6,
    completedCount: 876,
    category: "Sustainability",
  },
  {
    id: 5,
    title: "Metal Embossing for Beginners",
    author: "Raj Kumar",
    description:
      "Learn the ancient art of metal embossing with simple tools and techniques that you can practice at home.",
    thumbnail: "https://images.unsplash.com/photo-1597696929736-2a2fb29fe975?q=80&w=500",
    duration: "1 hr 10 min",
    rating: 4.5,
    completedCount: 653,
    category: "Metal Work",
  },
  {
    id: 6,
    title: "Digital Marketing for Artisans",
    author: "Sanjana Kapoor",
    description:
      "A beginner-friendly guide to selling your handcrafted products online and building your artisan brand.",
    thumbnail: "https://images.unsplash.com/photo-1616469829962-f16525b3f688?q=80&w=500",
    duration: "1 hr 30 min",
    rating: 4.8,
    completedCount: 1432,
    category: "Business",
  },
];

const categories = [
  { name: "Textiles", count: 56, icon: Palette },
  { name: "Pottery", count: 43, icon: ShoppingBag },
  { name: "Jewelry", count: 38, icon: User },
  { name: "Wood Carving", count: 29, icon: Map },
  { name: "Metal Work", count: 35, icon: Camera },
  { name: "Weaving", count: 27, icon: Calendar },
  { name: "Embroidery", count: 46, icon: Book },
  { name: "Business", count: 22, icon: ShoppingBag },
];

const learningPath = [
  {
    title: "Basics of Artisan Crafts",
    description: "Introduction to tools, materials, and fundamental techniques",
    duration: "2-3 weeks",
  },
  {
    title: "Traditional Techniques",
    description: "Learn region-specific methods and patterns",
    duration: "1-2 months",
  },
  {
    title: "Material Innovation",
    description: "Experiment with sustainable and alternative materials",
    duration: "3-4 weeks",
  },
  {
    title: "Business of Craft",
    description: "Marketing, pricing, and building your artisan brand",
    duration: "1 month",
  },
];

export default Tutorial;
