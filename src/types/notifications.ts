/**
 * Rich Notification Payload Types
 * Supports various notification formats with rich content
 */

export type ButtonType = "LINK" | "DEEPLINK" | "ACTION" | "DISMISS";
export type MediaType = "IMAGE" | "VIDEO" | "GIF";
export type CardStyle = "STANDARD" | "COMPACT" | "HERO" | "HORIZONTAL";
export type DiscountType = "PERCENTAGE" | "FLAT" | "BOGO" | "FREE_SHIPPING";

export interface ActionButton {
  text: string;
  action: string;
  button_type: ButtonType;
  icon_url?: string;
}

// Base notification interface
export interface BaseNotification {
  notification_id?: string;
  timestamp?: string;
  priority?: "HIGH" | "NORMAL" | "LOW";
  category?: string;
}

// 1. TEXT Notification
export interface TextNotification extends BaseNotification {
  type: "TEXT";
  title: string;
  body: string;
  click_action?: string;
}

// 2. MEDIA Notification
export interface MediaNotification extends BaseNotification {
  type: "MEDIA";
  title: string;
  body: string;
  media_url: string;
  media_type: MediaType;
  thumbnail_url?: string;
  caption?: string;
  click_action?: string;
}

// 3. CAROUSEL Notification
export interface CarouselItem {
  title: string;
  subtitle?: string;
  image_url: string;
  click_action?: string;
  buttons?: ActionButton[];
}

export interface CarouselNotification extends BaseNotification {
  type: "CAROUSEL";
  title: string;
  body?: string;
  items: CarouselItem[];
}

// 4. LIST Notification
export interface ListItem {
  title: string;
  subtitle?: string;
  image_url?: string;
  click_action?: string;
  metadata?: string;
}

export interface ListNotification extends BaseNotification {
  type: "LIST";
  title: string;
  body?: string;
  header_image_url?: string;
  items: ListItem[];
  footer_button?: ActionButton;
}

// 5. POLL Notification
export interface PollOption {
  id: string;
  text: string;
  image_url?: string;
}

export interface PollNotification extends BaseNotification {
  type: "POLL";
  question: string;
  body?: string;
  poll_id: string;
  image_url?: string;
  allow_multiple_selection: boolean;
  expires_at?: string;
  options: PollOption[];
}

// 6. CARD Notification
export interface CardNotification extends BaseNotification {
  type: "CARD";
  title: string;
  subtitle?: string;
  body: string;
  image_url?: string;
  header_image_url?: string;
  click_action?: string;
  style?: CardStyle;
  buttons?: ActionButton[];
}

// 7. PROMOTIONAL Notification
export interface PromotionalNotification extends BaseNotification {
  type: "PROMOTIONAL";
  title: string;
  body: string;
  image_url?: string;
  banner_url?: string;
  coupon_code?: string;
  discount_text?: string;
  discount_value?: number;
  discount_type?: DiscountType;
  minimum_order_value?: number;
  valid_from?: string;
  valid_until?: string;
  terms_and_conditions?: string;
  click_action?: string;
  buttons?: ActionButton[];
}

// Union type for all notification types
export type RichNotification =
  | TextNotification
  | MediaNotification
  | CarouselNotification
  | ListNotification
  | PollNotification
  | CardNotification
  | PromotionalNotification;

// Helper type guard functions
export const isTextNotification = (
  n: RichNotification
): n is TextNotification => n.type === "TEXT";

export const isMediaNotification = (
  n: RichNotification
): n is MediaNotification => n.type === "MEDIA";

export const isCarouselNotification = (
  n: RichNotification
): n is CarouselNotification => n.type === "CAROUSEL";

export const isListNotification = (
  n: RichNotification
): n is ListNotification => n.type === "LIST";

export const isPollNotification = (
  n: RichNotification
): n is PollNotification => n.type === "POLL";

export const isCardNotification = (
  n: RichNotification
): n is CardNotification => n.type === "CARD";

export const isPromotionalNotification = (
  n: RichNotification
): n is PromotionalNotification => n.type === "PROMOTIONAL";
