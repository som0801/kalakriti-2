import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const Explore = () => {
  const { language, translatePage } = useLanguage();
  
  // Default content in English
  const defaultContent = {
    pageTitle: "Explore Traditional Crafts",
    pageSubtitle: "Discover the rich heritage of handmade crafts from across India",
    searchPlaceholder: "Search crafts, artisans, or locations...",
    featuredTitle: "Featured Documentary",
    viewAll: "View All",
    featuredSubtitle: "The Dying Art of Handloom",
    featuredDescription: "A look at the challenges faced by traditional handloom weavers in modern times",
    watchDocumentary: "Watch Documentary",
    categoriesTitle: "Browse by Craft Type",
    handloom: "Handloom",
    pottery: "Pottery",
    woodcarving: "Woodcarving",
    metalwork: "Metalwork",
    embroidery: "Embroidery",
    leatherwork: "Leatherwork",
    papercraft: "Papercraft",
    blocPrinting: "Block Printing"
  };
  
  // State to hold translated content
  const [content, setContent] = useState(defaultContent);
  
  // Translate content when language changes
  useEffect(() => {
    const updateTranslations = async () => {
      if (language === 'english') {
        setContent(defaultContent);
      } else {
        const translatedContent = await translatePage(defaultContent);
        // Fix TypeScript error by ensuring correct type
        setContent(translatedContent as typeof defaultContent);
      }
    };
    
    updateTranslations();
  }, [language, translatePage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{content.pageTitle}</h1>
      <p className="text-lg">{content.pageSubtitle}</p>
      <input
        type="text"
        placeholder={content.searchPlaceholder}
        className="mt-4 p-2 border rounded"
      />
      <h2 className="mt-6 text-2xl font-semibold">{content.featuredTitle}</h2>
      <p className="text-md">{content.featuredSubtitle}</p>
      <p className="text-sm">{content.featuredDescription}</p>
      <button className="mt-2 p-2 bg-blue-500 text-white rounded">
        {content.watchDocumentary}
      </button>
      <h2 className="mt-6 text-2xl font-semibold">{content.categoriesTitle}</h2>
      <ul className="list-disc pl-5">
        <li>{content.handloom}</li>
        <li>{content.pottery}</li>
        <li>{content.woodcarving}</li>
        <li>{content.metalwork}</li>
        <li>{content.embroidery}</li>
        <li>{content.leatherwork}</li>
        <li>{content.papercraft}</li>
        <li>{content.blocPrinting}</li>
      </ul>
    </div>
  );
};

export default Explore;
