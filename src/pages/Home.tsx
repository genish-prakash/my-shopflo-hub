import { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import OrdersView from "@/components/views/OrdersView";
import ReviewsView from "@/components/views/ReviewsView";
import BrandsView from "@/components/views/BrandsView";
import OffersView from "@/components/views/OffersView";
import ProfileView from "@/components/views/ProfileView";
import AddressesView from "@/components/views/AddressesView";
import { useUser } from "@/contexts/UserContext";

export type ViewType = "orders" | "reviews" | "brands" | "offers" | "profile" | "addresses";

const Home = () => {
  const [currentView, setCurrentView] = useState<ViewType>("brands");
  const { user, isLoading, error } = useUser();

  // Log user data for debugging
  if (user) {
    console.log('User data loaded:', user);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading user:', error);
  }

  const renderView = () => {
    switch (currentView) {
      case "orders":
        return <OrdersView />;
      case "reviews":
        return <ReviewsView />;
      case "brands":
        return <BrandsView />;
      case "offers":
        return <OffersView />;
      case "profile":
        return <ProfileView />;
      case "addresses":
        return <AddressesView />;
      default:
        return <BrandsView />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onViewChange={setCurrentView} />
      <main className="flex-1 pb-20 overflow-y-auto no-scrollbar">
        {renderView()}
      </main>
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default Home;