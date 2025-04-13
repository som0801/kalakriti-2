
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Share, Bookmark, ThumbsUp, Filter, TrendingUp } from "lucide-react";
import BackButton from "@/components/ui/back-button";
import ArtisanMessaging from "@/components/community/ArtisanMessaging";

const posts = [
  {
    id: 1,
    author: {
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250",
      location: "Mumbai, Maharashtra",
      artType: "Textile Art"
    },
    timeAgo: "2 hours ago",
    content: "Just finished this new Bandhani design after experimenting with natural dyes. What do you think?",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1530259152377-3a014e1092e0?q=80&w=500"
    },
    likes: 84,
    comments: 12,
    liked: false,
    saved: false
  },
  {
    id: 2,
    author: {
      name: "Vikram Patel",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250",
      location: "Jaipur, Rajasthan",
      artType: "Pottery"
    },
    timeAgo: "1 day ago",
    content: "New batch of blue pottery ready for the exhibition next week. These designs are inspired by traditional Rajasthani motifs with a modern twist.",
    media: {
      type: "video",
      url: "https://static.videezy.com/system/resources/previews/000/007/532/original/Traditional_Indian_Clay_Pottery_Wheel.mp4",
      thumbnail: "https://images.unsplash.com/photo-1609686911241-e2b8e180cf89?q=80&w=500"
    },
    likes: 156,
    comments: 27,
    liked: true,
    saved: true
  },
  {
    id: 3,
    author: {
      name: "Meera Reddy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250",
      location: "Chennai, Tamil Nadu",
      artType: "Brass Work"
    },
    timeAgo: "3 days ago",
    content: "Completed this intricate brass lamp design yesterday. Took almost a week to perfect the details. Swipe to see the close-up of the patterns!",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1589643385205-318138cfa74a?q=80&w=500"
    },
    likes: 213,
    comments: 42,
    liked: false,
    saved: false
  }
];

const Community = () => {
  const [postsList, setPostsList] = useState(posts);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeView, setActiveView] = useState("feed");
  
  const handleLike = (postId: number) => {
    setPostsList(postsList.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };
  
  const handleSave = (postId: number) => {
    setPostsList(postsList.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          saved: !post.saved
        };
      }
      return post;
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold text-kala-primary">Community Hub</h1>
            <p className="text-gray-600">Connect with fellow artisans</p>
          </div>
        </div>
        <Button className="bg-kala-primary hover:bg-kala-secondary">
          Create Post
        </Button>
      </div>
      
      <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
        <TabsList className="w-full max-w-md mx-auto">
          <TabsTrigger value="feed" className="flex-1">Artisan Feed</TabsTrigger>
          <TabsTrigger value="messaging" className="flex-1">Artisan Connect</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Sidebar */}
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="font-medium">Trending Topics</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Sustainable Art", "Traditional Techniques", "Natural Dyes", "Craft Exhibition", "Market Insights"].map((topic, index) => (
                    <div key={index} className="flex items-center gap-2 pb-2 border-b border-gray-100 last:border-0">
                      <TrendingUp className="w-4 h-4 text-kala-accent" />
                      <span className="text-sm">{topic}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="font-medium">Active Communities</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Textile Artists", members: 1245 },
                    { name: "Pottery Makers", members: 867 },
                    { name: "Wood Carvers", members: 532 },
                    { name: "Jewelry Designers", members: 926 }
                  ].map((community, index) => (
                    <div key={index} className="flex items-center justify-between pb-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm">{community.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {community.members} members
                      </Badge>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-kala-primary hover:bg-kala-light">
                    Discover More
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Post Creation */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250" />
                      <AvatarFallback className="bg-kala-primary text-white">SM</AvatarFallback>
                    </Avatar>
                    <Input 
                      placeholder="Share your craft with the community..." 
                      className="rounded-full bg-gray-50"
                    />
                  </div>
                  <div className="flex justify-between mt-4 pt-3 border-t">
                    <Button variant="ghost" className="text-gray-600 hover:text-kala-primary hover:bg-kala-light/50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      Photo
                    </Button>
                    <Button variant="ghost" className="text-gray-600 hover:text-kala-primary hover:bg-kala-light/50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                      Video
                    </Button>
                    <Button variant="ghost" className="text-gray-600 hover:text-kala-primary hover:bg-kala-light/50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M12 12H3"/><path d="M16 6H3"/><path d="M12 18H3"/></svg>
                      Poll
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Filters */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {["all", "trending", "latest", "following", "videos", "images"].map((filter) => (
                  <Button 
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    className={`rounded-full px-4 text-sm capitalize ${
                      activeFilter === filter 
                        ? "bg-kala-primary hover:bg-kala-secondary" 
                        : "text-gray-600 hover:text-kala-primary"
                    }`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter === "all" && <Filter className="w-4 h-4 mr-1" />}
                    {filter}
                  </Button>
                ))}
              </div>
              
              {/* Posts */}
              {postsList.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="px-6 py-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback className="bg-kala-primary text-white">
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{post.author.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>{post.author.location}</span>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-kala-light/50 text-kala-primary border-kala-light hover:bg-kala-light">
                        {post.author.artType}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-6 py-2">
                    <p className="text-gray-800 mb-4">{post.content}</p>
                    
                    <div className="rounded-lg overflow-hidden">
                      {post.media.type === "image" ? (
                        <img 
                          src={post.media.url} 
                          alt="Post" 
                          className="w-full h-auto"
                        />
                      ) : (
                        <video 
                          className="w-full h-auto" 
                          controls
                          poster={post.media.thumbnail}
                        >
                          <source src={post.media.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="px-6 py-4 flex justify-between">
                    <div className="flex gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`hover:bg-kala-light/50 ${post.liked ? 'text-red-500' : 'text-gray-600'}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className={`w-5 h-5 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:bg-kala-light/50"
                      >
                        <MessageCircle className="w-5 h-5 mr-1" />
                        <span>{post.comments}</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:bg-kala-light/50"
                      >
                        <Share className="w-5 h-5 mr-1" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`hover:bg-kala-light/50 ${post.saved ? 'text-kala-primary' : 'text-gray-600'}`}
                      onClick={() => handleSave(post.id)}
                    >
                      <Bookmark className={`w-5 h-5 ${post.saved ? 'fill-current' : ''}`} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <div className="flex justify-center pt-4">
                <Button variant="outline" className="text-kala-primary border-kala-primary hover:bg-kala-light">
                  Load More
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="messaging" className="mt-6">
          <ArtisanMessaging />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;
