import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Explore = () => {
  const { language, translatePage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Default content in English
  const defaultContent = {
    pageTitle: "Explore Traditional Crafts",
    pageSubtitle: "Discover the rich heritage of handmade crafts from across India",
    searchPlaceholder: "Search crafts, artisans, or locations...",
    viewAll: "View All",
  };

  const [content, setContent] = useState(defaultContent);

  const categories = [
    'All',
    'Handloom',
    'Pottery',
    'Woodcarving',
    'Metalwork',
    'Embroidery',
    'Leatherwork',
    'Papercraft',
    'Block Printing'
  ];

  // Curated artworks data
  const artworks = [
    {
      id: 1,
      title: 'Traditional Handloom Saree',
      artist: 'Meera Devi',
      category: 'Handloom',
      image: '/images/handicrafts/handloom.svg',
      likes: 856
    },
    {
      id: 2,
      title: 'Earthen Pottery Collection',
      artist: 'Rajesh Kumar',
      category: 'Pottery',
      image: '/images/handicrafts/pottery.svg',
      likes: 742
    },
    {
      id: 3,
      title: 'Carved Wooden Panel',
      artist: 'Suresh Patel',
      category: 'Woodcarving',
      image: '/images/handicrafts/woodcarving.svg',
      likes: 923
    },
    {
      id: 4,
      title: 'Brass Metal Art',
      artist: 'Anita Singh',
      category: 'Metalwork',
      image: '/images/handicrafts/metalwork.svg',
      likes: 678
    },
    {
      id: 5,
      title: 'Phulkari Embroidery',
      artist: 'Priya Sharma',
      category: 'Embroidery',
      image: '/images/handicrafts/embroidery.svg',
      likes: 845
    },
    {
      id: 6,
      title: 'Leather Craft Bag',
      artist: 'Mohammed Khan',
      category: 'Leatherwork',
      image: '/images/handicrafts/leatherwork.svg',
      likes: 567
    },
    {
      id: 7,
      title: 'Traditional Paper Art',
      artist: 'Lakshmi Rao',
      category: 'Papercraft',
      image: '/images/handicrafts/papercraft.svg',
      likes: 634
    },
    {
      id: 8,
      title: 'Block Printed Textile',
      artist: 'Arjun Mehta',
      category: 'Block Printing',
      image: '/images/handicrafts/blockprinting.svg',
      likes: 789
    }
  ];

  useEffect(() => {
    const updateTranslations = async () => {
      if (language === 'english') {
        setContent(defaultContent);
      } else {
        const translatedContent = await translatePage(defaultContent);
        setContent(translatedContent as typeof defaultContent);
      }
    };
    
    updateTranslations();
  }, [language, translatePage]);

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || artwork.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-kala-primary mb-2">{content.pageTitle}</h1>
        <p className="text-lg text-gray-600">{content.pageSubtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={content.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Button size="icon" variant="outline" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredArtworks.map((artwork) => (
          <Card key={artwork.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-64 object-cover transition-transform group-hover:scale-105"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 transition-colors"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1 text-kala-primary">{artwork.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{artwork.artist}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-kala-light text-kala-primary">
                  {artwork.category}
                </Badge>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Heart className="h-4 w-4 fill-current" /> {artwork.likes}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Explore;
