
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

interface TranslationCardProps {
  originalText: string;
  onTranslate?: (translatedText: string) => void;
}

export const TranslationCard = ({
  originalText,
  onTranslate
}: TranslationCardProps) => {
  const [isTranslated, setIsTranslated] = useState(false);
  const [displayText, setDisplayText] = useState(originalText);
  const { translate, loading } = useTranslation();
  const { toast } = useToast();
  const { language, translateText } = useLanguage();
  
  const [buttonText, setButtonText] = useState({
    translate: "Translate",
    original: "Show Original"
  });

  useEffect(() => {
    // Update button text based on language
    const updateButtonText = async () => {
      if (language === 'english') {
        setButtonText({
          translate: "Translate",
          original: "Show Original"
        });
      } else {
        const [translateBtn, originalBtn] = await Promise.all([
          translateText("Translate"),
          translateText("Show Original")
        ]);
        
        setButtonText({
          translate: translateBtn,
          original: originalBtn
        });
      }
    };
    
    updateButtonText();
  }, [language, translateText]);

  // Auto-translate when language changes (except for English)
  useEffect(() => {
    const autoTranslate = async () => {
      if (language !== 'english') {
        if (!isTranslated) {
          try {
            const result = await translateText(originalText);
            setDisplayText(result);
            setIsTranslated(true);
            if (onTranslate) {
              onTranslate(result);
            }
          } catch (error) {
            console.error("Auto-translation error:", error);
            toast({
              title: "Translation Error",
              description: "Could not auto-translate text. Using original text instead.",
              variant: "destructive"
            });
          }
        }
      } else {
        // Reset to original text when language is English
        setDisplayText(originalText);
        setIsTranslated(false);
      }
    };
    
    autoTranslate();
  }, [language, originalText, translateText]);

  const handleToggle = async () => {
    if (isTranslated) {
      // Show original
      setDisplayText(originalText);
      setIsTranslated(false);
    } else {
      // Translate
      try {
        const result = await translate({
          text: originalText,
          targetLanguage: language
        });
        
        if (result) {
          setDisplayText(result);
          setIsTranslated(true);
          if (onTranslate) {
            onTranslate(result);
          }
        }
      } catch (error) {
        console.error("Translation error:", error);
        toast({
          title: "Translation Error",
          description: "Could not translate text. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-md border">
      <div className="mb-2 flex justify-between items-center">
        <div className="text-sm font-medium text-gray-500">
          {isTranslated ? language.charAt(0).toUpperCase() + language.slice(1) : "Original"}
        </div>
        <Button
          onClick={handleToggle}
          variant="outline"
          size="sm"
          className="text-xs h-8 px-2 flex items-center"
          disabled={loading}
        >
          <Languages className="mr-1 h-3 w-3" />
          {isTranslated ? buttonText.original : buttonText.translate}
        </Button>
      </div>
      <p className="text-sm">{displayText}</p>
    </div>
  );
};
