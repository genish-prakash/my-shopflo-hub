import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";

interface Address {
  id: string;
  type: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

const Addresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("shopflo_access_token");

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      // Extract user_id from token for X-SHOPFLO-REQ-ID
      let userId = "";
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        userId = decoded.payload?.user_id || decoded.user_id || "";
      } catch (e) {
        console.error("Failed to decode token for user_id", e);
      }

      const response: any = await axios.get(
        "https://api.shopflo.co/flo-checkout/api/gatekeeper/v1/accounts?include=address",
        {
          headers: {
            Authorization: token,
            "x-shopflo-session": "D2gA0hcHBg9prc1uuqFVa",
            "x-shopflo-version": "latest",
            accept: "application/json, text/plain, */*",
            "X-SHOPFLO-REQ-ID": userId,
          },
        }
      );


      if (response.data && response.data.response?.addresses) {
        const mappedAddresses = response.data.response.addresses.map((addr: any) => ({
          id: addr.uid,
          type: addr.address_type || "Home",
          name: addr.data?.name || "User",
          phone: addr.data?.phone || "",
          addressLine1: addr.data?.address1 || "",
          addressLine2: addr.data?.address2 || "",
          city: addr.data?.city || "",
          state: addr.data?.state || "",
          zipCode: addr.data?.zip || "",
          isDefault: false, // Default flag not present in API response
        }));
        setAddresses(mappedAddresses);
      } else if (Array.isArray(response.data)) {
        // Fallback logic
        const list =
          response.data.addresses || response.data.data?.addresses || [];
        const mappedAddresses = list.map((addr: any) => ({
          id: addr.uid || addr.id,
          type:
            addr.address_type ||
            (addr.tags?.includes("work") ? "Office" : "Home"),
          name: addr.data?.name || `${addr.first_name} ${addr.last_name}`,
          phone: addr.data?.phone || addr.phone,
          addressLine1: addr.data?.address1 || addr.address1,
          addressLine2: addr.data?.address2 || addr.address2,
          city: addr.data?.city || addr.city,
          state: addr.data?.state || addr.province,
          zipCode: addr.data?.zip || addr.zip,
          isDefault: addr.default || false,
        }));
        setAddresses(mappedAddresses);
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = (id: string) => {
    toast.info("Delete functionality coming soon!");
  };

  const handleSetDefault = (id: string) => {
    toast.success("Default address updated!");
  };

  const handleAddNew = () => {
    toast.info("Add address functionality coming soon!");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">
              My Addresses
            </h1>
          </div>
          <Button
            size="sm"
            onClick={handleAddNew}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No addresses found
          </div>
        ) : (
          addresses.map((address) => (
            <Card key={address.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-neutral-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground capitalize">
                        {address.type.toLowerCase()}
                      </h3>
                      {address.isDefault && (
                        <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      <p className="font-medium text-foreground">
                        {address.name}
                      </p>
                      <p>{address.phone}</p>
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(address.id)}
                  >
                    <Pencil className="h-4 w-4 text-neutral-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="h-4 w-4 text-neutral-500" />
                  </Button>
                </div>
              </div>
              {!address.isDefault && (
                <div className="mt-3 pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="text-neutral-600"
                  >
                    Set as Default
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Addresses;
