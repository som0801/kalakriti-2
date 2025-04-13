
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
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
    
    // In a real app, you'd send this to your API
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

    // In a real app, you'd upload the image and post to your API
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
    
    // Reset form
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
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold text-kala-primary">Community Hub</h1>
            <p className="text-gray-600">Connect with fellow artisans</p>
          </div>
        </div>
        <Button 
          className="bg-kala-primary hover:bg-kala-secondary"
          onClick={() => setIsPostModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>
      
      <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
        <TabsList className="w-full max-w-md mx-auto">
          <TabsTrigger value="feed" className="flex-1">Artisan Feed</TabsTrigger>
          <TabsTrigger value="messaging" className="flex-1">Artisan Connect</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="mt-6">
          <div className="flex flex-row gap-6">
            {/* Main Content */}
            <div className="flex-grow space-y-6">
              {/* Post Creation Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250"} />
                      <AvatarFallback className="bg-kala-primary text-white">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <Input 
                      placeholder="Share your craft with the community..." 
                      className="rounded-full bg-gray-50 cursor-pointer"
                      onClick={() => setIsPostModalOpen(true)}
                      readOnly
                    />
                  </div>
                  <div className="flex justify-between mt-4 pt-3 border-t">
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-kala-primary hover:bg-kala-light/50"
                      onClick={() => setIsPostModalOpen(true)}
                    >
                      <Image className="mr-2 h-5 w-5" />
                      Photo
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-kala-primary hover:bg-kala-light/50"
                      onClick={() => setIsPostModalOpen(true)}
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Filters */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                <Button 
                  variant="outline"
                  className="rounded-full px-4 text-sm"
                  onClick={toggleSidebar}
                >
                  {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                </Button>
                
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
                        onClick={() => handleOpenComments(post.id)}
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

            {/* Collapsible Sidebar */}
            {isSidebarOpen && (
              <div className="w-80 space-y-6 hidden md:block">
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
            )}

            {/* Mobile Sidebar as Collapsible */}
            <div className="md:hidden w-full mt-4">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full mb-4">
                    {isSidebarOpen ? "Hide Trending & Communities" : "Show Trending & Communities"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-4">
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
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="messaging" className="mt-6">
          <ArtisanMessaging />
        </TabsContent>
      </Tabs>

      {/* Create Post Dialog */}
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

      {/* Comments Drawer */}
      <Drawer open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Comments</DrawerTitle>
            <DrawerDescription>
              Join the conversation with fellow artisans
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4">
              {currentPost && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-3 text-sm flex-grow">
                      <div className="font-medium">Ramesh Kumar</div>
                      <p>Beautiful work! How long did it take you to create this piece?</p>
                      <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250" />
                      <AvatarFallback>PR</AvatarFallback>
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
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250"} />
                <AvatarFallback>
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <Input 
                placeholder="Add a comment..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow"
              />
              <Button size="sm" onClick={handlePostComment} disabled={!newComment.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Community;
