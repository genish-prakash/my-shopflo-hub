import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const mockOffers = [
  {
    id: "1",
    brand: "Nike Store",
    logo: "https://logo.clearbit.com/nike.com",
    logoFallback: "🏃",
    brandColor: "#F97316",
    title: "Extra 20% Off on Sports Shoes",
    description: "Valid on orders above ₹5,999",
    code: "NIKE20",
    discount: "20% OFF",
    website: "https://nike.com",
  },
  {
    id: "2",
    brand: "Apple Store",
    logo: "https://logo.clearbit.com/apple.com",
    logoFallback: "🍎",
    brandColor: "#6B7280",
    title: "₹2,000 Instant Discount",
    description: "On AirPods and Apple Watch",
    code: "APPLE2K",
    discount: "₹2,000",
    website: "https://apple.com",
  },
  {
    id: "3",
    brand: "Zara Fashion",
    logo: "https://logo.clearbit.com/zara.com",
    logoFallback: "👔",
    brandColor: "#1F2937",
    title: "Buy 2 Get 1 Free",
    description: "On all casual wear",
    code: "ZARA3FOR2",
    discount: "BOGO",
    website: "https://zara.com",
  },
  {
    id: "4",
    brand: "Sony Electronics",
    logo: "https://logo.clearbit.com/sony.com",
    logoFallback: "🎧",
    brandColor: "#3B82F6",
    title: "Flat 15% Cashback",
    description: "Maximum cashback ₹1,500",
    code: "SONY15",
    discount: "15% CB",
    website: "https://sony.com",
  },
];

const OffersView = () => {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code copied!",
      description: `${code} has been copied to clipboard`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const visitBrand = (website: string) => {
    window.open(website, "_blank");
  };

  return (
    <div className="pb-24 px-4 pt-4" style={{ background: 'linear-gradient(180deg, rgba(101, 53, 255, 0.08) 0%, transparent 30%)' }}>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-foreground">Offers</h1>
      </div>

      {/* Offers List */}
      <div className="space-y-3">
        {mockOffers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-2xl overflow-hidden shadow-sm"
            style={{ backgroundColor: `${offer.brandColor}10` }}
          >
            {/* Coupon Card Design */}
            <div className="relative">
              {/* Top Section - Brand & Discount */}
              <div className="p-4 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: `${offer.brandColor}20` }}
                    >
                      <img 
                        src={offer.logo} 
                        alt={offer.brand}
                        className="w-7 h-7 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl">${offer.logoFallback}</span>`;
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{offer.brand}</p>
                      <p className="text-xs text-muted-foreground">{offer.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span 
                      className="text-lg font-bold"
                      style={{ color: offer.brandColor }}
                    >
                      {offer.discount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dashed Separator with Circles */}
              <div className="relative flex items-center px-4">
                <div className="absolute -left-3 w-6 h-6 bg-background rounded-full" />
                <div className="flex-1 border-t-2 border-dashed border-border/50" />
                <div className="absolute -right-3 w-6 h-6 bg-background rounded-full" />
              </div>

              {/* Bottom Section - Code & Actions */}
              <div className="p-4 pt-3">
                <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <code 
                      className="px-3 py-1.5 rounded-lg text-sm font-mono font-bold tracking-wider"
                      style={{ 
                        backgroundColor: `${offer.brandColor}15`,
                        color: offer.brandColor 
                      }}
                    >
                      {offer.code}
                    </code>
                    <button
                      onClick={() => copyCode(offer.code)}
                      className={`p-2 rounded-lg transition-all ${
                        copiedCode === offer.code 
                          ? "bg-green-100 text-green-600" 
                          : "bg-muted/50 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {copiedCode === offer.code ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => visitBrand(offer.website)}
                    className="text-xs font-medium gap-1.5 h-8 px-3"
                    style={{ color: offer.brandColor }}
                  >
                    Visit Brand
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersView;