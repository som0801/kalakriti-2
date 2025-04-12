
import { useState } from "react";
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

const AdGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFormatChange = (value: string) => {
    setFormData(prev => ({ ...prev, adFormat: value }));
  };
  
  const handleGenerate = async () => {
    if (!formData.prompt) {
      toast({
        title: "Missing information",
        description: "Please enter a prompt to generate your ad.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-ad', {
        body: {
          prompt: formData.prompt,
          title: formData.title,
          description: formData.description,
          targetAudience: formData.targetAudience,
          adFormat: formData.adFormat
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log("Generated ad data:", data);
      
      // Set the generated image and text
      setGeneratedImage(data.output_url);
      setGeneratedText(data.description);
      
      // Save the project to Supabase if user is logged in
      if (user) {
        const { error: insertError } = await supabase
          .from('ad_projects')
          .insert([{
            title: data.title,
            description: data.description,
            prompt: data.prompt,
            target_audience: data.target_audience,
            ad_format: data.ad_format,
            status: "completed",
            output_url: data.output_url,
            thumbnail_url: data.thumbnail_url,
            user_id: user.id
          }]);
          
        if (insertError) {
          console.error("Error saving ad project:", insertError);
        }
      }
      
      toast({
        title: "Ad generated successfully!",
        description: "Your ad has been created and saved to your projects.",
      });
      
    } catch (error) {
      console.error("Error generating ad:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleReset = () => {
    setGeneratedImage(null);
    setGeneratedText(null);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-kala-primary">AI Ad Generator</h1>
        <p className="text-gray-600">Create stunning ads for your products with AI</p>
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
                <Label htmlFor="prompt" className="font-medium">
                  Create Prompt <span className="text-red-500">*</span>
                </Label>
                <Textarea 
                  id="prompt" 
                  name="prompt"
                  placeholder="Describe the ad you want to create in detail. E.g., A vibrant advertisement showcasing handcrafted artisan products from Rajasthan with traditional motifs and patterns, set against a desert backdrop." 
                  className="min-h-[120px]"
                  value={formData.prompt}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500">Be detailed and specific about colors, style, mood, and what should be included.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input 
                    id="targetAudience" 
                    name="targetAudience"
                    placeholder="E.g., Women 25-40, art enthusiasts" 
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adFormat">Ad Format</Label>
                  <Select value={formData.adFormat} onValueChange={handleFormatChange}>
                    <SelectTrigger id="adFormat">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Static Image</SelectItem>
                      <SelectItem value="carousel">Image Carousel</SelectItem>
                      <SelectItem value="banner">Web Banner</SelectItem>
                      <SelectItem value="social">Social Media Post</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleGenerate}
                disabled={isGenerating || !formData.prompt}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Ad
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {generatedImage && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Generated Ad</CardTitle>
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
