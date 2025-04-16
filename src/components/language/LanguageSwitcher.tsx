
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLanguage, Language } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isChanging, setIsChanging] = useState(false);

  const languages: { value: Language; label: string }[] = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिंदी (Hindi)' },
    { value: 'tamil', label: 'தமிழ் (Tamil)' },
    { value: 'telugu', label: 'తెలుగు (Telugu)' },
    { value: 'bengali', label: 'বাংলা (Bengali)' },
    { value: 'marathi', label: 'मराठी (Marathi)' },
  ];

  const handleLanguageChange = async (value: string) => {
    try {
      setIsChanging(true);
      setLanguage(value as Language);
      toast({
        title: "Language Changed",
        description: `The language has been changed to ${
          languages.find(lang => lang.value === value)?.label || value
        }`,
      });
    } catch (error) {
      console.error("Error changing language:", error);
      toast({
        title: "Error",
        description: "Failed to change language. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChanging(false);
      setOpen(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 rounded-full relative" 
          aria-label={t('language')}
          disabled={isChanging}
        >
          <Globe className="h-5 w-5" />
          {language !== 'english' && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-kala-primary rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuRadioGroup 
          value={language} 
          onValueChange={handleLanguageChange}
        >
          {languages.map((lang) => (
            <DropdownMenuRadioItem 
              key={lang.value} 
              value={lang.value} 
              className="cursor-pointer"
            >
              {lang.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
