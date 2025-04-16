
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef
} from 'react';

// Make sure Language type is exported
export type Language = 'english' | 'hindi' | 'tamil' | 'telugu' | 'bengali' | 'marathi';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  isTranslating: boolean;
}

interface Translation {
  [key: string]: {
    [language in Language]?: string;
  };
}

const defaultTranslations: Translation = {
  "home": {
    "english": "Home",
    "hindi": "होम",
    "tamil": "வீடு",
    "telugu": "హోమ్",
    "bengali": "হোম",
    "marathi": "घर"
  },
  "explore": {
    "english": "Explore",
    "hindi": "एक्सप्लोर",
    "tamil": "ஆராயுங்கள்",
    "telugu": "అన్వేషించండి",
    "bengali": "অনুসন্ধান",
    "marathi": "एक्सप्लोर करा"
  },
  "videoEnhancer": {
    "english": "Video Enhancer",
    "hindi": "वीडियो एन्हांसर",
    "tamil": "வீடியோ மேம்படுத்தி",
    "telugu": "వీడియో మెరుగుపరచు",
    "bengali": "ভিডিও বর্ধক",
    "marathi": "व्हिडिओ वर्धक"
  },
  "videoGenerator": {
    "english": "Video Generator",
    "hindi": "वीडियो जेनरेटर",
    "tamil": "வீடியோ ஜெனரேட்டர்",
    "telugu": "వీడియో జనరేటర్",
    "bengali": "ভিডিও জেনারেটর",
    "marathi": "व्हिडिओ जनरेटर"
  },
  "adGenerator": {
    "english": "Ad Generator",
    "hindi": "विज्ञापन जेनरेटर",
    "tamil": "விளம்பர ஜெனரேட்டர்",
    "telugu": "ప్రకటన జనరేటర్",
    "bengali": "বিজ্ঞাপন জেনারেটর",
    "marathi": "जाहिरात जनरेटर"
  },
  "community": {
    "english": "Community",
    "hindi": "समुदाय",
    "tamil": "சமூகம்",
    "telugu": "సంఘం",
    "bengali": "সম্প্রদায়",
    "marathi": "समुदाय"
  },
  "profile": {
    "english": "Profile",
    "hindi": "प्रोफ़ाइल",
    "tamil": "சுயவிவரம்",
    "telugu": "ప్రొఫైల్",
    "bengali": "প্রোফাইল",
    "marathi": "प्रोफाइल"
  },
  "logout": {
    "english": "Logout",
    "hindi": "लोग आउट",
    "tamil": "வெளியேறு",
    "telugu": "నిష్క్రమించు",
    "bengali": "লগ আউট",
    "marathi": "लॉग आउट"
  },
  "artistProfile": {
    "english": "Artist Profile",
    "hindi": "कलाकार प्रोफाइल",
    "tamil": "கலைஞர் சுயவிவரம்",
    "telugu": "కళాకారుడి ప్రొఫైల్",
    "bengali": "শিল্পী প্রোফাইল",
    "marathi": "कलाकार प्रोफाइल"
  },
  "editProfile": {
    "english": "Edit Profile",
    "hindi": "प्रोफ़ाइल संपादित करें",
    "tamil": "சுயவிவரத்தை திருத்து",
    "telugu": "ప్రొఫైల్‌ను సవరించండి",
    "bengali": "প্রোফাইল সম্পাদনা করুন",
    "marathi": "प्रोफाइल संपादित करा"
  },
  "save": {
    "english": "Save",
    "hindi": "सहेजें",
    "tamil": "சேமிக்க",
    "telugu": "సేవ్",
    "bengali": "সংরক্ষণ",
    "marathi": "जतन करा"
  },
  "profileOptions": {
    "english": "Profile Options",
    "hindi": "प्रोफ़ाइल विकल्प",
    "tamil": "சுயவிவர விருப்பங்கள்",
    "telugu": "ప్రొఫైల్ ఎంపికలు",
    "bengali": "প্রোফাইল অপশন",
    "marathi": "प्रोफाइल पर्याय"
  },
  "changeProfilePicture": {
    "english": "Change Profile Picture",
    "hindi": "प्रोफ़ाइल चित्र बदलें",
    "tamil": "சுயவிவரப் படத்தை மாற்றுக",
    "telugu": "ప్రొఫైల్ చిత్రాన్ని మార్చండి",
    "bengali": "প্রোফাইল ছবি পরিবর্তন করুন",
    "marathi": "प्रोफाइल चित्र बदला"
  },
  "fullName": {
    "english": "Full Name",
    "hindi": "पूरा नाम",
    "tamil": "முழு பெயர்",
    "telugu": "పూర్తి పేరు",
    "bengali": "পুরো নাম",
    "marathi": "पूर्ण नाव"
  },
  "artworkType": {
    "english": "Artwork Type",
    "hindi": "कलाकृति प्रकार",
    "tamil": "கலைப்படைப்பு வகை",
    "telugu": "కళాఖండం రకం",
    "bengali": "শিল্পকর্মের প্রকার",
    "marathi": "कलाकृती प्रकार"
  },
  "experience": {
    "english": "Experience",
    "hindi": "अनुभव",
    "tamil": "அனுபவம்",
    "telugu": "అనుభవం",
    "bengali": "অভিজ্ঞতা",
    "marathi": "अनुभव"
  },
  "artistDetails": {
    "english": "Artist Details",
    "hindi": "कलाकार विवरण",
    "tamil": "கலைஞர் விவரங்கள்",
    "telugu": "కళాకారుడి వివరాలు",
    "bengali": "শিল্পী বিবরণ",
    "marathi": "कलाकार तपशील"
  },
  "bio": {
    "english": "Bio",
    "hindi": "बायो",
    "tamil": "சுயசரிதை",
    "telugu": "బయో",
    "bengali": "বায়ো",
    "marathi": "बायो"
  },
  "location": {
    "english": "Location",
    "hindi": "स्थान",
    "tamil": "இடம்",
    "telugu": "స్థానం",
    "bengali": "অবস্থান",
    "marathi": "ठिकाण"
  },
  "contactNumber": {
    "english": "Contact Number",
    "hindi": "संपर्क नंबर",
    "tamil": "தொடர்பு எண்",
    "telugu": "సంప్రదింపు సంఖ్య",
    "bengali": "যোগাযোগ নম্বর",
    "marathi": "संपर्क क्रमांक"
  },
  "email": {
    "english": "Email",
    "hindi": "ईमेल",
    "tamil": "மின்னஞ்சல்",
    "telugu": "ఇమెయిల్",
    "bengali": "ইমেইল",
    "marathi": "ईमेल"
  },
  "preferredLanguage": {
    "english": "Preferred Language",
    "hindi": "पसंदीदा भाषा",
    "tamil": "விருப்பமான மொழி",
    "telugu": "ఇష్టమైన భాష",
    "bengali": "পছন্দের ভাষা",
    "marathi": "पसंतीची भाषा"
  },
  "skills": {
    "english": "Skills",
    "hindi": "कौशल",
    "tamil": "திறன்கள்",
    "telugu": "నైపుణ్యాలు",
    "bengali": "দক্ষতা",
    "marathi": "कौशल्ये"
  },
  "myPortfolio": {
    "english": "My Portfolio",
    "hindi": "मेरा पोर्टफोलियो",
    "tamil": "எனது போர்ட்ஃபோலியோ",
    "telugu": "నా పోర్ట్‌ఫోలియో",
    "bengali": "আমার পোর্টফোলিও",
    "marathi": "माझे पोर्टफोलिओ"
  },
  "viewAllWork": {
    "english": "View All Work",
    "hindi": "सभी काम देखें",
    "tamil": "எல்லா வேலையையும் காட்டு",
    "telugu": "అన్ని పనిని చూడండి",
    "bengali": "সমস্ত কাজ দেখুন",
    "marathi": "सर्व काम पहा"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Replace direct process.env access with import.meta.env for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>('english');
  const [isTranslating, setTranslating] = useState(false);
  const translationCache = useRef(new Map<string, string>()).current;

  // Function to translate text using AI
  const translateWithAI = useCallback(async (text: string, targetLanguage: Language): Promise<string> => {
    // If the target language is English, just return the original text
    if (targetLanguage === 'english') return text;
    
    // Check cache first
    const cacheKey = `${text}_${targetLanguage}`;
    const cachedTranslation = translationCache.get(cacheKey);
    if (cachedTranslation) return cachedTranslation;

    try {
      setTranslating(true);
      
      // Use direct URL if no environment variables are available
      const apiUrl = supabaseUrl ? `${supabaseUrl}/functions/v1/ai-translate` : 'https://xihrtxeuuswsucyjetbu.supabase.co/functions/v1/ai-translate';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          text,
          targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      const translatedText = data.translatedText || text;

      // Cache the result
      translationCache.set(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    } finally {
      setTranslating(false);
    }
  }, [translationCache]);

  const t = useCallback((key: string): string => {
    const translation = defaultTranslations[key]?.[language as Language];
    return translation !== undefined ? translation : key;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
    isTranslating
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
