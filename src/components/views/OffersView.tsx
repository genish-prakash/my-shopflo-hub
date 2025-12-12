import { useState, useEffect } from "react";
import { Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { couponsApi } from "@/services/mystique/couponsApi";
import { Coupon } from "@/services/mystique/types";

const OffersView = () => {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await couponsApi.getDiscoverCoupons();
        if (response.success) {
          setCoupons(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch coupons", error);
        toast({
          title: "Error",
          description: "Failed to load offers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [toast]);

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

  // Helper to generate consistent colors based on string
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      className="pb-24 px-4 pt-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(101, 53, 255, 0.08) 0%, transparent 30%)",
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-foreground">Offers</h1>
      </div>

      {/* Offers List */}
      <div className="space-y-3">
        {coupons.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No offers available at the moment.
          </div>
        ) : (
          coupons.map((coupon) => {
            const brandColor = stringToColor(coupon.merchant_id);
            // Placeholder for brand info since API doesn't provide it yet
            const brandName = "Partner Brand";
            const logoFallback = "🏷️";

            return (
              <div
                key={coupon.coupon_id}
                className="rounded-2xl overflow-hidden shadow-sm"
                style={{ backgroundColor: `${brandColor}10` }}
              >
                {/* Coupon Card Design */}
                <div className="relative">
                  {/* Top Section - Brand & Discount */}
                  <div className="p-4 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: `${brandColor}20` }}
                        >
                          <span className="text-2xl">{logoFallback}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {brandName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {coupon.title}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className="text-lg font-bold"
                          style={{ color: brandColor }}
                        >
                          {coupon.header}
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
                    <p className="text-sm text-muted-foreground mb-3">
                      {coupon.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <code
                          className="px-3 py-1.5 rounded-lg text-sm font-mono font-bold tracking-wider"
                          style={{
                            backgroundColor: `${brandColor}15`,
                            color: brandColor,
                          }}
                        >
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className={`p-2 rounded-lg transition-all ${
                            copiedCode === coupon.code
                              ? "bg-green-100 text-green-600"
                              : "bg-muted/50 hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Website link not available in coupon object, hiding or using placeholder */}
                      {/* <Button ... /> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OffersView;
