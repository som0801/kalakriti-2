
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'english' | 'hindi' | 'tamil' | 'telugu' | 'bengali' | 'marathi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const translations: Record<Language, Record<string, string>> = {
  english: {
    home: 'Home',
    explore: 'Explore',
    videoEnhancer: 'Video Enhancer & Translator',
    videoGenerator: 'Video Generator',
    adGenerator: 'Ad Generator',
    community: 'Community',
    profile: 'Profile',
    logout: 'Log out',
    changeProfilePicture: 'Change Profile Picture',
    save: 'Save',
    language: 'Language',
    welcomeToKalakriti: 'Welcome to Kalakriti',
    artistProfile: 'Artist Profile',
    editProfile: 'Edit Profile',
    fullName: 'Full Name',
    bio: 'Bio',
    location: 'Location',
    contactNumber: 'Contact Number',
    email: 'Email',
    preferredLanguage: 'Preferred Language',
    artistDetails: 'Artist Details',
    artworkType: 'Artwork Type',
    experience: 'Experience Level',
    myPortfolio: 'My Portfolio',
    viewAllWork: 'View All Work',
    skills: 'Skills'
  },
  hindi: {
    home: 'होम',
    explore: 'एक्सप्लोर',
    videoEnhancer: 'वीडियो एनहांसर और अनुवादक',
    videoGenerator: 'वीडियो जनरेटर',
    adGenerator: 'एड जनरेटर',
    community: 'समुदाय',
    profile: 'प्रोफाइल',
    logout: 'लॉग आउट',
    changeProfilePicture: 'प्रोफाइल चित्र बदलें',
    save: 'सेव करें',
    language: 'भाषा',
    welcomeToKalakriti: 'कलाकृति में आपका स्वागत है',
    artistProfile: 'कलाकार प्रोफाइल',
    editProfile: 'प्रोफाइल संपादित करें',
    fullName: 'पूरा नाम',
    bio: 'बायो',
    location: 'स्थान',
    contactNumber: 'संपर्क नंबर',
    email: 'ईमेल',
    preferredLanguage: 'पसंदीदा भाषा',
    artistDetails: 'कलाकार विवरण',
    artworkType: 'कला प्रकार',
    experience: 'अनुभव स्तर',
    myPortfolio: 'मेरा पोर्टफोलियो',
    viewAllWork: 'सभी कार्य देखें',
    skills: 'कौशल'
  },
  tamil: {
    home: 'முகப்பு',
    explore: 'ஆராய்க',
    videoEnhancer: 'வீடியோ மேம்படுத்தி மற்றும் மொழிபெயர்ப்பாளர்',
    videoGenerator: 'வீடியோ உருவாக்கி',
    adGenerator: 'விளம்பர உருவாக்கி',
    community: 'சமூகம்',
    profile: 'சுயவிவரம்',
    logout: 'வெளியேறு',
    changeProfilePicture: 'சுயவிவர படத்தை மாற்று',
    save: 'சேமி',
    language: 'மொழி',
    welcomeToKalakriti: 'கலாகிருதிக்கு வரவேற்கிறோம்',
    artistProfile: 'கலைஞர் சுயவிவரம்',
    editProfile: 'சுயவிவரத்தைத் திருத்து',
    fullName: 'முழு பெயர்',
    bio: 'சுயவிவரம்',
    location: 'இடம்',
    contactNumber: 'தொடர்பு எண்',
    email: 'மின்னஞ்சல்',
    preferredLanguage: 'விருப்பமான மொழி',
    artistDetails: 'கலைஞர் விவரங்கள்',
    artworkType: 'கலைப்படைப்பு வகை',
    experience: 'அனுபவ நிலை',
    myPortfolio: 'எனது படைப்புகள்',
    viewAllWork: 'அனைத்து வேலைகளையும் காண்க',
    skills: 'திறன்கள்'
  },
  telugu: {
    home: 'హోమ్',
    explore: 'అన్వేషించండి',
    videoEnhancer: 'వీడియో ఎన్హాన్సర్ & అనువాదకుడు',
    videoGenerator: 'వీడియో జనరేటర్',
    adGenerator: 'యాడ్ జనరేటర్',
    community: 'కమ్యూనిటీ',
    profile: 'ప్రొఫైల్',
    logout: 'లాగ్ అవుట్',
    changeProfilePicture: 'ప్రొఫైల్ చిత్రాన్ని మార్చండి',
    save: 'సేవ్ చేయండి',
    language: 'భాష',
    welcomeToKalakriti: 'కళాకృతికి స్వాగతం',
    artistProfile: 'కళాకారుని ప్రొఫైల్',
    editProfile: 'ప్రొఫైల్‌ని సవరించండి',
    fullName: 'పూర్తి పేరు',
    bio: 'బయో',
    location: 'ప్రాంతం',
    contactNumber: 'సంప్రదింపు నంబర్',
    email: 'ఇమెయిల్',
    preferredLanguage: 'ఇష్టమైన భాష',
    artistDetails: 'కళాకారుని వివరాలు',
    artworkType: 'కళా రకం',
    experience: 'అనుభవ స్థాయి',
    myPortfolio: 'నా పోర్ట్‌ఫోలియో',
    viewAllWork: 'అన్ని పనులను చూడండి',
    skills: 'నైపుణ్యాలు'
  },
  bengali: {
    home: 'হোম',
    explore: 'এক্সপ্লোর',
    videoEnhancer: 'ভিডিও এনহ্যান্সার এবং অনুবাদক',
    videoGenerator: 'ভিডিও জেনারেটর',
    adGenerator: 'অ্যাড জেনারেটর',
    community: 'কমিউনিটি',
    profile: 'প্রোফাইল',
    logout: 'লগ আউট',
    changeProfilePicture: 'প্রোফাইল ছবি পরিবর্তন করুন',
    save: 'সংরক্ষণ করুন',
    language: 'ভাষা',
    welcomeToKalakriti: 'কলাকৃতিতে স্বাগতম',
    artistProfile: 'শিল্পীর প্রোফাইল',
    editProfile: 'প্রোফাইল সম্পাদনা করুন',
    fullName: 'পুরো নাম',
    bio: 'জীবনী',
    location: 'অবস্থান',
    contactNumber: 'যোগাযোগের নম্বর',
    email: 'ইমেইল',
    preferredLanguage: 'পছন্দের ভাষা',
    artistDetails: 'শিল্পীর বিবরণ',
    artworkType: 'শিল্পকর্মের ধরন',
    experience: 'অভিজ্ঞতার স্তর',
    myPortfolio: 'আমার পোর্টফোলিও',
    viewAllWork: 'সমস্ত কাজ দেখুন',
    skills: 'দক্ষতা'
  },
  marathi: {
    home: 'होम',
    explore: 'एक्सप्लोर',
    videoEnhancer: 'व्हिडिओ एनहांसर आणि अनुवादक',
    videoGenerator: 'व्हिडिओ जनरेटर',
    adGenerator: 'अ‍ॅड जनरेटर',
    community: 'कम्युनिटी',
    profile: 'प्रोफाइल',
    logout: 'लॉग आउट',
    changeProfilePicture: 'प्रोफाइल फोटो बदला',
    save: 'सेव्ह करा',
    language: 'भाषा',
    welcomeToKalakriti: 'कलाकृती मध्ये आपले स्वागत आहे',
    artistProfile: 'कलाकाराची प्रोफाइल',
    editProfile: 'प्रोफाइल संपादित करा',
    fullName: 'पूर्ण नाव',
    bio: 'बायो',
    location: 'स्थान',
    contactNumber: 'संपर्क क्रमांक',
    email: 'ईमेल',
    preferredLanguage: 'पसंतीची भाषा',
    artistDetails: 'कलाकाराचे तपशील',
    artworkType: 'कलाकृती प्रकार',
    experience: 'अनुभव स्तर',
    myPortfolio: 'माझे पोर्टफोलिओ',
    viewAllWork: 'सर्व कामे पहा',
    skills: 'कौशल्ये'
  }
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    return (savedLanguage as Language) || 'english';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
