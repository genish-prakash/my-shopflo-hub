import { NotificationDemo } from "@/components/NotificationDemo";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Example page showing how to integrate push notifications
 * Route this page in your router, e.g., /notifications
 */
export default function NotificationsPage() {
  const navigate = useNavigate();

  // TODO: Replace with actual user ID from your auth system
  // Example: const { userId } = useAuth();
  const userId = "user_123";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-4 flex items-center gap-4 bg-background/80 backdrop-blur-md border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">
          Push Notifications
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Stay Updated with Push Notifications
          </h2>
          <p className="text-muted-foreground">
            Enable notifications to get real-time updates about your orders,
            flash sales, new products, and exclusive deals!
          </p>
        </div>

        <NotificationDemo userId={userId} />

        {/* Info Section */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">What you'll receive:</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Order status updates (shipped, delivered)</li>
            <li>• Flash sale alerts and exclusive deals</li>
            <li>• New product launches from your favorite brands</li>
            <li>• Price drop notifications on wishlisted items</li>
            <li>• Cart reminders and checkout updates</li>
          </ul>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            You can manage your notification preferences anytime. We respect
            your privacy and won't spam you.
          </p>
        </div>
      </div>
    </div>
  );
}
