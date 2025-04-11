
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Compass, Filter, TrendingUp, Map, StarIcon, PlayCircle, Heart, Bookmark } from "lucide-react";

const exploreItems = [
  {
    id: 1,
    title: "Traditional Madhubani Art Techniques",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1582547078055-a96e58078fcf?q=80&w=500",
    duration: "12:35",
    views: 4582,
    artist: {
      name: "Ananya Das",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250",
      location: "Bihar"
    },
    liked: false,
    saved: false
  },
  {
    id: 2,
    title: "Modern Takes on Ancient Pottery",
    type: "article",
    thumbnail: "https://images.unsplash.com/photo-1609686911241-e2b8e180cf89?q=80&w=500",
    readTime: "8 min read",
    artist: {
      name: "Ravi Kumar",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=250", 
      location: "Gujarat"
    },
    liked: true,
    saved: true
  },
  {
    id: 3,
    title: "Pashmina Shawl Weaving Showcase",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1485125639709-a60c3a500bf1?q=80&w=500",
    duration: "18:42",
    views: 2845,
    artist: {
      name: "Farooq Ahmed",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250",
      location: "Kashmir"
    },
    liked: false,
    saved: false
  },
  {
    id: 4,
    title: "Intricate Brass Work from South India",
    type: "gallery",
    thumbnail: "https://images.unsplash.com/photo-1589643385205-318138cfa74a?q=80&w=500",
    imageCount: 12,
    artist: {
      name: "Meera Reddy",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250",
      location: "Tamil Nadu"
    },
    liked: true,
    saved: false
  },
  {
    id: 5,
    title: "Guide to Natural Dyes for Textiles",
    type: "article",
    thumbnail: "https://images.unsplash.com/photo-1530259152377-3a014e1092e0?q=80&w=500",
    readTime: "15 min read",
    artist: {
      name: "Neha Singh",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250",
      location: "Rajasthan"
    },
    liked: false,
    saved: true
  },
  {
    id: 6,
    title: "Woodcarving Techniques for Beginners",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?q=80&w=500",
    duration: "24:18",
    views: 7832,
    artist: {
      name: "Mahesh Patel",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250",
      location: "Kerala"
    },
    liked: false,
    saved: false
  }
];

const categories = [
  "All", "Pottery", "Textiles", "Woodwork", "Metalwork", "Painting", 
  "Jewelry", "Paper Crafts", "Glass Work", "Stone Carving"
];

const regions = [
  "All India", "North", "South", "East", "West", "Central", 
  "Northeast", "Kashmir", "Gujarat", "Rajasthan", "Tamil Nadu"
];

const Explore = () => {
  const [items, setItems] = useState(exploreItems);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeRegion, setActiveRegion] = useState("All India");
  const [activeView, setActiveView] = useState("grid");
  
  const handleLike = (itemId: number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return { ...item, liked: !item.liked };
      }
      return item;
    }));
  };
  
  const handleSave = (itemId: number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return { ...item, saved: !item.saved };
      }
      return item;
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-kala-primary">Explore Crafts</h1>
        <p className="text-gray-600">Discover amazing handicrafts and artisans across India</p>
      </div>
      
      {/* Search and Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Search for crafts, techniques, artisans..." 
            className="pl-10 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeView === "grid" ? "default" : "outline"}
            className={activeView === "grid" ? "bg-kala-primary hover:bg-kala-secondary" : ""}
            onClick={() => setActiveView("grid")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          </Button>
          <Button 
            variant={activeView === "list" ? "default" : "outline"}
            className={activeView === "list" ? "bg-kala-primary hover:bg-kala-secondary" : ""}
            onClick={() => setActiveView("list")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          </Button>
          <Button 
            variant={activeView === "map" ? "default" : "outline"}
            className={activeView === "map" ? "bg-kala-primary hover:bg-kala-secondary" : ""}
            onClick={() => setActiveView("map")}
          >
            <Map className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Categories Scroll */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {categories.map(category => (
            <Button 
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`rounded-full px-4 py-1 text-sm ${
                activeCategory === category 
                  ? "bg-kala-primary hover:bg-kala-secondary" 
                  : "text-gray-600 hover:text-kala-primary"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Regions Scroll */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {regions.map(region => (
            <Button 
              key={region}
              variant="ghost"
              className={`px-3 py-1 text-sm ${
                activeRegion === region 
                  ? "bg-kala-light text-kala-primary" 
                  : "text-gray-600 hover:bg-kala-light/50"
              }`}
              onClick={() => setActiveRegion(region)}
            >
              <Map className={`w-3 h-3 mr-1 ${activeRegion === region ? "text-kala-primary" : "text-gray-400"}`} />
              {region}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Featured Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="text-kala-accent" />
            Featured This Week
          </h2>
          <Button variant="ghost" className="text-kala-primary hover:bg-kala-light">
            View All
          </Button>
        </div>
        
        <div className="relative rounded-xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1579762593175-20226054cad0?q=80&w=1200"
            alt="Featured craft" 
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
            <Badge className="self-start mb-2 bg-kala-accent border-0">Featured</Badge>
            <h3 className="text-2xl text-white font-bold mb-2">The Art of Traditional Block Printing</h3>
            <p className="text-white/90 mb-4 max-w-2xl">
              Discover how artisans in Jaipur keep alive the centuries-old technique of block printing, using hand-carved wooden blocks and natural dyes.
            </p>
            <div className="flex items-center gap-4">
              <Avatar className="border-2 border-white">
                <AvatarImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250" />
                <AvatarFallback className="bg-kala-primary">SK</AvatarFallback>
              </Avatar>
              <div className="text-white">
                <div className="font-medium">Sangita Kumari</div>
                <div className="text-sm opacity-80">Master Block Printer • Jaipur</div>
              </div>
              <Button className="ml-auto bg-white hover:bg-gray-100 text-kala-primary">
                Watch Documentary
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className={activeView === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {items.map(item => (
          <Card key={item.id} className={activeView === "list" ? "overflow-hidden flex flex-col md:flex-row" : ""}>
            <div className={`relative ${activeView === "list" ? "md:w-72" : ""}`}>
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className={`w-full ${activeView === "grid" ? "h-48" : "h-full"} object-cover`}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge className={`${
                  item.type === "video" ? "bg-red-500" : 
                  item.type === "article" ? "bg-blue-500" : 
                  "bg-purple-500"
                } text-white border-0`}>
                  {item.type === "video" && "Video"}
                  {item.type === "article" && "Article"}
                  {item.type === "gallery" && "Gallery"}
                </Badge>
              </div>
              {item.type === "video" && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {item.duration}
                </div>
              )}
              {item.type === "gallery" && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  {item.imageCount} images
                </div>
              )}
            </div>
            
            <CardContent className={`${activeView === "list" ? "flex-1" : ""} pt-4`}>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={item.artist.avatar} />
                  <AvatarFallback className="bg-kala-primary text-white text-xs">
                    {item.artist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">{item.artist.name}</span>
                <span className="text-xs text-gray-500">• {item.artist.location}</span>
              </div>
              
              <div className="text-sm text-gray-500">
                {item.type === "video" && (
                  <div className="flex items-center gap-1">
                    <PlayCircle className="w-4 h-4" />
                    <span>{item.views.toLocaleString()} views</span>
                  </div>
                )}
                {item.type === "article" && (
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    <span>{item.readTime}</span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-0 pb-4 px-6 flex justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`hover:bg-kala-light/50 ${item.liked ? 'text-red-500' : 'text-gray-600'}`}
                onClick={() => handleLike(item.id)}
              >
                <Heart className={`w-4 h-4 mr-1 ${item.liked ? 'fill-current' : ''}`} />
                <span>Like</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={`hover:bg-kala-light/50 ${item.saved ? 'text-kala-primary' : 'text-gray-600'}`}
                onClick={() => handleSave(item.id)}
              >
                <Bookmark className={`w-4 h-4 mr-1 ${item.saved ? 'fill-current' : ''}`} />
                <span>Save</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button variant="outline" className="text-kala-primary border-kala-primary hover:bg-kala-light">
          Load More
        </Button>
      </div>
    </div>
  );
};

export default Explore;
