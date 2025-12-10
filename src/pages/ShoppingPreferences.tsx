import { useState } from "react";
import { ArrowLeft, Sparkles, Package, CreditCard, Truck, Palette, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const mockPreferences = [
  {
    category: "Apparel Sizes",
    icon: Package,
    items: [
      { label: "Shirt Size", value: "M (Medium)" },
      { label: "Pants Size", value: "32" },
      { label: "Shoe Size", value: "UK 9" },
    ],
  },
  {
    category: "Shipping",
    icon: Truck,
    items: [
      { label: "Preferred Method", value: "Express Delivery" },
      { label: "Delivery Time", value: "Evening (6-9 PM)" },
    ],
  },
  {
    category: "Payment",
    icon: CreditCard,
    items: [
      { label: "Preferred Mode", value: "UPI" },
      { label: "Backup Method", value: "Credit Card" },
    ],
  },
  {
    category: "Style Preferences",
    icon: Palette,
    items: [
      { label: "Favorite Colors", value: "Navy, Black, White" },
      { label: "Style", value: "Casual, Minimalist" },
    ],
  },
];

const ShoppingPreferences = () => {
  const navigate = useNavigate();
  const [quizOpen, setQuizOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const startQuiz = () => {
    setQuizOpen(true);
    setMessages([
      {
        role: "assistant",
        content: "Hi! I'm here to help personalize your shopping experience. Let me ask you a few questions to understand your preferences better. What's your preferred shirt size?",
      },
    ]);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/preference-quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
          setIsLoading(false);
          return;
        }
        if (response.status === 402) {
          toast.error("AI service unavailable. Please contact support.");
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";

      if (!reader) throw new Error("No reader available");

      const updateAssistantMessage = (content: string) => {
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content } : m
            );
          }
          return [...prev, { role: "assistant", content }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              updateAssistantMessage(assistantContent);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 h-16">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Shopping Preferences</h1>
            <p className="text-xs text-muted-foreground">Personalize your experience</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-6 space-y-6 max-w-2xl mx-auto">
        {/* Hero Card */}
        <Card className="bg-gradient-primary p-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-bold">AI-Powered Personalization</h2>
              <p className="text-sm opacity-90">
                Let us learn about your preferences
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-full mt-3"
            onClick={startQuiz}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Enhance Preferences
          </Button>
        </Card>

        {/* Current Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Your Preferences
          </h3>
          {mockPreferences.map((pref) => {
            const Icon = pref.icon;
            return (
              <Card key={pref.category} className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    {pref.category}
                  </h4>
                </div>
                <div className="space-y-2">
                  {pref.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center py-2 border-b border-border last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quiz Dialog */}
      <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Preference Enhancement Quiz
            </DialogTitle>
            <DialogDescription>
              Answer a few questions to help us personalize your shopping
              experience
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 pt-4 border-t">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShoppingPreferences;
