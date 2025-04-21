
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { CheckIcon, Languages, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";

interface TranslationButtonProps {
  text: string;
  onTranslated?: (translatedText: string) => void;
  size?: "default" | "sm" | "lg" | "icon" | null;
  variant?: "default" | "outline" | "ghost" | null;
  iconOnly?: boolean;
}

const languageOptions = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
  { value: "Arabic", label: "Arabic" },
  { value: "Russian", label: "Russian" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Bengali", label: "Bengali" },
  { value: "Urdu", label: "Urdu" },
  { value: "Tamil", label: "Tamil" },
  { value: "Telugu", label: "Telugu" },
  { value: "Marathi", label: "Marathi" },
  { value: "Gujarati", label: "Gujarati" },
];

export function TranslationButton({
  text,
  onTranslated,
  size = "sm",
  variant = "outline",
  iconOnly = false
}: TranslationButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const { translate, loading } = useTranslation();

  const handleTranslate = async (language: string) => {
    setSelectedLanguage(language);
    setOpen(false);
    
    const translatedText = await translate({
      text,
      targetLanguage: language,
      onSuccess: (result) => {
        toast.success(`Translated to ${language}`);
        if (onTranslated) onTranslated(result);
      }
    });
    
    return translatedText;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          disabled={loading}
          className={cn("gap-1", iconOnly ? "px-2" : "")}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Languages className="h-4 w-4" />
          )}
          {!iconOnly && <span>Translate</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-48" align="end">
        <Command>
          <CommandGroup className="max-h-60 overflow-auto">
            {languageOptions.map((language) => (
              <CommandItem
                key={language.value}
                onSelect={() => handleTranslate(language.value)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span>{language.label}</span>
                {selectedLanguage === language.value && (
                  <CheckIcon className="h-4 w-4 ml-auto text-green-500" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
