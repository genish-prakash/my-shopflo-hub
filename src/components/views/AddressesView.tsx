import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const mockAddresses = [
  {
    id: "1",
    type: "Home",
    name: "John Doe",
    phone: "+1 234 567 8900",
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    isDefault: true,
  },
  {
    id: "2",
    type: "Office",
    name: "John Doe",
    phone: "+1 234 567 8900",
    addressLine1: "456 Business Ave",
    addressLine2: "Suite 200",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    isDefault: false,
  },
];

const AddressesView = () => {
  const handleEdit = (id: string) => {
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = (id: string) => {
    toast.info("Delete functionality coming soon!");
  };

  const handleSetDefault = (id: string) => {
    toast.success("Default address updated!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Addresses</h1>
            <p className="text-muted-foreground mt-1">Manage your delivery addresses</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>

        <div className="grid gap-4">
          {mockAddresses.map((address) => (
            <Card key={address.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{address.type}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
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
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(address.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {!address.isDefault && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddressesView;
