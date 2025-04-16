
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages, CornerDownLeft, Copy, Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { TranslationButton } from "@/components/ui/translation-button";
import { Badge } from "@/components/ui/badge";

interface TranslationCardProps {
  originalText: string;
  showControls?: boolean;
  className?: string;
}

export function TranslationCard({ 
  originalText, 
  showControls = true,
  className = "" 
}: TranslationCardProps) {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const handleTranslated = (text: string, lang?: string) => {
    setTranslatedText(text);
    if (lang) setLanguage(lang);
  };
  
  const handleCopy = async () => {
    if (!translatedText) return;
    
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleReset = () => {
    setTranslatedText(null);
    setLanguage(null);
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4 space-y-4">
        {translatedText ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                Translated to {language}
              </Badge>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="text-sm">
              {translatedText}
            </div>
            
            {showControls && (
              <div className="flex justify-end pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={handleReset}
                >
                  <CornerDownLeft className="h-3 w-3 mr-1" />
                  Show Original
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm">
            {originalText}
          </div>
        )}
      </CardContent>
      
      {showControls && !translatedText && (
        <CardFooter className="px-4 py-2 bg-gray-50 flex justify-end">
          <TranslationButton 
            text={originalText}
            onTranslated={(text) => handleTranslated(text)}
            iconOnly={false}
          />
        </CardFooter>
      )}
    </Card>
  );
}
