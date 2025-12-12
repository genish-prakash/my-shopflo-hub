import { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Check, ExternalLink, Loader2, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { couponsApi } from "@/services/mystique/couponsApi";
import { Coupon } from "@/services/mystique/types";

// Extended interface to match the new API response structure
interface ExtendedCoupon extends Coupon {
  merchant_name?: string;
  merchant_logo?: string;
  merchant_shop_domain?: string;
  merchant_color?: string;
}

const OffersView = () => {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<ExtendedCoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastCouponElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const response = await couponsApi.getDiscoverCoupons(page);
        if (response.success) {
          setCoupons((prev) => {
            const newCoupons = response.data as ExtendedCoupon[];
            // Filter out duplicates
            const uniqueCoupons = newCoupons.filter(
              (newCoupon) =>
                !prev.some((c) => c.coupon_id === newCoupon.coupon_id)
            );
            return [...prev, ...uniqueCoupons];
          });
          // Check if there are more pages
          setHasMore(response.current_page < response.max_pages);
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
  }, [page, toast]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code copied!",
      description: `${code} has been copied to clipboard`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const visitBrand = (domain?: string) => {
    if (!domain) return;
    const url = domain.startsWith("http") ? domain : `https://${domain}`;
    window.open(url, "_blank");
  };

  return (
    <div className="pb-24 px-4 pt-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Exclusive Offers</h1>
        <p className="text-sm text-muted-foreground">
          Handpicked discounts just for you
        </p>
      </div>

      {/* Offers List */}
      <div className="flex flex-col gap-5">
        {coupons.length === 0 && !loading ? (
          <div className="text-center py-12 text-muted-foreground">
            No offers available at the moment.
          </div>
        ) : (
          coupons.map((coupon, index) => {
            const brandColor = coupon.merchant_color || "#000000";
            const brandName = coupon.merchant_name || "Partner Brand";
            const isLastElement = index === coupons.length - 1;

            return (
              <div
                key={coupon.coupon_id}
                ref={isLastElement ? lastCouponElementRef : null}
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white border border-transparent hover:border-opacity-20"
                style={{
                  borderColor: `${brandColor}30`,
                }}
              >
                {/* Background Gradient */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{ backgroundColor: brandColor }}
                />

                {/* Main Content */}
                <div className="relative p-5">
                  <div className="flex items-start justify-between mb-4">
                    {/* Brand Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm p-1 flex items-center justify-center overflow-hidden border border-gray-100">
                        {coupon.merchant_logo ? (
                          <img
                            src={coupon.merchant_logo}
                            alt={brandName}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-base leading-tight">
                          {brandName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {coupon.merchant_shop_domain || "Official Store"}
                        </p>
                      </div>
                    </div>

                    {/* Discount Badge */}
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                      style={{
                        backgroundColor: `${brandColor}15`,
                        color: brandColor,
                      }}
                    >
                      {coupon.header}
                    </div>
                  </div>

                  {/* Offer Details */}
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {coupon.long_description?.[0] || coupon.description}
                    </p>

                    {/* Code & Action */}
                    <div className="flex items-center gap-3 pt-2">
                      <div
                        className="flex-1 flex items-center justify-between bg-gray-50 rounded-xl border border-gray-100 p-1 pl-3 group/code cursor-pointer hover:border-gray-200 transition-colors"
                        onClick={() => copyCode(coupon.code)}
                      >
                        <code className="font-mono font-bold text-sm text-foreground tracking-wide">
                          {coupon.code}
                        </code>
                        <div className="p-2 rounded-lg bg-white shadow-sm text-muted-foreground group-hover/code:text-foreground transition-colors">
                          {copiedCode === coupon.code ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </div>
                      </div>

                      <Button
                        size="icon"
                        className="h-11 w-11 rounded-xl shadow-sm hover:shadow-md transition-all shrink-0"
                        style={{ backgroundColor: brandColor }}
                        onClick={() => visitBrand(coupon.merchant_shop_domain)}
                      >
                        <ExternalLink className="w-5 h-5 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersView;
