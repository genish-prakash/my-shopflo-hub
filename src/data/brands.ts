export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  isWishlisted: boolean;
  inStock: boolean;
  isOnSale: boolean;
  createdAt: Date;
  salesCount: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  color: string;
  isFollowed: boolean;
  products: Product[];
}

export const mockBrands: Brand[] = [
  {
    id: "1",
    name: "Blissclub",
    logo: "https://logo.clearbit.com/blissclub.com",
    color: "#7C3AED",
    isFollowed: false,
    products: [
      { id: "1a", name: "Move All Day Pants", price: 2799, originalPrice: 3499, image: "👖", isWishlisted: false, inStock: true, isOnSale: true, createdAt: new Date('2024-01-15'), salesCount: 1520 },
      { id: "1b", name: "Cloud Soft Bra", price: 1999, image: "👙", isWishlisted: true, inStock: true, isOnSale: false, createdAt: new Date('2024-02-20'), salesCount: 980 },
      { id: "1c", name: "Groove-In Shorts", price: 1499, image: "🩳", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-03-10'), salesCount: 750 },
      { id: "1d", name: "Ultimate Tank", price: 1299, originalPrice: 1599, image: "👕", isWishlisted: false, inStock: false, isOnSale: true, createdAt: new Date('2024-04-05'), salesCount: 620 },
      { id: "1e", name: "Power Leggings", price: 2499, image: "🦵", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-05-01'), salesCount: 890 },
      { id: "1f", name: "Sports Jacket", price: 3299, image: "🧥", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-06-15'), salesCount: 420 },
    ],
  },
  {
    id: "2",
    name: "Nestasia",
    logo: "https://logo.clearbit.com/nestasia.in",
    color: "#D97706",
    isFollowed: true,
    products: [
      { id: "2a", name: "Ceramic Vase", price: 1899, image: "🏺", isWishlisted: true, inStock: true, isOnSale: false, createdAt: new Date('2024-01-20'), salesCount: 340 },
      { id: "2b", name: "Cushion Cover", price: 799, originalPrice: 999, image: "🛋️", isWishlisted: false, inStock: true, isOnSale: true, createdAt: new Date('2024-02-10'), salesCount: 890 },
      { id: "2c", name: "Table Runner", price: 1299, image: "🎀", isWishlisted: false, inStock: false, isOnSale: false, createdAt: new Date('2024-03-05'), salesCount: 210 },
      { id: "2d", name: "Wall Art", price: 2499, image: "🖼️", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-04-12'), salesCount: 150 },
      { id: "2e", name: "Scented Candle", price: 599, image: "🕯️", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-05-20'), salesCount: 1200 },
      { id: "2f", name: "Photo Frame", price: 899, image: "📸", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-06-01'), salesCount: 560 },
    ],
  },
  {
    id: "3",
    name: "Dot & Key",
    logo: "https://logo.clearbit.com/dotandkey.com",
    color: "#EC4899",
    isFollowed: false,
    products: [
      { id: "3a", name: "Vitamin C Serum", price: 695, image: "💧", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-01-05'), salesCount: 2100 },
      { id: "3b", name: "Lip Balm Set", price: 445, originalPrice: 595, image: "💋", isWishlisted: true, inStock: true, isOnSale: true, createdAt: new Date('2024-02-15'), salesCount: 1800 },
      { id: "3c", name: "Sunscreen SPF 50", price: 545, image: "☀️", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-03-20'), salesCount: 1650 },
      { id: "3d", name: "Night Cream", price: 795, image: "🌙", isWishlisted: false, inStock: false, isOnSale: false, createdAt: new Date('2024-04-25'), salesCount: 920 },
      { id: "3e", name: "Face Wash", price: 395, image: "🧴", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-05-10'), salesCount: 1400 },
      { id: "3f", name: "Hair Serum", price: 645, image: "✨", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-06-05'), salesCount: 780 },
    ],
  },
  {
    id: "4",
    name: "Two Brothers",
    logo: "https://logo.clearbit.com/twobrothersindiashop.com",
    color: "#16A34A",
    isFollowed: true,
    products: [
      { id: "4a", name: "A2 Cow Ghee", price: 1299, image: "🥛", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-01-10'), salesCount: 3200 },
      { id: "4b", name: "Wild Forest Honey", price: 599, originalPrice: 749, image: "🍯", isWishlisted: true, inStock: true, isOnSale: true, createdAt: new Date('2024-02-05'), salesCount: 2800 },
      { id: "4c", name: "Cold Pressed Oil", price: 449, image: "🫒", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-03-15'), salesCount: 1900 },
      { id: "4d", name: "Organic Jaggery", price: 349, image: "🧈", isWishlisted: false, inStock: false, isOnSale: false, createdAt: new Date('2024-04-20'), salesCount: 2400 },
      { id: "4e", name: "Peanut Butter", price: 399, image: "🥜", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-05-25'), salesCount: 1600 },
      { id: "4f", name: "Turmeric Powder", price: 299, image: "🌿", isWishlisted: false, inStock: true, isOnSale: false, createdAt: new Date('2024-06-10'), salesCount: 2100 },
    ],
  },
];
