
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Video, FilmIcon, Wand2 } from "lucide-react";
import BackButton from "@/components/ui/back-button";

const videoFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  style: z.string({
    required_error: "Please select a video style.",
  }),
  duration: z.string().default("30"),
  resolution: z.string().default("1080p"),
});

type VideoFormValues = z.infer<typeof videoFormSchema>;

const defaultValues: Partial<VideoFormValues> = {
  title: "",
  description: "",
  style: "",
  duration: "30",
  resolution: "1080p",
};

const VideoGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [generatedStoryboard, setGeneratedStoryboard] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("input");

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: VideoFormValues) => {
    setIsGenerating(true);
    
    try {
      // Simulate API call for video generation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Simulate generated storyboard
      const storyboardImages = [
        "https://images.unsplash.com/photo-1561211974-8a5dd9663e85?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1609531031138-6cc6705e417b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1609085518053-eade9369e1c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1594642451437-f9bd45052301?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      ];
      
      setGeneratedStoryboard(storyboardImages);
      setGeneratedVideo("https://static.videezy.com/system/resources/previews/000/037/192/original/Busy_indian_street_with_traffic_people_1080p.mp4");
      setActiveTab("preview");
      
      toast({
        title: "Video generated successfully!",
        description: "Your AI video has been created based on your input.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating your video. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex items-center mb-6 gap-4">
        <BackButton />
        <div>
          <h1 className="text-2xl font-bold text-kala-primary">AI Video Generator</h1>
          <p className="text-gray-600">Create professional videos from your descriptions</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="input" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Create Video
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!generatedVideo}>
            <Video className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-0">
          <Card className="mx-auto">
            <CardHeader>
              <CardTitle>Create AI-Generated Video</CardTitle>
              <CardDescription>
                Describe your video and our AI will bring it to life
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a title for your video" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be used as the title of your generated video.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what you want in your video in detail..."
                            className="min-h-32 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be as detailed as possible for better results. Include setting, actions, objects, and mood.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visual Style</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Indian Art Styles</SelectLabel>
                                <SelectItem value="cinematic">Cinematic</SelectItem>
                                <SelectItem value="madhubani">Madhubani Art</SelectItem>
                                <SelectItem value="miniature">Miniature Painting</SelectItem>
                                <SelectItem value="warli">Warli Art</SelectItem>
                                <SelectItem value="kerala-mural">Kerala Mural</SelectItem>
                                <SelectItem value="documentary">Documentary</SelectItem>
                                <SelectItem value="3d-animation">3D Animation</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (seconds)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15">15 seconds</SelectItem>
                              <SelectItem value="30">30 seconds</SelectItem>
                              <SelectItem value="60">60 seconds</SelectItem>
                              <SelectItem value="90">90 seconds</SelectItem>
                              <SelectItem value="120">2 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="resolution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resolution</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select resolution" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="720p">HD (720p)</SelectItem>
                              <SelectItem value="1080p">Full HD (1080p)</SelectItem>
                              <SelectItem value="4k">4K Ultra HD</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-kala-primary hover:bg-kala-secondary flex items-center gap-2"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating Video...
                      </>
                    ) : (
                      <>
                        <FilmIcon className="h-4 w-4" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          {generatedVideo && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{form.getValues().title}</CardTitle>
                  <CardDescription>
                    {form.getValues().description.substring(0, 100)}...
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md overflow-hidden bg-black aspect-video">
                    <video 
                      src={generatedVideo} 
                      controls 
                      className="w-full h-full object-contain"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Video Details:</h3>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li><span className="font-medium">Style:</span> {form.getValues().style}</li>
                      <li><span className="font-medium">Duration:</span> {form.getValues().duration} seconds</li>
                      <li><span className="font-medium">Resolution:</span> {form.getValues().resolution}</li>
                    </ul>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => setActiveTab("input")}>Edit Input</Button>
                    <Button variant="outline">Download Video</Button>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generated Storyboard</CardTitle>
                  <CardDescription>
                    Key frames from your generated video
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {generatedStoryboard.map((image, index) => (
                      <div key={index} className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={image} 
                          alt={`Frame ${index + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoGenerator;
