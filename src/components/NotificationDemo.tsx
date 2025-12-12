import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Send, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface NotificationDemoProps {
  userId: string;
}

/**
 * Demo component showing how to use push notifications
 *
 * @example
 * ```tsx
 * <NotificationDemo userId="user_123" />
 * ```
 */
export function NotificationDemo({ userId }: NotificationDemoProps) {
  const { toast } = useToast();
  const [testTitle, setTestTitle] = useState("Test Notification");
  const [testBody, setTestBody] = useState(
    "This is a test notification from Shopflo!"
  );
  const [topic, setTopic] = useState("flash-sales");

  const {
    isSupported,
    permission,
    isRegistered,
    isLoading,
    error,
    fcmToken,
    requestPermission,
    unregister,
    subscribeTopic,
    unsubscribeTopic,
    sendTest,
  } = useNotifications({
    userId,
    onForegroundMessage: (payload) => {
      console.log("Received foreground notification:", payload);

      // Show toast notification
      toast({
        title: payload.notification?.title || "New Notification",
        description: payload.notification?.body || "",
      });
    },
  });

  const handleEnableNotifications = async () => {
    const success = await requestPermission();
    if (success) {
      toast({
        title: "Success!",
        description: "Push notifications have been enabled.",
      });
    } else {
      toast({
        title: "Failed",
        description: error || "Could not enable notifications.",
        variant: "destructive",
      });
    }
  };

  const handleDisableNotifications = async () => {
    const success = await unregister();
    if (success) {
      toast({
        title: "Disabled",
        description: "Push notifications have been disabled.",
      });
    } else {
      toast({
        title: "Failed",
        description: error || "Could not disable notifications.",
        variant: "destructive",
      });
    }
  };

  const handleSendTest = async () => {
    const success = await sendTest({
      title: testTitle,
      body: testBody,
      click_action: window.location.href,
      data: {
        type: "TEST",
        timestamp: new Date().toISOString(),
      },
    });

    if (success) {
      toast({
        title: "Sent!",
        description: "Test notification has been sent.",
      });
    } else {
      toast({
        title: "Failed",
        description: error || "Could not send test notification.",
        variant: "destructive",
      });
    }
  };

  const handleSubscribeTopic = async () => {
    const success = await subscribeTopic(topic);
    if (success) {
      toast({
        title: "Subscribed",
        description: `Subscribed to topic: ${topic}`,
      });
    } else {
      toast({
        title: "Failed",
        description: error || "Could not subscribe to topic.",
        variant: "destructive",
      });
    }
  };

  const handleUnsubscribeTopic = async () => {
    const success = await unsubscribeTopic(topic);
    if (success) {
      toast({
        title: "Unsubscribed",
        description: `Unsubscribed from topic: ${topic}`,
      });
    } else {
      toast({
        title: "Failed",
        description: error || "Could not unsubscribe from topic.",
        variant: "destructive",
      });
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications Not Supported</CardTitle>
          <CardDescription>
            Your browser does not support push notifications.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Manage your push notification settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label>Status</Label>
              <span
                className={`font-medium ${
                  isRegistered ? "text-green-600" : "text-gray-500"
                }`}
              >
                {isRegistered ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <Label>Permission</Label>
              <span className="font-medium capitalize">{permission}</span>
            </div>
            {fcmToken && (
              <div className="flex flex-col gap-1">
                <Label>FCM Token</Label>
                <code className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {fcmToken.substring(0, 50)}...
                </code>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!isRegistered ? (
              <Button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enabling...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Enable Notifications
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleDisableNotifications}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Disabling...
                  </>
                ) : (
                  <>
                    <BellOff className="w-4 h-4 mr-2" />
                    Disable Notifications
                  </>
                )}
              </Button>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Notification Card */}
      {isRegistered && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Test Notification
            </CardTitle>
            <CardDescription>Send yourself a test notification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-title">Title</Label>
              <Input
                id="test-title"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="Notification title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-body">Body</Label>
              <Textarea
                id="test-body"
                value={testBody}
                onChange={(e) => setTestBody(e.target.value)}
                placeholder="Notification body"
                rows={3}
              />
            </div>
            <Button
              onClick={handleSendTest}
              disabled={isLoading || !testTitle || !testBody}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Test
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Topic Subscription Card */}
      {isRegistered && (
        <Card>
          <CardHeader>
            <CardTitle>Topic Subscriptions</CardTitle>
            <CardDescription>
              Subscribe to specific notification topics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic Name</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., flash-sales, new-products"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubscribeTopic}
                disabled={isLoading || !topic}
                variant="default"
                className="flex-1"
              >
                Subscribe
              </Button>
              <Button
                onClick={handleUnsubscribeTopic}
                disabled={isLoading || !topic}
                variant="outline"
                className="flex-1"
              >
                Unsubscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
