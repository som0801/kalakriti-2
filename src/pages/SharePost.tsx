import { useState, useEffect } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/context/LanguageContext";

const SharePost = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { language, translatePage } = useLanguage();
  
  const defaultContent = {
    pageTitle: "Share Post",
    pageSubtitle: "Share this craft with others",
    defaultMessage: "Check out this amazing craft from the Kala community!",
    emailRequired: "Email required",
    emailRequiredDesc: "Please enter an email address to share.",
    postShared: "Post shared successfully!",
    sharedWith: "Shared with",
    sharedOn: "Shared on",
    linkCopied: "Link copied!",
    linkCopiedDesc: "Post link has been copied to clipboard.",
    social: "Social",
    direct: "Direct",
    email: "Email",
    shareWith: "Share With",
    shareDesc: "Choose how you want to share this post",
    shareMessage: "Share message (optional)",
    addMessage: "Add a message with your share...",
    copyLink: "Copy Link",
    showQrCode: "Show QR Code",
    shareWithContacts: "Share with Contacts",
    recipientEmail: "Recipient Email",
    enterEmail: "Enter email address",
    message: "Message",
    addAMessage: "Add a message...",
    cancel: "Cancel",
    shareNow: "Share Now",
    qrCode: "QR Code",
    scanQrDesc: "Scan this code to view the post",
    qrLinksTo: "This QR code links directly to the post",
    postLinkCopy: "Copy Post Link",
    likes: "likes",
    comments: "comments"
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
  
  const [shareMode, setShareMode] = useState("social");
  const [emailAddress, setEmailAddress] = useState("");
  const [message, setMessage] = useState(content.defaultMessage);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [showQrCode, setShowQrCode] = useState(false);
  
  useEffect(() => {
    setMessage(content.defaultMessage);
  }, [content.defaultMessage]);
  
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
        title: content.emailRequired,
        description: content.emailRequiredDesc,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: content.postShared,
      description: shareMode === "email" 
        ? `${content.sharedWith} ${emailAddress}` 
        : `${content.sharedOn} ${selectedNetworks.join(", ")}`
    });
    
    navigate("/community");
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postLink);
    toast({
      title: content.linkCopied,
      description: content.linkCopiedDesc
    });
  };

  useEffect(() => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, []);
  
  return (
    <div className="container mx-auto py-4 px-3 md:py-8 md:px-4 max-w-2xl">
      <div className="flex items-center mb-4 md:mb-6">
        <BackButton />
        <div className="ml-2">
          <h1 className="text-xl md:text-2xl font-bold text-kala-primary">{content.pageTitle}</h1>
          <p className="text-sm md:text-base text-gray-600">{content.pageSubtitle}</p>
        </div>
      </div>
      
      <div className="mb-4 md:mb-6">
        <Card className="border-kala-light shadow-sm">
          <CardContent className="p-3 md:p-6">
            <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
              <Avatar className="w-10 h-10 md:w-12 md:h-12">
                <AvatarImage src={dummyPost.author.avatar} alt={dummyPost.author.name} />
                <AvatarFallback>{dummyPost.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{dummyPost.author.name}</div>
                <Badge variant="outline" className="mt-1 bg-kala-light/50 text-kala-primary border-kala-light text-xs">
                  {dummyPost.author.artType}
                </Badge>
              </div>
            </div>
            
            <p className="text-gray-800 mb-3 md:mb-4 text-sm md:text-base">{dummyPost.content}</p>
            
            <img 
              src={dummyPost.image} 
              alt="Post preview" 
              className="w-full h-auto rounded-lg mb-3 md:mb-4"
            />
            
            <div className="flex justify-between text-xs md:text-sm text-gray-500">
              <div>{dummyPost.likes} {content.likes}</div>
              <div>{dummyPost.comments} {content.comments}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-kala-light shadow-sm">
        <CardHeader className="pb-0 pt-4 px-4">
          <CardTitle className="text-lg md:text-xl">{content.shareWith}</CardTitle>
          <CardDescription className="text-xs md:text-sm">{content.shareDesc}</CardDescription>
        </CardHeader>
        
        <Tabs value={shareMode} onValueChange={setShareMode}>
          <CardContent className="pb-0 px-3 md:px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="social" className="text-xs md:text-sm">{content.social}</TabsTrigger>
              <TabsTrigger value="direct" className="text-xs md:text-sm">{content.direct}</TabsTrigger>
              <TabsTrigger value="email" className="text-xs md:text-sm">{content.email}</TabsTrigger>
            </TabsList>
          </CardContent>
          
          <TabsContent value="social">
            <CardContent className="space-y-4 pt-4 px-3 md:px-6">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
                {[
                  { name: "Facebook", icon: Facebook, color: "bg-blue-100 text-blue-600" },
                  { name: "Instagram", icon: Instagram, color: "bg-purple-100 text-purple-600" },
                  { name: "Twitter", icon: Twitter, color: "bg-sky-100 text-sky-600" },
                  { name: "MessageSquare", icon: MessageSquare, color: "bg-green-100 text-green-600" }
                ].map((network) => (
                  <div 
                    key={network.name}
                    className={`border rounded-lg p-2 md:p-3 text-center cursor-pointer transition-colors ${
                      selectedNetworks.includes(network.name)
                        ? "border-kala-primary bg-kala-light/30"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handleNetworkToggle(network.name)}
                  >
                    <div className={`${network.color} w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2`}>
                      <network.icon className="h-4 w-4 md:h-6 md:w-6" />
                    </div>
                    <span className="text-xs md:text-sm font-medium">{network.name}</span>
                    
                    <div className="mt-1 md:mt-2">
                      <Checkbox 
                        checked={selectedNetworks.includes(network.name)}
                        onCheckedChange={() => handleNetworkToggle(network.name)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <div className="font-medium text-xs md:text-sm mb-1 md:mb-2">{content.shareMessage}</div>
                <Textarea 
                  placeholder={content.addMessage}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none text-sm"
                />
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="direct">
            <CardContent className="space-y-3 md:space-y-4 pt-4 px-3 md:px-6">
              <div className="flex flex-col space-y-2 md:space-y-3">
                <Button variant="outline" className="justify-start text-xs md:text-sm h-9 md:h-10" onClick={handleCopyLink}>
                  <Copy className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  {content.copyLink}
                </Button>
                
                <Button variant="outline" className="justify-start text-xs md:text-sm h-9 md:h-10" onClick={() => setShowQrCode(true)}>
                  <QrCode className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  {content.showQrCode}
                </Button>
                
                <Button variant="outline" className="justify-start text-xs md:text-sm h-9 md:h-10">
                  <Users className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  {content.shareWithContacts}
                </Button>
              </div>
              
              <div className="pt-1 md:pt-2">
                <div className="flex items-center space-x-2 border rounded-md p-1 md:p-2">
                  <Input 
                    value={postLink} 
                    readOnly 
                    className="border-0 focus-visible:ring-0 text-xs md:text-sm"
                  />
                  <Button size="sm" variant="ghost" onClick={handleCopyLink} className="h-7 w-7 md:h-8 md:w-8">
                    <Copy className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="email">
            <CardContent className="space-y-3 md:space-y-4 pt-4 px-3 md:px-6">
              <div className="space-y-1 md:space-y-2">
                <div className="font-medium text-xs md:text-sm">{content.recipientEmail}</div>
                <Input 
                  type="email" 
                  placeholder={content.enterEmail}
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-1 md:space-y-2">
                <div className="font-medium text-xs md:text-sm">{content.message}</div>
                <Textarea 
                  placeholder={content.addAMessage}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[80px] md:min-h-[100px] text-sm"
                />
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="justify-between p-3 md:p-4">
          <Button variant="outline" onClick={() => navigate("/community")} 
                 className="text-xs md:text-sm h-8 md:h-10">
            {content.cancel}
          </Button>
          <Button onClick={handleShare} 
                 disabled={(shareMode === "social" && selectedNetworks.length === 0) || (shareMode === "email" && !emailAddress)}
                 className="text-xs md:text-sm h-8 md:h-10">
            <Share2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
            {content.shareNow}
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent className="sm:max-w-[325px] md:sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{content.qrCode}</DialogTitle>
            <DialogDescription>
              {content.scanQrDesc}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg border w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://kala.app/community/post/123" 
                alt="QR Code" 
                className="w-full h-auto"
              />
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs md:text-sm text-gray-500 mb-2">
                {content.qrLinksTo}
              </p>
              <Button size="sm" variant="outline" onClick={handleCopyLink} className="text-xs md:text-sm">
                <Link2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                {content.postLinkCopy}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SharePost;
