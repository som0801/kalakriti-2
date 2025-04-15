
import React from "react";
import BackButton from "@/components/ui/back-button";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Video, Mic, Languages, Type, Share, Check, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const VideoEnhancer = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploadStage, setUploadStage] = useState("upload"); // upload, enhancing, preview
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  
  const [languageOptions, setLanguageOptions] = useState([
    { name: "Hindi", selected: true },
    { name: "English", selected: true },
    { name: "Tamil", selected: false },
    { name: "Telugu", selected: false },
    { name: "Bengali", selected: false },
    { name: "Marathi", selected: false },
  ]);
  
  const [enhancementOptions, setEnhancementOptions] = useState({
    videoQuality: true,
    audioClarity: true,
    generateTitle: true,
    generateDescription: true
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL for the video
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setUploadStage("enhancing");
    }
  };
  
  const toggleLanguage = (index: number) => {
    const updatedOptions = [...languageOptions];
    updatedOptions[index].selected = !updatedOptions[index].selected;
    setLanguageOptions(updatedOptions);
  };
  
  const handleEnhancementOption = (option: keyof typeof enhancementOptions) => {
    setEnhancementOptions({
      ...enhancementOptions,
      [option]: !enhancementOptions[option]
    });
  };
  
  const handleNewUpload = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadStage("upload");
    setGeneratedTitle("");
    setGeneratedDescription("");
  };
  
  const handleEnhanceVideo = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a video file first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Get the selected languages
      const selectedLanguages = languageOptions
        .filter(lang => lang.selected)
        .map(lang => lang.name);
      
      if (selectedLanguages.length === 0) {
        toast({
          title: "No languages selected",
          description: "Please select at least one language for translation.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }
      
      // Prepare the video details
      const videoDetails = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        description: "Video uploaded for enhancement"
      };
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('enhance-video', {
        body: {
          videoDetails,
          enhancementOptions,
          languages: selectedLanguages
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log("Enhanced video data:", data);
      
      // Update the UI with the results
      setGeneratedTitle(data.title || "Enhanced Video");
      setGeneratedDescription(data.description || "Video enhanced successfully.");
      
      // Save to Supabase if user is logged in
      if (user) {
        await supabase
          .from('video_projects')
          .insert([{
            title: data.title || "Enhanced Video",
            description: data.description || "Video enhanced successfully.",
            prompt: "Video enhancement",
            status: "completed",
            video_url: data.video_url,
            thumbnail_url: data.thumbnail_url,
            user_id: user.id
          }]);
      }
      
      toast({
        title: "Video Enhanced Successfully",
        description: "Your video has been enhanced with AI.",
      });
      
      setUploadStage("preview");
      
    } catch (error) {
      console.error("Error enhancing video:", error);
      toast({
        title: "Enhancement Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneratedTitle(e.target.value);
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedDescription(e.target.value);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6 gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Video Translator</h1> {/* Changed page title */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Upload/Preview Area */}
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            {uploadStage === "upload" && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center h-80">
                <Video className="w-16 h-16 text-kala-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Upload Your Video</h3>
                <p className="text-gray-500 text-center mb-6">
                  Drag and drop your product video here or click to browse
                </p>
                <Label htmlFor="video-upload" className="cursor-pointer">
                  <div className="bg-kala-primary hover:bg-kala-secondary text-white font-medium py-2 px-4 rounded-md flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </div>
                  <Input 
                    id="video-upload" 
                    type="file" 
                    accept="video/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </Label>
                <p className="text-xs text-gray-500 mt-4">
                  Support for MP4, MOV, AVI up to 200MB (max 5 minutes)
                </p>
              </div>
            )}
            
            {uploadStage === "enhancing" && (
              <div className="border-2 border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center h-80">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-16 h-16 text-kala-primary mb-4 animate-spin" />
                    <h3 className="text-xl font-medium mb-2">Enhancing Your Video</h3>
                    <p className="text-gray-500 text-center mb-6">
                      Our AI is working its magic. This may take a few minutes...
                    </p>
                    <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
                      <div className="bg-kala-primary h-2.5 rounded-full w-2/3 animate-pulse"></div>
                    </div>
                  </>
                ) : (
                  <>
                    {previewUrl && (
                      <video 
                        className="w-full h-auto max-h-[240px] mb-4" 
                        controls
                        src={previewUrl}
                      ></video>
                    )}
                    <h3 className="text-xl font-medium mb-2">Ready to Enhance</h3>
                    <p className="text-gray-500 text-center mb-6">
                      Click the button below to start the enhancement process
                    </p>
                    <Button 
                      className="bg-kala-primary hover:bg-kala-secondary text-white"
                      onClick={handleEnhanceVideo}
                      disabled={isProcessing}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Enhance Video
                    </Button>
                  </>
                )}
              </div>
            )}
            
            {uploadStage === "preview" && previewUrl && (
              <div className="rounded-lg overflow-hidden">
                <video 
                  className="w-full h-auto max-h-[400px]" 
                  controls
                  src={previewUrl}
                ></video>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="video-title" className="text-sm font-medium">
                      AI Generated Title
                    </Label>
                    <Input 
                      id="video-title" 
                      value={generatedTitle}
                      onChange={handleTitleChange}
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="video-description" className="text-sm font-medium">
                      AI Generated Description
                    </Label>
                    <textarea 
                      id="video-description" 
                      value={generatedDescription}
                      onChange={handleDescriptionChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-24"
                    ></textarea>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="text-kala-primary border-kala-primary hover:bg-kala-light">
                      Download Enhanced
                    </Button>
                    <Button className="bg-kala-primary hover:bg-kala-secondary">
                      <Share className="w-4 h-4 mr-2" />
                      Share to Platforms
                    </Button>
                    <Button variant="ghost" onClick={handleNewUpload}>
                      Upload New Video
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Settings Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Enhancement Options</CardTitle>
            <CardDescription>Customize how AI enhances your video</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <Sparkles className="w-4 h-4 mr-2 text-kala-accent" />
                AI Enhancements
              </h3>
              <div className="space-y-2">
                {Object.entries(enhancementOptions).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <button
                      className={`w-5 h-5 rounded border ${
                        value ? "bg-kala-primary border-kala-primary text-white" : "bg-white border-gray-300"
                      } flex items-center justify-center mr-2`}
                      onClick={() => handleEnhancementOption(key as keyof typeof enhancementOptions)}
                    >
                      {value && <Check className="w-3 h-3" />}
                    </button>
                    <span className="text-sm">
                      {key === "videoQuality" ? "Enhance Video Quality" :
                       key === "audioClarity" ? "Improve Audio Clarity" :
                       key === "generateTitle" ? "Generate Catchy Title" :
                       "Generate Description"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <Languages className="w-4 h-4 mr-2 text-kala-accent" />
                Translation Languages
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {languageOptions.map((lang, index) => (
                  <div key={lang.name} className="flex items-center">
                    <button
                      className={`w-5 h-5 rounded border ${
                        lang.selected ? "bg-kala-primary border-kala-primary text-white" : "bg-white border-gray-300"
                      } flex items-center justify-center mr-2`}
                      onClick={() => toggleLanguage(index)}
                    >
                      {lang.selected && <Check className="w-3 h-3" />}
                    </button>
                    <span className="text-sm">{lang.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <Mic className="w-4 h-4 mr-2 text-kala-accent" />
                Voice Options
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Voice Clarity</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-4/5 h-2 bg-kala-primary rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Background Noise</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/4 h-2 bg-kala-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <Type className="w-4 h-4 mr-2 text-kala-accent" />
                Captions & Subtitles
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <button
                    className="w-5 h-5 rounded border bg-kala-primary border-kala-primary text-white flex items-center justify-center mr-2"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <span className="text-sm">Auto-generate captions</span>
                </div>
                <div className="flex items-center">
                  <button
                    className="w-5 h-5 rounded border bg-kala-primary border-kala-primary text-white flex items-center justify-center mr-2"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <span className="text-sm">Translate captions</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoEnhancer;
