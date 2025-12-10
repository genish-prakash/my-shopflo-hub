import { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import OrdersView from "@/components/views/OrdersView";
import ProductsView from "@/components/views/ProductsView";
import BrandsView from "@/components/views/BrandsView";
import RewardsView from "@/components/views/RewardsView";
import OffersView from "@/components/views/OffersView";
import ProfileView from "@/components/views/ProfileView";
import AddressesView from "@/components/views/AddressesView";

export type ViewType = "orders" | "products" | "brands" | "rewards" | "offers" | "profile" | "addresses";

const Home = () => {
  const [currentView, setCurrentView] = useState<ViewType>("orders");

  const renderView = () => {
    switch (currentView) {
      case "orders":
        return <OrdersView />;
      case "products":
        return <ProductsView />;
      case "brands":
        return <BrandsView />;
      case "rewards":
        return <RewardsView />;
      case "offers":
        return <OffersView />;
      case "profile":
        return <ProfileView />;
      case "addresses":
        return <AddressesView />;
      default:
        return <OrdersView />;
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
