import { useState, useRef } from "react";
import {
  RichNotification,
  TextNotification,
  MediaNotification,
  CarouselNotification,
  ListNotification,
  PollNotification,
  CardNotification,
  PromotionalNotification,
  ActionButton,
} from "@/types/notifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  CheckCircle2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RichNotificationCardProps {
  notification: RichNotification;
  onDismiss?: () => void;
  onAction?: (action: string, type: string) => void;
}

export function RichNotificationCard({
  notification,
  onDismiss,
  onAction,
}: RichNotificationCardProps) {
  const { toast } = useToast();

  const handleButtonClick = (button: ActionButton) => {
    if (button.button_type === "DISMISS") {
      onDismiss?.();
      return;
    }

    if (button.button_type === "ACTION") {
      // Handle special actions like "copy:..."
      if (button.action.startsWith("copy:")) {
        const textToCopy = button.action.replace("copy:", "");
        navigator.clipboard.writeText(textToCopy);
        toast({
          title: "Copied!",
          description: `"${textToCopy}" copied to clipboard`,
        });
        return;
      }
    }

    onAction?.(button.action, button.button_type);

    if (button.button_type === "LINK" || button.button_type === "DEEPLINK") {
      window.open(button.action, "_blank");
    }
  };

  const renderActionButton = (button: ActionButton, index: number) => {
    const isSecondary = index > 0;

    return (
      <Button
        key={index}
        onClick={() => handleButtonClick(button)}
        variant={isSecondary ? "outline" : "default"}
        size="sm"
        className="flex-1"
      >
        {button.icon_url && (
          <img src={button.icon_url} alt="" className="w-4 h-4 mr-2" />
        )}
        {button.text}
        {button.button_type === "LINK" && (
          <ExternalLink className="w-3 h-3 ml-2" />
        )}
        {button.button_type === "ACTION" &&
          button.action.startsWith("copy:") && (
            <Copy className="w-3 h-3 ml-2" />
          )}
      </Button>
    );
  };

  switch (notification.type) {
    case "TEXT":
      return (
        <TextNotificationCard
          notification={notification}
          onDismiss={onDismiss}
        />
      );
    case "MEDIA":
      return (
        <MediaNotificationCard
          notification={notification}
          onDismiss={onDismiss}
        />
      );
    case "CAROUSEL":
      return (
        <CarouselNotificationCard
          notification={notification}
          onDismiss={onDismiss}
          renderButton={renderActionButton}
        />
      );
    case "LIST":
      return (
        <ListNotificationCard
          notification={notification}
          onDismiss={onDismiss}
          renderButton={renderActionButton}
        />
      );
    case "POLL":
      return (
        <PollNotificationCard
          notification={notification}
          onDismiss={onDismiss}
        />
      );
    case "CARD":
      return (
        <CardNotificationCard
          notification={notification}
          onDismiss={onDismiss}
          renderButton={renderActionButton}
        />
      );
    case "PROMOTIONAL":
      return (
        <PromotionalNotificationCard
          notification={notification}
          onDismiss={onDismiss}
          renderButton={renderActionButton}
        />
      );
    default:
      return null;
  }
}

// TEXT Notification Component
function TextNotificationCard({
  notification,
  onDismiss,
}: {
  notification: TextNotification;
  onDismiss?: () => void;
}) {
  return (
    <Card className="p-4 relative">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <h3 className="font-semibold text-sm mb-1">{notification.title}</h3>
      <p className="text-xs text-muted-foreground">{notification.body}</p>
      {notification.click_action && (
        <Button
          size="sm"
          variant="link"
          className="mt-2 px-0"
          onClick={() => window.open(notification.click_action, "_blank")}
        >
          View Details <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      )}
    </Card>
  );
}

// MEDIA Notification Component
function MediaNotificationCard({
  notification,
  onDismiss,
}: {
  notification: MediaNotification;
  onDismiss?: () => void;
}) {
  return (
    <Card className="overflow-hidden relative">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 text-white z-10"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {notification.media_type === "IMAGE" && (
        <img
          src={notification.media_url}
          alt={notification.title}
          className="w-full h-48 object-cover"
        />
      )}
      {notification.media_type === "VIDEO" && (
        <video
          src={notification.media_url}
          poster={notification.thumbnail_url}
          controls
          className="w-full h-48 object-cover"
        />
      )}
      {notification.media_type === "GIF" && (
        <img
          src={notification.media_url}
          alt={notification.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-1">{notification.title}</h3>
        <p className="text-xs text-muted-foreground mb-2">
          {notification.body}
        </p>
        {notification.caption && (
          <p className="text-xs italic text-muted-foreground">
            {notification.caption}
          </p>
        )}
        {notification.click_action && (
          <Button
            size="sm"
            variant="outline"
            className="mt-3 w-full"
            onClick={() => window.open(notification.click_action, "_blank")}
          >
            Learn More
          </Button>
        )}
      </div>
    </Card>
  );
}

// CAROUSEL Notification Component
function CarouselNotificationCard({
  notification,
  onDismiss,
  renderButton,
}: {
  notification: CarouselNotification;
  onDismiss?: () => void;
  renderButton: (button: ActionButton, index: number) => React.ReactNode;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(notification.items.length - 1, prev + 1)
    );
  };

  const currentItem = notification.items[currentIndex];

  return (
    <Card className="overflow-hidden relative">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-white shadow-md z-10"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <div className="p-3 pb-2 border-b">
        <h3 className="font-semibold text-sm">{notification.title}</h3>
        {notification.body && (
          <p className="text-xs text-muted-foreground">{notification.body}</p>
        )}
      </div>

      <div className="relative">
        <img
          src={currentItem.image_url}
          alt={currentItem.title}
          className="w-full h-40 object-cover"
        />

        {/* Navigation */}
        {notification.items.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === notification.items.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {notification.items.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${
                    idx === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-3">
        <h4 className="font-semibold text-sm">{currentItem.title}</h4>
        {currentItem.subtitle && (
          <p className="text-xs text-muted-foreground">
            {currentItem.subtitle}
          </p>
        )}

        {currentItem.buttons && currentItem.buttons.length > 0 && (
          <div className="flex gap-2 mt-3">
            {currentItem.buttons.map((button, idx) =>
              renderButton(button, idx)
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// LIST Notification Component
function ListNotificationCard({
  notification,
  onDismiss,
  renderButton,
}: {
  notification: ListNotification;
  onDismiss?: () => void;
  renderButton: (button: ActionButton, index: number) => React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden relative">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-white shadow-md z-10"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {notification.header_image_url && (
        <img
          src={notification.header_image_url}
          alt={notification.title}
          className="w-full h-24 object-cover"
        />
      )}

      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1">{notification.title}</h3>
        {notification.body && (
          <p className="text-xs text-muted-foreground mb-3">
            {notification.body}
          </p>
        )}

        <div className="space-y-2">
          {notification.items.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() =>
                item.click_action && window.open(item.click_action, "_blank")
              }
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{item.title}</p>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>
                )}
              </div>
              {item.metadata && (
                <span className="text-xs font-medium">{item.metadata}</span>
              )}
            </div>
          ))}
        </div>

        {notification.footer_button && (
          <div className="mt-3">
            {renderButton(notification.footer_button, 0)}
          </div>
        )}
      </div>
    </Card>
  );
}

// POLL Notification Component
function PollNotificationCard({
  notification,
  onDismiss,
}: {
  notification: PollNotification;
  onDismiss?: () => void;
}) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionClick = (optionId: string) => {
    if (submitted) return;

    if (notification.allow_multiple_selection) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) return;
    // TODO: Send poll response to backend
    console.log("Poll response:", {
      poll_id: notification.poll_id,
      options: selectedOptions,
    });
    setSubmitted(true);
  };

  return (
    <Card className="overflow-hidden relative">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted z-10"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {notification.image_url && (
        <img
          src={notification.image_url}
          alt={notification.question}
          className="w-full h-32 object-cover"
        />
      )}

      <div className="p-4">
        <h3 className="font-semibold text-sm mb-1">{notification.question}</h3>
        {notification.body && (
          <p className="text-xs text-muted-foreground mb-3">
            {notification.body}
          </p>
        )}

        <div className="space-y-2 mb-3">
          {notification.options.map((option) => {
            const isSelected = selectedOptions.includes(option.id);

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                disabled={submitted}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                } ${
                  submitted ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {option.image_url && (
                  <img
                    src={option.image_url}
                    alt={option.text}
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <span className="flex-1 text-left text-sm">{option.text}</span>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
            className="w-full"
            size="sm"
          >
            Submit
          </Button>
        ) : (
          <div className="text-center text-sm text-green-600 font-medium">
            ✓ Thanks for your feedback!
          </div>
        )}
      </div>
    </Card>
  );
}

// CARD Notification Component
function CardNotificationCard({
  notification,
  onDismiss,
  renderButton,
}: {
  notification: CardNotification;
  onDismiss?: () => void;
  renderButton: (button: ActionButton, index: number) => React.ReactNode;
}) {
  const style = notification.style || "STANDARD";

  return (
    <Card className="overflow-hidden relative">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-white shadow-md z-10"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {notification.header_image_url && style === "HERO" && (
        <img
          src={notification.header_image_url}
          alt={notification.title}
          className="w-full h-40 object-cover"
        />
      )}

      <div className={style === "COMPACT" ? "p-3" : "p-4"}>
        {notification.image_url && style !== "HERO" && (
          <img
            src={notification.image_url}
            alt={notification.title}
            className={`w-full rounded-lg mb-3 ${
              style === "COMPACT" ? "h-24" : "h-32"
            } object-cover`}
          />
        )}

        <h3
          className={`font-semibold ${
            style === "COMPACT" ? "text-sm" : "text-base"
          } mb-1`}
        >
          {notification.title}
        </h3>
        {notification.subtitle && (
          <p className="text-xs text-muted-foreground mb-1">
            {notification.subtitle}
          </p>
        )}
        <p
          className={`text-muted-foreground ${
            style === "COMPACT" ? "text-xs" : "text-sm"
          } mb-3`}
        >
          {notification.body}
        </p>

        {notification.buttons && notification.buttons.length > 0 && (
          <div className="flex gap-2">
            {notification.buttons.map((button, idx) =>
              renderButton(button, idx)
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// PROMOTIONAL Notification Component
function PromotionalNotificationCard({
  notification,
  onDismiss,
  renderButton,
}: {
  notification: PromotionalNotification;
  onDismiss?: () => void;
  renderButton: (button: ActionButton, index: number) => React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden relative bg-gradient-to-br from-orange-50 to-red-50">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-white shadow-md z-10"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {notification.banner_url && (
        <img
          src={notification.banner_url}
          alt={notification.title}
          className="w-full h-32 object-cover"
        />
      )}

      <div className="p-4">
        {notification.discount_text && (
          <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
            {notification.discount_text}
          </div>
        )}

        <h3 className="font-bold text-lg mb-1">{notification.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {notification.body}
        </p>

        {notification.coupon_code && (
          <div className="bg-white border-2 border-dashed border-primary rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Coupon Code</p>
                <p className="font-mono font-bold text-lg text-primary">
                  {notification.coupon_code}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(notification.coupon_code!);
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            {notification.minimum_order_value && (
              <p className="text-xs text-muted-foreground mt-2">
                Min. order: ₹{notification.minimum_order_value}
              </p>
            )}
          </div>
        )}

        {notification.valid_until && (
          <p className="text-xs text-orange-600 mb-3">
            Valid until:{" "}
            {new Date(notification.valid_until).toLocaleDateString()}
          </p>
        )}

        {notification.buttons && notification.buttons.length > 0 && (
          <div className="flex gap-2">
            {notification.buttons.map((button, idx) =>
              renderButton(button, idx)
            )}
          </div>
        )}

        {notification.terms_and_conditions && (
          <details className="mt-3">
            <summary className="text-xs text-muted-foreground cursor-pointer">
              Terms & Conditions
            </summary>
            <p className="text-xs text-muted-foreground mt-2">
              {notification.terms_and_conditions}
            </p>
          </details>
        )}
      </div>
    </Card>
  );
}
