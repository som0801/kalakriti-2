
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { VideoIcon, SparklesIcon, WandIcon, ClockIcon, ShuffleIcon, Download, Share2, Loader2 } from "lucide-react";

const VideoGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [duration, setDuration] = useState("30 seconds");
  const [resolution, setResolution] = useState("1080p");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  const [storyboard, setStoryboard] = useState("");

  const styleOptions = [
    "cinematic", "documentary", "commercial", "animation", 
    "social media", "product showcase", "explainer"
  ];

  const durationOptions = [
    "15 seconds", "30 seconds", "60 seconds", "2 minutes"
  ];

  const resolutionOptions = [
    "720p", "1080p", "4K"
  ];

  const generateRandomPrompt = () => {
    const productPrompts = [
      "A traditional handloom weaver creating colorful fabrics in a village setting",
      "Metalwork artisans crafting intricate brass items in a workshop",
      "Potter making beautiful clay pots using traditional techniques",
      "Artist creating detailed paintings showcasing traditional Indian motifs",
      "Woodcarvers carefully creating ornate furniture pieces by hand",
      "Craftspeople making handmade paper and beautiful journal covers"
    ];
    setPrompt(productPrompts[Math.floor(Math.random() * productPrompts.length)]);
  };

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description of the video you want to generate.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: {
          prompt,
          style,
          duration,
          resolution
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update the UI with the results
      setGeneratedVideo(data);
      setStoryboard(data.storyboard);
      
      toast({
        title: "Video Generation Started",
        description: "Your AI video is being processed. You'll be notified when it's ready.",
      });
      
    } catch (error) {
      console.error("Error generating video:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToProject = async () => {
    if (!user || !generatedVideo) return;
    
    try {
      await supabase
        .from('video_projects')
        .insert([{
          title: prompt.substring(0, 50) + (prompt.length > 50 ? "..." : ""),
          description: storyboard.substring(0, 200) + (storyboard.length > 200 ? "..." : ""),
          prompt: prompt,
          status: "completed",
          video_url: generatedVideo.video_preview_url || generatedVideo.thumbnail_url,
          thumbnail_url: generatedVideo.thumbnail_url,
          user_id: user.id
        }]);
        
      toast({
        title: "Saved to Projects",
        description: "Your generated video has been saved to your projects.",
      });
    } catch (error) {
      console.error("Error saving video:", error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-kala-primary">AI Video Generator</h1>
        <p className="text-gray-600">Create professional videos with AI for your products</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card className="md:col-span-3 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WandIcon className="h-5 w-5 text-kala-accent" />
              Generate Video
            </CardTitle>
            <CardDescription>
              Describe what you want to create
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="prompt">Video Description</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs text-kala-primary"
                  onClick={generateRandomPrompt}
                >
                  <ShuffleIcon className="h-3 w-3 mr-1" /> Random
                </Button>
              </div>
              <Textarea 
                id="prompt" 
                placeholder="Describe the video you want to generate..."
                className="min-h-24"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Be specific about what you want to see in your video
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="style">Video Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Video Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resolution">Video Resolution</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger id="resolution">
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  {resolutionOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full bg-kala-primary hover:bg-kala-secondary"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  Generate Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* Preview Panel */}
        <Card className="md:col-span-3 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <VideoIcon className="h-5 w-5 text-kala-accent" />
              Video Preview
            </CardTitle>
            <CardDescription>
              {generatedVideo ? "Your generated video" : "Video will appear here after generation"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!generatedVideo ? (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center h-[300px] text-center">
                <VideoIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No Video Generated Yet</h3>
                <p className="text-sm text-gray-400 max-w-md">
                  Fill in the form on the left and click "Generate Video" to create your AI video
                </p>
              </div>
            ) : (
              <Tabs defaultValue="preview">
                <TabsList className="mb-4">
                  <TabsTrigger value="preview">Video Preview</TabsTrigger>
                  <TabsTrigger value="storyboard">Storyboard</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="space-y-4">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    <img 
                      src={generatedVideo.thumbnail_url} 
                      alt="Video thumbnail" 
                      className="w-full h-full object-cover"
                    />
                    {generatedVideo.status === "processing" && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                        <Loader2 className="h-12 w-12 animate-spin mb-4" />
                        <h3 className="text-xl font-medium">Processing Your Video</h3>
                        <p className="text-sm opacity-80 mt-2">This may take a few minutes</p>
                        <div className="mt-4 flex items-center gap-2">
                          <ClockIcon className="h-4 w-4" />
                          <span className="text-sm">
                            Estimated completion: {new Date(generatedVideo.estimated_completion).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{prompt.substring(0, 50)}{prompt.length > 50 ? "..." : ""}</h3>
                      <p className="text-sm text-gray-500">
                        {style.charAt(0).toUpperCase() + style.slice(1)} • {duration} • {resolution}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled={generatedVideo.status === "processing"}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        className="bg-kala-primary hover:bg-kala-secondary"
                        size="sm"
                        onClick={saveToProject}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Save to Projects
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="storyboard">
                  <div className="border rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
                    <h3 className="font-medium mb-2">Video Storyboard</h3>
                    <div className="whitespace-pre-line text-sm">
                      {storyboard}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Examples Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6 text-kala-primary">Example Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Handloom Weaving Showcase",
              thumbnail: "https://placehold.co/400x225/5535dd/ffffff?text=Handloom+Weaving",
              style: "Documentary",
              duration: "60 seconds"
            },
            {
              title: "Pottery Making Process",
              thumbnail: "https://placehold.co/400x225/5535dd/ffffff?text=Pottery+Making",
              style: "Tutorial",
              duration: "90 seconds"
            },
            {
              title: "Jewelry Collection Display",
              thumbnail: "https://placehold.co/400x225/5535dd/ffffff?text=Jewelry+Collection",
              style: "Commercial",
              duration: "30 seconds"
            }
          ].map((example, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src={example.thumbnail} 
                  alt={example.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {example.duration}
                </div>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-medium">{example.title}</h3>
                <p className="text-sm text-gray-500">{example.style}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
