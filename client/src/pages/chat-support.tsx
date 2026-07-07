import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, ArrowLeft, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Footer from "@/components/Footer";
import { Link } from "wouter";

// Predefined Q&A
const FAQS = [
  {
    id: "booking",
    question: "How do I book a ride?",
    answer: "You can book a ride by clicking on the 'Book Now' button on the home page. Select your pickup and drop location on the map, and confirm your booking. Our nearest driver will accept your request shortly."
  },
  {
    id: "fare",
    question: "How is the fare calculated?",
    answer: "Our fare is calculated based on the distance between your pickup and drop location. We have a base fare of ₹20 plus ₹10 per kilometer. The app will show you the estimated fare before you confirm your booking."
  },
  {
    id: "wait",
    question: "How long do I need to wait for a ride?",
    answer: "The wait time depends on the availability of drivers near your location. Typically, you can expect a wait time of 3-5 minutes in urban areas. The app will show you the real-time location of your driver once your booking is accepted."
  },
  {
    id: "cancel",
    question: "Can I cancel my booking?",
    answer: "Yes, you can cancel your booking at any time before the ride starts. There is no cancellation fee if you cancel within 2 minutes of booking. After that, a small cancellation fee may apply."
  },
  {
    id: "payment",
    question: "What payment methods are accepted?",
    answer: "We currently accept cash payments only. We are working on adding digital payment options like UPI, debit/credit cards, and mobile wallets in the near future."
  },
  {
    id: "contact",
    question: "How can I contact my driver?",
    answer: "Once your booking is confirmed, you will see your driver's details along with a call button. You can call your driver directly from the app to communicate about your exact pickup location or any other details."
  },
];

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function ChatSupportPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "welcome", 
      text: "👋 Hello! I'm your virtual assistant. How can I help you today?", 
      isUser: false, 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Find matching FAQ or provide default response
    setTimeout(() => {
      const faq = FAQS.find(faq => 
        faq.question.toLowerCase().includes(text.toLowerCase()) || 
        text.toLowerCase().includes(faq.id)
      );
      
      const responseMessage: Message = {
        id: `response-${Date.now()}`,
        text: faq 
          ? faq.answer
          : "Thank you for your message. One of our support agents will get back to you shortly. In the meantime, you might find an answer in our frequently asked questions.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
      setShowSuggestions(true);
    }, 500);
  };

  const handleFaqClick = (faq: typeof FAQS[0]) => {
    handleSendMessage(faq.question);
    setShowSuggestions(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
            <MessageCircle className="h-7 w-7 text-primary" /> 
            {t("support.chat.title")}
          </h1>
        </div>

        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex flex-col h-[60vh]">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex items-start max-w-[80%] ${message.isUser ? "flex-row-reverse" : ""}`}>
                        <div className={`flex items-center justify-center h-8 w-8 rounded-full ${message.isUser ? "bg-primary ml-2" : "bg-secondary mr-2"}`}>
                          {message.isUser ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.isUser 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {showSuggestions && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Frequently Asked Questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {FAQS.map((faq) => (
                      <Badge 
                        key={faq.id} 
                        className="cursor-pointer bg-sky-100 px-4 py-2 text-sky-900 shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground dark:bg-sky-400/20 dark:text-sky-100"
                        onClick={() => handleFaqClick(faq)}
                      >
                        {faq.question}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type your message here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage(input);
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  onClick={() => handleSendMessage(input)}
                  disabled={!input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-muted-foreground">+91 1800-123-4567 (Mon-Sat, 9 AM - 8 PM)</p>
              </div>
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-muted-foreground">support@lastmile.com</p>
              </div>
              <div>
                <p className="font-medium">Office Address</p>
                <p className="text-muted-foreground">123 Office Tower, Tech Park, New Delhi - 110089</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
