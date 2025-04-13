import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Send, MapPin, Clock, Search, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  location: string;
  craft: string;
  lastSeen: string;
  online: boolean;
  unreadCount: number;
}

const initialContacts: Contact[] = [
  {
    id: 1,
    name: "Rajat Mehta",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=250",
    location: "Jodhpur, Rajasthan",
    craft: "Blue Pottery",
    lastSeen: "2 min ago",
    online: true,
    unreadCount: 3
  },
  {
    id: 2,
    name: "Meena Kumari",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250",
    location: "Kutch, Gujarat",
    craft: "Bandhani",
    lastSeen: "1 hour ago",
    online: false,
    unreadCount: 0
  },
  {
    id: 3,
    name: "Karthik Iyer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250",
    location: "Thanjavur, Tamil Nadu",
    craft: "Bronze Sculptures",
    lastSeen: "3 hours ago",
    online: true,
    unreadCount: 1
  },
  {
    id: 4,
    name: "Lakshmi Devi",
    avatar: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=250",
    location: "Srikalahasti, Andhra Pradesh",
    craft: "Kalamkari",
    lastSeen: "Yesterday",
    online: false,
    unreadCount: 0
  },
  {
    id: 5,
    name: "Mohammed Farooq",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=250",
    location: "Moradabad, Uttar Pradesh",
    craft: "Brass Work",
    lastSeen: "2 days ago",
    online: false,
    unreadCount: 0
  }
];

const sampleMessages: Record<number, Message[]> = {
  1: [
    { id: 1, senderId: 1, receiverId: 0, content: "Namaste! I saw your work at the Delhi Haat exhibition last month.", timestamp: "Yesterday, 14:30", read: true },
    { id: 2, senderId: 0, receiverId: 1, content: "Namaste! Thank you for appreciating my work. It means a lot coming from a skilled artisan like you.", timestamp: "Yesterday, 15:45", read: true },
    { id: 3, senderId: 1, receiverId: 0, content: "I'm interested in learning more about your pottery technique. Would you be open to a collaboration?", timestamp: "Yesterday, 16:12", read: true },
    { id: 4, senderId: 0, receiverId: 1, content: "Absolutely! I'd be honored. Perhaps we can create a fusion piece that combines your bandhani patterns with my pottery?", timestamp: "Yesterday, 18:30", read: true },
    { id: 5, senderId: 1, receiverId: 0, content: "That's exactly what I was thinking! I have some natural dyes that could work well with your clay.", timestamp: "Today, 08:15", read: false },
    { id: 6, senderId: 1, receiverId: 0, content: "Also, there's a craft bazaar in Jaipur next month. Are you planning to attend?", timestamp: "Today, 08:17", read: false },
    { id: 7, senderId: 1, receiverId: 0, content: "We could showcase our collaboration there if you're interested.", timestamp: "Today, 08:18", read: false }
  ],
  3: [
    { id: 1, senderId: 3, receiverId: 0, content: "Hello! I'm interested in learning how you create such intricate designs.", timestamp: "3 days ago", read: true },
    { id: 2, senderId: 0, receiverId: 3, content: "Hi Karthik! It's a traditional technique passed down in my family. I'd be happy to share some basics.", timestamp: "3 days ago", read: true },
    { id: 3, senderId: 3, receiverId: 0, content: "That would be wonderful! Perhaps we can arrange a virtual workshop?", timestamp: "2 days ago", read: true },
    { id: 4, senderId: 3, receiverId: 0, content: "I've been experimenting with incorporating traditional motifs into contemporary designs.", timestamp: "Yesterday", read: false }
  ]
};

const ArtisanMessaging = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  const [showContactsList, setShowContactsList] = useState(true);

  const filteredContacts = initialContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          contact.craft.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "online") return matchesSearch && contact.online;
    if (activeTab === "unread") return matchesSearch && contact.unreadCount > 0;
    return matchesSearch;
  });

  useEffect(() => {
    if (selectedContact) {
      setMessages(sampleMessages[selectedContact.id] || []);
    }
  }, [selectedContact]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    const newMsg: Message = {
      id: messages.length + 1,
      senderId: 0,
      receiverId: selectedContact.id,
      content: newMessage,
      timestamp: "Just now",
      read: false
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    if (isMobile) {
      setShowContactsList(false);
    }
  };

  const handleBackToContacts = () => {
    if (isMobile) {
      setShowContactsList(true);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 h-[500px] md:h-[600px]">
      {(!isMobile || (isMobile && showContactsList)) && (
        <Card className="md:col-span-1 overflow-hidden">
          <CardHeader className="px-3 md:px-4 py-2 md:py-3 space-y-2">
            <h3 className="font-medium text-sm md:text-base">Artisan Connect</h3>
            <div className="relative">
              <Search className="absolute left-2 top-2 md:top-3 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
              <Input 
                placeholder="Search artisans..." 
                className="pl-7 md:pl-8 text-xs md:text-sm h-7 md:h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full h-7 md:h-9">
                <TabsTrigger value="all" className="text-xs md:text-sm py-0.5 md:py-1">All</TabsTrigger>
                <TabsTrigger value="online" className="text-xs md:text-sm py-0.5 md:py-1">Online</TabsTrigger>
                <TabsTrigger value="unread" className="text-xs md:text-sm py-0.5 md:py-1">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="p-0 h-[calc(500px-120px)] md:h-[calc(600px-130px)] overflow-y-auto">
            <div className="space-y-0.5 md:space-y-1">
              {filteredContacts.map((contact) => (
                <div 
                  key={contact.id}
                  className={`p-2 md:p-3 flex items-start space-x-2 md:space-x-3 hover:bg-gray-50 cursor-pointer ${selectedContact?.id === contact.id ? 'bg-kala-light/30' : ''}`}
                  onClick={() => handleSelectContact(contact)}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback className="text-xs md:text-sm">{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 block h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-green-500 ring-1 ring-white"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-xs md:text-sm truncate">{contact.name}</p>
                      <div className="flex items-center">
                        {contact.unreadCount > 0 && (
                          <Badge variant="destructive" className="rounded-full text-[8px] md:text-[10px] h-4 md:h-5 min-w-4 md:min-w-5 px-1 md:px-1.5 flex items-center justify-center">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
                      <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1 flex-shrink-0" />
                      <span className="truncate">{contact.location}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-0.5 md:mt-1">
                      <Badge variant="outline" className="text-[8px] md:text-[10px] py-0 px-1 md:px-1.5 bg-kala-light/20 text-kala-primary border-0">
                        {contact.craft}
                      </Badge>
                      
                      <div className="flex items-center text-[10px] md:text-xs text-gray-500">
                        <Clock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        <span>{contact.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 p-2 md:p-3">
            <Button variant="outline" className="w-full flex items-center space-x-1 md:space-x-2 text-xs md:text-sm h-7 md:h-9">
              <Plus className="h-3 w-3 md:h-4 md:w-4" />
              <span>New Connection</span>
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {(!isMobile || (isMobile && !showContactsList)) && (
        <Card className="md:col-span-2 flex flex-col">
          {selectedContact ? (
            <>
              <CardHeader className="px-3 md:px-6 py-2 md:py-4 border-b flex-shrink-0">
                <div className="flex items-center space-x-3">
                  {isMobile && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleBackToContacts}
                      className="h-7 w-7 p-0 mr-1"
                    >
                      &larr;
                    </Button>
                  )}
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                    <AvatarFallback className="text-xs md:text-sm">{selectedContact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium text-sm md:text-base">{selectedContact.name}</h3>
                    <div className="flex items-center text-[10px] md:text-xs text-gray-500">
                      <Badge variant="outline" className="text-[8px] md:text-xs mr-1 md:mr-2 py-0 px-1 md:px-1.5 bg-transparent">
                        {selectedContact.craft}
                      </Badge>
                      <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                      <span>{selectedContact.location}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-3 md:p-4 overflow-y-auto flex-1 flex flex-col-reverse space-y-reverse space-y-2 md:space-y-3">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex ${message.senderId === 0 ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[75%] rounded-lg px-3 md:px-4 py-1.5 md:py-2 ${
                        message.senderId === 0 
                          ? 'bg-kala-primary text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-xs md:text-sm">{message.content}</p>
                      <p className={`text-[9px] md:text-xs mt-0.5 md:mt-1 ${message.senderId === 0 ? 'text-white/70' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              
              <CardFooter className="p-2 md:p-3 border-t flex-shrink-0">
                <div className="flex items-center w-full space-x-2">
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1 text-xs md:text-sm h-8 md:h-10"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    className="bg-kala-primary hover:bg-kala-secondary h-8 md:h-10 w-8 md:w-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4 md:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-kala-light/50 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Send className="h-6 w-6 md:h-8 md:w-8 text-kala-primary" />
                </div>
                <h3 className="text-base md:text-lg font-medium text-gray-800">Connect with Artisans</h3>
                <p className="text-gray-500 mt-1 md:mt-2 max-w-md text-xs md:text-sm">
                  Select a conversation to start messaging with fellow artisans from across India
                </p>
                {isMobile && (
                  <Button 
                    variant="outline" 
                    className="mt-4 text-xs h-8"
                    onClick={handleBackToContacts}
                  >
                    Back to Contacts
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ArtisanMessaging;
