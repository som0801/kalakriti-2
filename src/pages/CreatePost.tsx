
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Image, MapPin, Users, Smile, Lock, Globe, TagIcon, Camera, X } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/ui/back-button";

const CreatePost = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [postType, setPostType] = useState("text");
  const [postContent, setPostContent] = useState("");
  const [postImages, setPostImages] = useState<{file: File, preview: string}[]>([]);
  const [privacy, setPrivacy] = useState("public");
  const [allowComments, setAllowComments] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [artCategory, setArtCategory] = useState("");
  const [tags, setTags] = useState("");
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => {
        const preview = URL.createObjectURL(file);
        return { file, preview };
      });
      
      setPostImages([...postImages, ...newImages]);
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...postImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setPostImages(newImages);
  };
  
  const handlePublish = () => {
    if (!postContent.trim() && postImages.length === 0) {
      toast({
        title: "Cannot publish empty post",
        description: "Please add some content or images to your post.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would upload images and create a post in your database
    
    toast({
      title: "Post published successfully!",
      description: "Your post has been shared with the community."
    });
    
    navigate("/community");
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <BackButton />
        <div className="ml-2">
          <h1 className="text-2xl font-bold text-kala-primary">Create Post</h1>
          <p className="text-gray-600">Share your creativity with the community</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250"} />
                  <AvatarFallback className="bg-kala-primary text-white">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{profile?.full_name || user?.email?.split('@')[0] || "Anonymous Artisan"}</CardTitle>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>Your Location</span>
                    {privacy === "public" && (
                      <>
                        <Globe className="h-3 w-3 ml-2" />
                        <span>Public</span>
                      </>
                    )}
                    {privacy === "followers" && (
                      <>
                        <Users className="h-3 w-3 ml-2" />
                        <span>Followers Only</span>
                      </>
                    )}
                    {privacy === "private" && (
                      <>
                        <Lock className="h-3 w-3 ml-2" />
                        <span>Private</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <Tabs value={postType} onValueChange={setPostType}>
              <CardContent className="pb-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Text & Photos</TabsTrigger>
                  <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
                </TabsList>
              </CardContent>
              
              <TabsContent value="text">
                <CardContent className="space-y-4 pt-4">
                  <Textarea 
                    placeholder="Share your craft techniques, ask questions, or start a discussion about traditional artisanship..." 
                    className="min-h-[120px]"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  
                  {postImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {postImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image.preview} 
                            alt={`Upload ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full" 
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Image className="h-4 w-4" />
                        <span>Add Photos</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                      </label>
                    </Button>
                    
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Add Location</span>
                    </Button>
                    
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4" />
                      <span>Tag Artisans</span>
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="gallery">
                <CardContent className="space-y-4 pt-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    {postImages.length === 0 ? (
                      <div>
                        <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600 mb-4">Drag photos here or click to upload</p>
                        <Button variant="outline" size="sm">
                          <label className="cursor-pointer">
                            Select Photos
                            <input 
                              type="file" 
                              accept="image/*" 
                              multiple 
                              className="hidden" 
                              onChange={handleImageUpload}
                            />
                          </label>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {postImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={image.preview} 
                              alt={`Gallery ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-md"
                            />
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full" 
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center h-32">
                          <label className="cursor-pointer text-center p-2">
                            <Plus className="h-8 w-8 mx-auto text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Add More</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              multiple 
                              className="hidden" 
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Textarea 
                    placeholder="Write a caption for your gallery..." 
                    className="min-h-[80px]"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2" onClick={() => navigate("/community")}>
                Cancel
              </Button>
              <Button onClick={handlePublish}>
                Publish Post
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post-privacy">Who can see your post?</Label>
                <Select value={privacy} onValueChange={setPrivacy}>
                  <SelectTrigger id="post-privacy">
                    <SelectValue placeholder="Select privacy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Everyone</SelectItem>
                    <SelectItem value="followers">Followers Only</SelectItem>
                    <SelectItem value="private">Private - Only Me</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="art-category">Art Category</Label>
                <Select value={artCategory} onValueChange={setArtCategory}>
                  <SelectTrigger id="art-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="textile">Textile Art</SelectItem>
                    <SelectItem value="pottery">Pottery</SelectItem>
                    <SelectItem value="woodwork">Wood Carving</SelectItem>
                    <SelectItem value="metalwork">Metal Work</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="embroidery">Embroidery</SelectItem>
                    <SelectItem value="weaving">Weaving</SelectItem>
                    <SelectItem value="other">Other Craft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="post-tags">Tags (comma separated)</Label>
                <Input 
                  id="post-tags" 
                  placeholder="e.g., traditional, sustainable, handmade" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="allow-comments" 
                  checked={allowComments}
                  onCheckedChange={(checked) => setAllowComments(!!checked)}
                />
                <label htmlFor="allow-comments" className="text-sm font-medium leading-none cursor-pointer">
                  Allow comments
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-location" 
                  checked={showLocation}
                  onCheckedChange={(checked) => setShowLocation(!!checked)}
                />
                <label htmlFor="show-location" className="text-sm font-medium leading-none cursor-pointer">
                  Show my location
                </label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips for Great Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Badge className="bg-kala-light text-kala-primary mt-0.5">1</Badge>
                <p className="text-sm">Share clear images of your craft from multiple angles</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-kala-light text-kala-primary mt-0.5">2</Badge>
                <p className="text-sm">Describe your techniques and materials used</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-kala-light text-kala-primary mt-0.5">3</Badge>
                <p className="text-sm">Add relevant tags to increase visibility</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-kala-light text-kala-primary mt-0.5">4</Badge>
                <p className="text-sm">Ask specific questions to encourage discussion</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
