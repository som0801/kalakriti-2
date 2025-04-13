import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Share, Bookmark, Filter, TrendingUp, Plus, Image, Send } from "lucide-react";
import BackButton from "@/components/ui/back-button";
import ArtisanMessaging from "@/components/community/ArtisanMessaging";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [postsList, setPostsList] = useState(posts);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeView, setActiveView] = useState("feed");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [postFormData, setPostFormData] = useState({
    content: "",
    image: null as File | null,
    imagePreview: "",
    allowComments: true,
    showLocation: true
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
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

  const handleOpenComments = (postId: number) => {
    setCurrentPost(postId);
    setIsCommentsOpen(true);
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    
    toast({
      title: "Comment posted",
      description: "Your comment has been added successfully"
    });
    
    setNewComment("");
    setIsCommentsOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPostFormData({
          ...postFormData,
          image: file,
          imagePreview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    if (!postFormData.content.trim() && !postFormData.image) {
      toast({
        title: "Cannot create empty post",
        description: "Please add some text or an image to your post",
        variant: "destructive"
      });
      return;
    }

    const newPost = {
      id: Math.max(...postsList.map(p => p.id)) + 1,
      author: {
        name: profile?.full_name || user?.email?.split('@')[0] || "Anonymous Artisan",
        avatar: profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250",
        location: "Your Location",
        artType: "Your Craft"
      },
      timeAgo: "Just now",
      content: postFormData.content,
      media: postFormData.image ? {
        type: "image",
        url: postFormData.imagePreview
      } : undefined,
      likes: 0,
      comments: 0,
      liked: false,
      saved: false
    };

    setPostsList([newPost, ...postsList]);
    
    setPostFormData({
      content: "",
      image: null,
      imagePreview: "",
      allowComments: true,
      showLocation: true
    });
    
    setIsPostModalOpen(false);
    
    toast({
      title: "Post created",
      description: "Your post has been published successfully"
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container mx-auto py-4 px-2 md:py-8 md:px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-4">
          <BackButton />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-kala-primary">Community Hub</h1>
            <p className="text-sm md:text-base text-gray-600">Connect with fellow artisans</p>
          </div>
        </div>
        <Button 
          className="bg-kala-primary hover:bg-kala-secondary text-xs md:text-sm h-8 md:h-10"
          onClick={() => setIsPostModalOpen(true)}
        >
          <Plus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden sm:inline">Create Post</span>
          <span className="sm:hidden">Post</span>
        </Button>
      </div>
      
      <Tabs value={activeView} onValueChange={setActiveView} className="mb-4 md:mb-6">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="feed" className="text-xs md:text-sm py-1.5 md:py-2">Artisan Feed</TabsTrigger>
          <TabsTrigger value="messaging" className="text-xs md:text-sm py-1.5 md:py-2">Artisan Connect</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="mt-4 md:mt-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-grow space-y-4 md:space-y-6 order-2 md:order-1">
              <Card>
                <CardContent className="pt-4 md:pt-6 px-3 md:px-6">
                  <div className="flex gap-2 md:gap-3">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250"} />
                      <AvatarFallback className="bg-kala-primary text-white text-xs md:text-sm">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <Input 
                      placeholder="Share your craft..." 
                      className="rounded-full bg-gray-50 cursor-pointer text-xs md:text-sm h-8 md:h-10"
                      onClick={() => setIsPostModalOpen(true)}
                      readOnly
                    />
                  </div>
                  <div className="flex justify-between mt-3 md:mt-4 pt-2 md:pt-3 border-t">
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-kala-primary hover:bg-kala-light/50 text-xs md:text-sm h-8 md:h-10 px-2 md:px-3"
                      onClick={() => setIsPostModalOpen(true)}
                    >
                      <Image className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                      <span>Photo</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-kala-primary hover:bg-kala-light/50 text-xs md:text-sm h-8 md:h-10 px-2 md:px-3"
                      onClick={() => setIsPostModalOpen(true)}
                    >
                      <Send className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                      <span>Post</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                <Button 
                  variant="outline"
                  className="rounded-full px-3 md:px-4 text-xs md:text-sm h-7 md:h-9 flex-shrink-0"
                  onClick={toggleSidebar}
                >
                  {isSidebarOpen ? "Hide" : "Show"} 
                  <span className="hidden sm:inline ml-1">Sidebar</span>
                </Button>
                
                {["all", "trending", "latest", "following", "videos", "images"].map((filter) => (
                  <Button 
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    className={`rounded-full px-3 md:px-4 text-xs md:text-sm h-7 md:h-9 capitalize flex-shrink-0 ${
                      activeFilter === filter 
                        ? "bg-kala-primary hover:bg-kala-secondary" 
                        : "text-gray-600 hover:text-kala-primary"
                    }`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter === "all" && <Filter className="w-3 h-3 md:w-4 md:h-4 mr-1" />}
                    {filter}
                  </Button>
                ))}
              </div>
              
              {postsList.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2 md:gap-3">
                        <Avatar className="h-8 w-8 md:h-10 md:w-10">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback className="bg-kala-primary text-white text-xs md:text-sm">
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm md:text-base">{post.author.name}</div>
                          <div className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1">
                            <span>{post.author.location}</span>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-kala-light/50 text-kala-primary border-kala-light hover:bg-kala-light text-[10px] md:text-xs">
                        {post.author.artType}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-3 md:px-6 py-1 md:py-2">
                    <p className="text-sm md:text-base text-gray-800 mb-3 md:mb-4">{post.content}</p>
                    
                    {post.media && (
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
                    )}
                  </CardContent>
                  
                  <CardFooter className="px-3 md:px-6 py-3 md:py-4 flex justify-between">
                    <div className="flex gap-2 md:gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`hover:bg-kala-light/50 ${post.liked ? 'text-red-500' : 'text-gray-600'} px-2 text-xs md:text-sm h-7 md:h-8`}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className={`w-3 h-3 md:w-4 md:h-4 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:bg-kala-light/50 px-2 text-xs md:text-sm h-7 md:h-8"
                        onClick={() => handleOpenComments(post.id)}
                      >
                        <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        <span>{post.comments}</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:bg-kala-light/50 px-2 text-xs md:text-sm h-7 md:h-8"
                      >
                        <Share className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`hover:bg-kala-light/50 ${post.saved ? 'text-kala-primary' : 'text-gray-600'} px-2 text-xs md:text-sm h-7 md:h-8`}
                      onClick={() => handleSave(post.id)}
                    >
                      <Bookmark className={`w-3 h-3 md:w-4 md:h-4 ${post.saved ? 'fill-current' : ''}`} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <div className="flex justify-center pt-2 md:pt-4">
                <Button variant="outline" className="text-kala-primary border-kala-primary hover:bg-kala-light text-xs md:text-sm h-8 md:h-10">
                  Load More
                </Button>
              </div>
            </div>

            {isSidebarOpen && (
              <div className="w-full md:w-80 space-y-4 md:space-y-6 order-1 md:order-2 hidden md:block">
                <Card>
                  <CardHeader className="pb-2 md:pb-3 pt-3 md:pt-4 px-3 md:px-4">
                    <h3 className="font-medium text-sm md:text-base">Trending Topics</h3>
                  </CardHeader>
                  <CardContent className="space-y-1 md:space-y-2 px-3 md:px-4 py-1 md:py-2">
                    {["Sustainable Art", "Traditional Techniques", "Natural Dyes", "Craft Exhibition", "Market Insights"].map((topic, index) => (
                      <div key={index} className="flex items-center gap-2 pb-1 md:pb-2 border-b border-gray-100 last:border-0">
                        <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-kala-accent" />
                        <span className="text-xs md:text-sm">{topic}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2 md:pb-3 pt-3 md:pt-4 px-3 md:px-4">
                    <h3 className="font-medium text-sm md:text-base">Active Communities</h3>
                  </CardHeader>
                  <CardContent className="space-y-2 md:space-y-3 px-3 md:px-4 py-1 md:py-2">
                    {[
                      { name: "Textile Artists", members: 1245 },
                      { name: "Pottery Makers", members: 867 },
                      { name: "Wood Carvers", members: 532 },
                      { name: "Jewelry Designers", members: 926 }
                    ].map((community, index) => (
                      <div key={index} className="flex items-center justify-between pb-1 md:pb-2 border-b border-gray-100 last:border-0">
                        <span className="text-xs md:text-sm">{community.name}</span>
                        <Badge variant="outline" className="text-[10px] md:text-xs">
                          {community.members} members
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="py-2 md:py-3 px-3 md:px-4">
                    <Button variant="ghost" className="w-full text-kala-primary hover:bg-kala-light text-xs md:text-sm h-7 md:h-9">
                      Discover More
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            <div className="md:hidden w-full mt-2 mb-4 order-1">
              {isSidebarOpen && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2 pt-3 px-3">
                      <h3 className="font-medium text-sm">Trending Topics</h3>
                    </CardHeader>
                    <CardContent className="space-y-1 px-3 py-1">
                      {["Sustainable Art", "Traditional Techniques", "Natural Dyes", "Craft Exhibition", "Market Insights"].map((topic, index) => (
                        <div key={index} className="flex items-center gap-2 pb-1 border-b border-gray-100 last:border-0">
                          <TrendingUp className="w-3 h-3 text-kala-accent" />
                          <span className="text-xs">{topic}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2 pt-3 px-3">
                      <h3 className="font-medium text-sm">Active Communities</h3>
                    </CardHeader>
                    <CardContent className="space-y-2 px-3 py-1">
                      {[
                        { name: "Textile Artists", members: 1245 },
                        { name: "Pottery Makers", members: 867 },
                        { name: "Wood Carvers", members: 532 },
                        { name: "Jewelry Designers", members: 926 }
                      ].map((community, index) => (
                        <div key={index} className="flex items-center justify-between pb-1 border-b border-gray-100 last:border-0">
                          <span className="text-xs">{community.name}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {community.members} members
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="py-2 px-3">
                      <Button variant="ghost" className="w-full text-kala-primary hover:bg-kala-light text-xs h-7">
                        Discover More
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="messaging" className="mt-4 md:mt-6">
          <ArtisanMessaging />
        </TabsContent>
      </Tabs>

      {isMobile ? (
        <Drawer open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Create Post</DrawerTitle>
              <DrawerDescription>
                Share your craft with the artisan community
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250"} />
                  <AvatarFallback className="bg-kala-primary text-white text-xs">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{profile?.full_name || user?.email?.split('@')[0] || "Anonymous Artisan"}</div>
                  <div className="text-[10px] text-gray-500">Your post will be visible to all community members</div>
                </div>
              </div>
              
              <Textarea 
                placeholder="What's on your mind? Share your craft..." 
                className="min-h-[100px] text-sm"
                value={postFormData.content}
                onChange={(e) => setPostFormData({...postFormData, content: e.target.value})}
              />
              
              {postFormData.imagePreview && (
                <div className="relative border rounded-md overflow-hidden">
                  <img 
                    src={postFormData.imagePreview} 
                    alt="Upload preview" 
                    className="w-full h-auto max-h-[150px] object-contain"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2 rounded-full h-6 w-6 p-0"
                    onClick={() => setPostFormData({...postFormData, image: null, imagePreview: ""})}
                  >
                    ✕
                  </Button>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <label 
                  htmlFor="post-image-upload-mobile" 
                  className="flex items-center gap-2 text-xs cursor-pointer text-gray-700 hover:text-kala-primary"
                >
                  <div className="bg-kala-light/50 rounded-full p-1.5">
                    <Image className="h-3 w-3" />
                  </div>
                  <span>Add Photo</span>
                  <input 
                    id="post-image-upload-mobile" 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="allow-comments-mobile" 
                  checked={postFormData.allowComments}
                  onCheckedChange={(checked) => 
                    setPostFormData({...postFormData, allowComments: checked as boolean})
                  }
                  className="h-3 w-3"
                />
                <label htmlFor="allow-comments-mobile" className="text-xs font-medium leading-none cursor-pointer">
                  Allow comments
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-location-mobile" 
                  checked={postFormData.showLocation}
                  onCheckedChange={(checked) => 
                    setPostFormData({...postFormData, showLocation: checked as boolean})
                  }
                  className="h-3 w-3"
                />
                <label htmlFor="show-location-mobile" className="text-xs font-medium leading-none cursor-pointer">
                  Show my location
                </label>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsPostModalOpen(false)} className="flex-1 text-xs h-8">Cancel</Button>
                <Button onClick={handleCreatePost} className="flex-1 text-xs h-8">Post</Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
              <DialogDescription>
                Share your craft, techniques, or questions with the artisan community
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250"} />
                  <AvatarFallback className="bg-kala-primary text-white">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{profile?.full_name || user?.email?.split('@')[0] || "Anonymous Artisan"}</div>
                  <div className="text-xs text-gray-500">Your post will be visible to all community members</div>
                </div>
              </div>
              
              <Textarea 
                placeholder="What's on your mind? Share your craft, ask questions, or connect with fellow artisans..." 
                className="min-h-[100px]"
                value={postFormData.content}
                onChange={(e) => setPostFormData({...postFormData, content: e.target.value})}
              />
              
              {postFormData.imagePreview && (
                <div className="relative border rounded-md overflow-hidden">
                  <img 
                    src={postFormData.imagePreview} 
                    alt="Upload preview" 
                    className="w-full h-auto max-h-[200px] object-contain"
                  />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2 rounded-full h-8 w-8 p-0"
                    onClick={() => setPostFormData({...postFormData, image: null, imagePreview: ""})}
                  >
                    ✕
                  </Button>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <label 
                  htmlFor="post-image-upload" 
                  className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 hover:text-kala-primary"
                >
                  <div className="bg-kala-light/50 rounded-full p-2">
                    <Image className="h-4 w-4" />
                  </div>
                  <span>Add Photo</span>
                  <input 
                    id="post-image-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Checkbox 
                  id="allow-comments" 
                  checked={postFormData.allowComments}
                  onCheckedChange={(checked) => 
                    setPostFormData({...postFormData, allowComments: checked as boolean})
                  }
                />
                <label htmlFor="allow-comments" className="text-sm font-medium leading-none cursor-pointer">
                  Allow comments
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-location" 
                  checked={postFormData.showLocation}
                  onCheckedChange={(checked) => 
                    setPostFormData({...postFormData, showLocation: checked as boolean})
                  }
                />
                <label htmlFor="show-location" className="text-sm font-medium leading-none cursor-pointer">
                  Show my location
                </label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPostModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreatePost}>Post</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Drawer open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Comments</DrawerTitle>
            <DrawerDescription>
              Join the conversation with fellow artisans
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <div className="space-y-3 max-h-[250px] md:max-h-[300px] overflow-y-auto mb-3 md:mb-4">
              {currentPost && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-6 w-6 md:h-8 md:w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250" />
                      <AvatarFallback className="text-[10px] md:text-xs">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-3 text-sm flex-grow">
                      <div className="font-medium">Ramesh Kumar</div>
                      <p>Beautiful work! How long did it take you to create this piece?</p>
                      <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Avatar className="h-6 w-6 md:h-8 md:w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250" />
                      <AvatarFallback className="text-[10px] md:text-xs">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-3 text-sm flex-grow">
                      <div className="font-medium">Lakshmi Patel</div>
                      <p>Love the colors! What dyes did you use for this?</p>
                      <div className="text-xs text-gray-500 mt-1">Yesterday</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 md:h-8 md:w-8">
                <AvatarImage src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250"} />
                <AvatarFallback className="text-[10px] md:text-xs">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <Input 
                placeholder="Add a comment..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow text-xs md:text-sm h-7 md:h-9"
              />
              <Button size="sm" onClick={handlePostComment} disabled={!newComment.trim()} className="h-7 md:h-9 w-7 md:w-9 p-0">
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Community;
