import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Send, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Map from "@/components/map";
import Footer from "@/components/Footer";

type Contact = {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  online: boolean;
  lastSeen?: Date;
};

type Message = {
  id: string;
  text: string;
  sender: "user" | "contact";
  timestamp: Date;
  contactId?: string;
};

type Location = {
  lat: number;
  lng: number;
  address?: string;
};

// Sample contacts data
const sampleContacts: Contact[] = [
  {
    id: "1",
    name: "Amit Sharma",
    avatar: "https://i.pravatar.cc/150?img=1",
    phone: "+91 98765 43210",
    online: true
  },
  {
    id: "2",
    name: "Priya Patel",
    avatar: "https://i.pravatar.cc/150?img=5",
    phone: "+91 98765 12345",
    online: true
  },
  {
    id: "3",
    name: "Raj Kumar",
    avatar: "https://i.pravatar.cc/150?img=3",
    phone: "+91 98123 45678",
    online: false,
    lastSeen: new Date(Date.now() - 30 * 60000) // 30 minutes ago
  },
  {
    id: "4",
    name: "Sneha Gupta",
    avatar: "https://i.pravatar.cc/150?img=4",
    phone: "+91 99876 54321",
    online: true
  },
  {
    id: "5",
    name: "Vikram Singh",
    avatar: "https://i.pravatar.cc/150?img=7",
    phone: "+91 87654 32109",
    online: false,
    lastSeen: new Date(Date.now() - 120 * 60000) // 2 hours ago
  }
];

export default function ChatPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationShared, setLocationShared] = useState<Record<string, boolean>>({});
  const [contacts] = useState<Contact[]>(sampleContacts);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to a default location (New Delhi)
          setUserLocation({
            lat: 28.6139,
            lng: 77.2090,
          });
        }
      );
    }
  }, []);

  const shareLocation = () => {
    if (selectedContact && userLocation) {
      // Send location to contact
      const locationMessage: Message = {
        id: Date.now().toString(),
        text: `Location shared: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`,
        sender: "user",
        timestamp: new Date(),
        contactId: selectedContact.id,
      };
      
      setMessages([...messages, locationMessage]);
      setLocationShared(prev => ({...prev, [selectedContact.id]: true}));
      
      // Simulate contact response
      setTimeout(() => {
        const contactResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: t("chat.locationReceived"),
          sender: "contact",
          timestamp: new Date(),
          contactId: selectedContact.id,
        };
        setMessages(prev => [...prev, contactResponse]);
      }, 1500);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "user",
        timestamp: new Date(),
        contactId: selectedContact.id,
      };
      
      setMessages([...messages, message]);
      setNewMessage("");
      
      // Simulate contact response
      setTimeout(() => {
        const responses = [
          "Got it! How are you doing today?",
          "Thanks for the message!",
          "I'll see you soon.",
          "That sounds great! Let's meet up.",
          "I'm on my way to that location now."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const contactResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: "contact",
          timestamp: new Date(),
          contactId: selectedContact.id,
        };
        
        setMessages(prev => [...prev, contactResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        >
          {t("chat.title")}
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>
                  {selectedContact
                    ? t("chat.chatWithContact", { name: selectedContact.name })
                    : t("chat.selectContact")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                {selectedContact ? (
                  <>
                    <div className="flex-grow mb-4 overflow-y-auto max-h-[400px] space-y-4">
                      {messages
                        .filter(m => m.contactId === selectedContact.id)
                        .map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.sender === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p>{message.text}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                    
                    <div className="flex gap-2">
                      {!locationShared[selectedContact.id] && userLocation && (
                        <Button
                          variant="outline"
                          onClick={shareLocation}
                          className="flex-shrink-0"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          {t("chat.shareLocation")}
                        </Button>
                      )}
                      <Input
                        placeholder={t("chat.typingPlaceholder")}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-grow"
                      />
                      <Button onClick={sendMessage} className="flex-shrink-0">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto text-primary mb-4" />
                    <p className="text-lg font-medium mb-2">
                      {t("chat.selectContact")}
                    </p>
                    <p className="text-muted-foreground">
                      {t("chat.selectContactDescription")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t("chat.contacts")}</CardTitle>
              </CardHeader>
              <CardContent>
                {userLocation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                  >
                    <Map
                      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                      markers={[
                        {
                          position: userLocation,
                          title: t("chat.yourLocation"),
                        }
                      ]}
                    />
                  </motion.div>
                )}

                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-3 rounded-lg cursor-pointer ${
                        selectedContact?.id === contact.id
                          ? "bg-primary/10"
                          : "hover:bg-primary/5"
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {contact.phone}
                        </div>
                      </div>
                      {contact.online && (
                        <div className="ml-auto flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-600" />
                          <span className="ml-2 text-xs text-green-600">
                            {t("chat.online")}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
