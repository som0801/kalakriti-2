
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";  // Add this import
import BackButton from "@/components/ui/back-button";
import { TranslationButton } from "@/components/ui/translation-button";
import { TranslationCard } from "@/components/ui/translation-card";
import { useUserPreferences } from "@/hooks/useUserPreferences";

const samplePosts = [
  {
    id: 1,
    title: "Traditional Bandhani Techniques",
    content: "Bandhani is a traditional tie-dye textile art from Rajasthan and Gujarat in India. It involves tying small points of cloth with thread to create intricate patterns before dyeing. The name comes from the Hindi word 'bandhan' which means tying up. This ancient art form dates back to over 5000 years and continues to be a vital part of cultural identity and traditional craftsmanship in India."
  },
  {
    id: 2,
    title: "The Art of Madhubani Painting",
    content: "Madhubani painting, also known as Mithila painting, is a style of Indian painting practiced in the Mithila region of Bihar. These paintings are characterized by complex geometrical patterns and depict scenes from nature and religious motifs. Traditionally done on freshly plastered mud walls of huts, they are now also done on cloth, handmade paper and canvas. The paintings are known for vibrant colors and distinctive geometric patterns."
  },
  {
    id: 3,
    title: "Preserving the Legacy of Brass Work",
    content: "Brass work in India has a rich heritage dating back to ancient times. It involves intricate craftsmanship where brass sheets are molded, etched, and embossed to create beautiful artifacts. From decorative items to functional utensils, brass work serves both aesthetic and practical purposes. Today, artisans are working to preserve these traditional techniques while finding contemporary applications for their craft."
  }
];

const TranslationPage = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const { preferences } = useUserPreferences();
  
  const handleTranslation = (result: string) => {
    setTranslatedText(result);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex items-center mb-6">
        <BackButton />
        <div className="ml-2">
          <h1 className="text-2xl font-bold text-kala-primary">Translation Tool</h1>
          <p className="text-gray-600">Translate content to multiple languages</p>
        </div>
      </div>
      
      <Tabs defaultValue="tool" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="tool">Translation Tool</TabsTrigger>
          <TabsTrigger value="examples">Example Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tool" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Translate Text</CardTitle>
              <CardDescription>
                Enter the text you want to translate and select the target language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea 
                  placeholder="Enter text to translate..." 
                  className="min-h-[120px]"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <TranslationButton 
                  text={inputText} 
                  onTranslated={handleTranslation}
                  variant="default"
                  size="default"
                />
              </div>
              
              {translatedText && (
                <Card className="mt-4 bg-gray-50 border-gray-200">
                  <CardContent className="pt-4">
                    <h3 className="text-sm font-medium mb-2">Translated Text:</h3>
                    <p className="text-sm">{translatedText}</p>
                  </CardContent>
                </Card>
              )}
              
              <div className="mt-4 text-xs text-gray-500">
                <p>Default languages from your preferences:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {preferences?.default_languages?.map((lang: string) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="examples" className="mt-6">
          <div className="grid gap-6">
            {samplePosts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <TranslationCard originalText={post.content} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TranslationPage;
