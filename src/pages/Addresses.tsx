import { ArrowLeft, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const mockAddresses = [
  {
    id: "1",
    type: "Home",
    name: "Rahul Kumar",
    phone: "+91 98765 43210",
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    isDefault: true,
  },
  {
    id: "2",
    type: "Office",
    name: "Rahul Kumar",
    phone: "+91 98765 43210",
    addressLine1: "456 Business Park",
    addressLine2: "Tower A, Floor 5",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400051",
    isDefault: false,
  },
];

const Addresses = () => {
  const navigate = useNavigate();

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
            <h1 className="text-lg font-semibold text-foreground">My Addresses</h1>
          </div>
          <Button size="sm" onClick={handleAddNew} className="bg-foreground text-background hover:bg-foreground/90">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-3">
        {mockAddresses.map((address) => (
          <Card key={address.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-neutral-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{address.type}</h3>
                    {address.isDefault && (
                      <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <p className="font-medium text-foreground">{address.name}</p>
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
        ))}
      </div>
    </div>
  );
};

export default Addresses;
