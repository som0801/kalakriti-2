
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Copy, Facebook, Twitter, Instagram, Link2, Send, Share2, MessageSquare, Mail, QrCode, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/ui/back-button";

const SharePost = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [shareMode, setShareMode] = useState("social");
  const [emailAddress, setEmailAddress] = useState("");
  const [message, setMessage] = useState("Check out this amazing craft from the Kala community!");
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [showQrCode, setShowQrCode] = useState(false);
  
  const dummyPost = {
    id: 123,
    author: {
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250",
      artType: "Textile Art"
    },
    content: "Just finished this new Bandhani design after experimenting with natural dyes. What do you think?",
    image: "https://images.unsplash.com/photo-1530259152377-3a014e1092e0?q=80&w=500",
    likes: 84,
    comments: 12
  };
  
  const postLink = "https://kala.app/community/post/123";
  
  const handleNetworkToggle = (network: string) => {
    if (selectedNetworks.includes(network)) {
      setSelectedNetworks(selectedNetworks.filter(n => n !== network));
    } else {
      setSelectedNetworks([...selectedNetworks, network]);
    }
  };
  
  const handleShare = () => {
    if (shareMode === "email" && !emailAddress) {
      toast({
        title: "Email required",
        description: "Please enter an email address to share.",
        variant: "destructive"
      });
      return;
    }
    
    // This would actually share the post in a real app
    toast({
      title: "Post shared successfully!",
      description: shareMode === "email" 
        ? `Shared with ${emailAddress}` 
        : `Shared on ${selectedNetworks.join(", ")}`
    });
    
    navigate("/community");
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postLink);
    toast({
      title: "Link copied!",
      description: "Post link has been copied to clipboard."
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="flex items-center mb-6">
        <BackButton />
        <div className="ml-2">
          <h1 className="text-2xl font-bold text-kala-primary">Share Post</h1>
          <p className="text-gray-600">Share this craft with others</p>
        </div>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar>
                <AvatarImage src={dummyPost.author.avatar} alt={dummyPost.author.name} />
                <AvatarFallback>{dummyPost.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{dummyPost.author.name}</div>
                <Badge variant="outline" className="mt-1 bg-kala-light/50 text-kala-primary border-kala-light">
                  {dummyPost.author.artType}
                </Badge>
              </div>
            </div>
            
            <p className="text-gray-800 mb-4">{dummyPost.content}</p>
            
            <img 
              src={dummyPost.image} 
              alt="Post preview" 
              className="w-full h-auto rounded-lg mb-4"
            />
            
            <div className="flex justify-between text-sm text-gray-500">
              <div>{dummyPost.likes} likes</div>
              <div>{dummyPost.comments} comments</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Share With</CardTitle>
          <CardDescription>Choose how you want to share this post</CardDescription>
        </CardHeader>
        
        <Tabs value={shareMode} onValueChange={setShareMode}>
          <CardContent className="pb-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="direct">Direct</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>
          </CardContent>
          
          <TabsContent value="social">
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "Facebook", icon: Facebook, color: "bg-blue-100 text-blue-600" },
                  { name: "Instagram", icon: Instagram, color: "bg-purple-100 text-purple-600" },
                  { name: "Twitter", icon: Twitter, color: "bg-sky-100 text-sky-600" },
                  { name: "MessageSquare", icon: MessageSquare, color: "bg-green-100 text-green-600" }
                ].map((network) => (
                  <div 
                    key={network.name}
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${
                      selectedNetworks.includes(network.name)
                        ? "border-kala-primary bg-kala-light/30"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handleNetworkToggle(network.name)}
                  >
                    <div className={`${network.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <network.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">{network.name}</span>
                    
                    <div className="mt-2">
                      <Checkbox 
                        checked={selectedNetworks.includes(network.name)}
                        onCheckedChange={() => handleNetworkToggle(network.name)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <div className="font-medium text-sm mb-2">Share message (optional)</div>
                <Textarea 
                  placeholder="Add a message with your share..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="direct">
            <CardContent className="space-y-4 pt-4">
              <div className="flex flex-col space-y-3">
                <Button variant="outline" className="justify-start" onClick={handleCopyLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                
                <Button variant="outline" className="justify-start" onClick={() => setShowQrCode(true)}>
                  <QrCode className="mr-2 h-4 w-4" />
                  Show QR Code
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Share with Contacts
                </Button>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center space-x-2 border rounded-md p-2">
                  <Input 
                    value={postLink} 
                    readOnly 
                    className="border-0 focus-visible:ring-0"
                  />
                  <Button size="sm" variant="ghost" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="email">
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="font-medium text-sm">Recipient Email</div>
                <Input 
                  type="email" 
                  placeholder="Enter email address" 
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="font-medium text-sm">Message</div>
                <Textarea 
                  placeholder="Add a message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="justify-between">
          <Button variant="outline" onClick={() => navigate("/community")}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={(shareMode === "social" && selectedNetworks.length === 0) || (shareMode === "email" && !emailAddress)}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Now
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>
              Scan this code to view the post
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg border w-64 h-64 flex items-center justify-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://kala.app/community/post/123" 
                alt="QR Code" 
                className="w-full h-auto"
              />
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 mb-2">
                This QR code links directly to the post
              </p>
              <Button size="sm" variant="outline" onClick={handleCopyLink}>
                <Link2 className="mr-2 h-4 w-4" />
                Copy Post Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SharePost;
