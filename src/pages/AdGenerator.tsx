import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image, Layout, Target, MessageSquare, PenTool, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import BackButton from "@/components/ui/back-button";
import { useLanguage } from "@/context/LanguageContext";

const AdGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { language, translatePage } = useLanguage();
  
  // Define all page content in English (default language)
  const defaultContent = {
    title: "AI Ad Generator",
    description: "Create beautiful ad templates for your handicraft products",
    generateAd: "Generate Ad",
    adDetails: "Ad Details",
    adTitle: "Ad Title",
    adTitlePlaceholder: "Enter a title for your ad",
    adDescription: "Ad Description",
    adDescriptionPlaceholder: "Describe your product or service",
    promptLabel: "Custom Prompt (Optional)",
    promptPlaceholder: "Add specific details about what you want in the ad",
    targetAudience: "Target Audience",
    targetAudiencePlaceholder: "Who is this ad for?",
    adFormat: "Ad Format",
    imageFormat: "Image",
    textFormat: "Text",
    uploadImage: "Upload Image",
    uploadImageDescription: "Upload an image of your product to include in the ad",
    generating: "Generating...",
    generatedAd: "Generated Ad",
    regenerate: "Regenerate",
    download: "Download",
    share: "Share",
    errorGenerating: "Error generating ad. Please try again.",
    fillAllFields: "Please fill all required fields"
  };
  
  // State to hold translated content
  const [content, setContent] = useState(defaultContent);
  
  // Translate UI when language changes
  useEffect(() => {
    const updateTranslations = async () => {
      if (language === 'english') {
        setContent(defaultContent);
      } else {
        const translatedContent = await translatePage(defaultContent);
        setContent(translatedContent as typeof defaultContent);
      }
    };
    
    updateTranslations();
  }, [language, translatePage]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prompt: "",
    targetAudience: "",
    adFormat: "image"
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFormatChange = (value: string) => {
    setFormData(prev => ({ ...prev, adFormat: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUserImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setUserImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerateAd = async () => {
    // Validate form
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: content.fillAllFields,
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // In a real app, this would call an API to generate the ad
      // For demo purposes, we'll simulate a delay and return a placeholder
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (formData.adFormat === "image") {
        setGeneratedImage("https://placehold.co/600x400/8B5CF6/FFFFFF/png?text=AI+Generated+Ad");
      } else {
        setGeneratedText("This is a beautifully crafted handicraft item that showcases traditional artisanship with modern appeal. Perfect for home decor or as a thoughtful gift.");
      }
      
      toast({
        title: "Success",
        description: "Your ad has been generated successfully!",
      });
    } catch (error) {
      console.error("Error generating ad:", error);
      toast({
        title: "Error",
        description: content.errorGenerating,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleReset = () => {
    setGeneratedImage(null);
    setGeneratedText(null);
    setUserImage(null);
    setUserImagePreview(null);
    setFormData({
      title: "",
      description: "",
      prompt: "",
      targetAudience: "",
      adFormat: "image"
    });
  };
  
  const handlePromptTemplate = (promptTemplate: string) => {
    setFormData(prev => ({...prev, prompt: promptTemplate}));
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center mb-6">
        <BackButton />
        <div className="ml-2">
          <h1 className="text-2xl font-bold text-kala-primary">{content.title}</h1>
          <p className="text-gray-600">{content.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Ad</CardTitle>
              <CardDescription>Describe what you want to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input 
                  id="title" 
                  name="title"
                  placeholder="E.g., Summer Collection Ad" 
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Project Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  placeholder="Brief description of your ad project" 
                  className="min-h-[80px]"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userImage">{content.uploadImage}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    id="userImage" 
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  
                  {userImagePreview && (
                    <div className="border rounded-md overflow-hidden">
                      <img 
                        src={userImagePreview} 
                        alt="Your uploaded image" 
                        className="w-full h-auto max-h-[150px] object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">{content.uploadImageDescription}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prompt" className="font-medium">
                  {content.promptLabel} <span className="text-red-500">*</span>
                </Label>
                <Textarea 
                  id="prompt" 
                  name="prompt"
                  placeholder={content.promptPlaceholder} 
                  className="min-h-[120px]"
                  value={formData.prompt}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500">Be detailed and specific about colors, style, mood, and what should be included.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">{content.targetAudience}</Label>
                  <Input 
                    id="targetAudience" 
                    name="targetAudience"
                    placeholder={content.targetAudiencePlaceholder} 
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adFormat">{content.adFormat}</Label>
                  <Select value={formData.adFormat} onValueChange={handleFormatChange}>
                    <SelectTrigger id="adFormat">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">{content.imageFormat}</SelectItem>
                      <SelectItem value="carousel">Image Carousel</SelectItem>
                      <SelectItem value="banner">Web Banner</SelectItem>
                      <SelectItem value="social">Social Media Post</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleGenerateAd}
                disabled={isGenerating || !formData.prompt}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {content.generating}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {content.generateAd}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {generatedImage && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{content.generatedAd}</CardTitle>
                <CardDescription>Your AI-generated advertisement</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="border rounded-lg overflow-hidden mb-4">
                  <img 
                    src={generatedImage} 
                    alt="Generated Ad" 
                    className="w-full max-w-2xl h-auto"
                  />
                </div>
                
                {generatedText && (
                  <div className="bg-gray-50 p-4 rounded-lg w-full mb-4">
                    <h4 className="font-medium text-sm mb-2">AI Generated Description:</h4>
                    <p className="text-sm text-gray-700">{generatedText}</p>
                  </div>
                )}
                
                <div className="flex space-x-4 w-full max-w-md justify-center">
                  <Button variant="outline">
                    Download
                  </Button>
                  <Button>
                    Share
                  </Button>
                  <Button variant="ghost" onClick={handleReset}>
                    Create New
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Ad Features</CardTitle>
              <CardDescription>What's included in your ad</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formats">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="formats">Formats</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="tips">Tips</TabsTrigger>
                </TabsList>
                
                <TabsContent value="formats" className="space-y-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-kala-light p-2 rounded-md">
                      <Image className="h-5 w-5 text-kala-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Static Images</h4>
                      <p className="text-xs text-gray-500">High-resolution images for print or digital use</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-kala-light p-2 rounded-md">
                      <Layout className="h-5 w-5 text-kala-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Web Banners</h4>
                      <p className="text-xs text-gray-500">Responsive designs for websites and marketplaces</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-kala-light p-2 rounded-md">
                      <Target className="h-5 w-5 text-kala-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Social Media</h4>
                      <p className="text-xs text-gray-500">Perfectly sized for Instagram, Facebook and more</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="space-y-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-kala-light p-2 rounded-md">
                      <MessageSquare className="h-5 w-5 text-kala-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Compelling Copy</h4>
                      <p className="text-xs text-gray-500">AI-generated text that converts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-kala-light p-2 rounded-md">
                      <PenTool className="h-5 w-5 text-kala-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Professional Design</h4>
                      <p className="text-xs text-gray-500">Clean layouts that highlight your products</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-kala-light p-2 rounded-md">
                      <Target className="h-5 w-5 text-kala-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Audience Targeting</h4>
                      <p className="text-xs text-gray-500">Tailored to appeal to your specific customers</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="tips" className="space-y-3 pt-4">
                  <div className="bg-blue-50 p-3 rounded-md text-sm">
                    <p className="font-medium text-blue-700">Be specific in your prompt</p>
                    <p className="text-blue-600 text-xs mt-1">Include details about colors, style, and mood you want.</p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-md text-sm">
                    <p className="font-medium text-blue-700">Mention your brand</p>
                    <p className="text-blue-600 text-xs mt-1">Include your brand name and colors for consistency.</p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-md text-sm">
                    <p className="font-medium text-blue-700">Describe your product</p>
                    <p className="text-blue-600 text-xs mt-1">Be clear about what product should be featured.</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 bg-kala-light p-4 rounded-lg">
                <h4 className="font-medium text-kala-primary flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Need inspiration?
                </h4>
                <p className="text-sm mt-2">Try these prompt starters:</p>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="cursor-pointer hover:text-kala-primary" onClick={() => handlePromptTemplate("Create a vibrant advertisement for handcrafted jewelry featuring traditional Indian designs with modern styling. Include rich colors and ornate patterns.")}>
                    • Handcrafted jewelry ad with traditional designs
                  </li>
                  <li className="cursor-pointer hover:text-kala-primary" onClick={() => handlePromptTemplate("Design a clean, minimalist advertisement for home decor items made from sustainable materials. Show the products in a contemporary living space with soft, natural lighting.")}>
                    • Sustainable home decor with natural aesthetics
                  </li>
                  <li className="cursor-pointer hover:text-kala-primary" onClick={() => handlePromptTemplate("Create a festive advertisement for handmade silk clothing with rich colors, highlighting the intricate embroidery and craftsmanship. Feature soft, flowing fabrics in a luxurious setting.")}>
                    • Festive clothing with rich embroidery details
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdGenerator;
