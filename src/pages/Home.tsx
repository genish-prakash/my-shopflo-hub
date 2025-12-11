import { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import OrdersView from "@/components/views/OrdersView";
import ReviewsView from "@/components/views/ReviewsView";
import BrandsView from "@/components/views/BrandsView";
import OffersView from "@/components/views/OffersView";
import ProfileView from "@/components/views/ProfileView";
import AddressesView from "@/components/views/AddressesView";

export type ViewType = "orders" | "reviews" | "brands" | "offers" | "profile" | "addresses";

const Home = () => {
  const [currentView, setCurrentView] = useState<ViewType>("brands");

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