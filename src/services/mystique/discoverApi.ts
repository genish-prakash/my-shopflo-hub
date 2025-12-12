/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticatedApi } from "../authenticatedApi";
import type {
  ApiResponse,
  DiscoverResponse,
  DiscoverBrand,
  DiscoverProduct,
} from "./types";

const BASE_PATH = "/discover";
const PRODUCTS_PATH = "/products";

// Raw API response structure for merchant products
interface MerchantProductVariant {
  variant_id: string;
  name: string;
  original_price: number;
  current_price: number;
  inventory_quantity: number;
  out_of_stock: boolean;
}

interface MerchantProductImage {
  src: string;
  is_primary: boolean;
}

interface MerchantProduct {
  merchant_id: string;
  product_id: string;
  name: string;
  description: string;
  product_type: string;
  status: string;
  variants: MerchantProductVariant[];
  images: MerchantProductImage[];
  tags: string[];
  vendor: string;
  all_variants_out_of_stock: boolean;
  created_at: number;
  updated_at: number;
}

interface MerchantProductsApiResponse {
  success: boolean;
  data: MerchantProduct[];
}

interface MerchantProductsResponse {
  products: DiscoverProduct[];
  total: number;
  offset: number;
  limit: number;
}

// Helper function to map MerchantProduct to DiscoverProduct
const mapMerchantProductToDiscoverProduct = (
  product: MerchantProduct
): DiscoverProduct => {
  const firstVariant = product.variants[0];
  const primaryImage =
    product.images.find((img) => img.is_primary)?.src ||
    product.images[0]?.src ||
    "";

  return {
    id: product.product_id,
    name: product.name,
    description: product.description,
    price: firstVariant?.current_price || 0,
    original_price: firstVariant?.original_price || null,
    image: primaryImage,
    in_stock: !product.all_variants_out_of_stock,
    is_on_sale: firstVariant
      ? firstVariant.original_price > firstVariant.current_price
      : false,
    created_at: product.created_at,
    sales_count: null,
  };
};

/**
 * Discover API Service
 * Endpoints require X-SHOPFLO-REQ-ID header which is automatically added by authenticatedApi
 */
export const discoverApi = {
  /**
   * Discover brands with pagination
   * GET /mystique/api/v1/discover
   * @param page - Page number (1-indexed)
   * @param pageSize - Number of items per page
   */
  getDiscoverBrands: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<DiscoverResponse> => {
    const response = await authenticatedApi.get<ApiResponse<DiscoverResponse>>(
      BASE_PATH,
      { params: { page, pageSize } }
    );
    return response.data;
  },

  /**
   * Get specific brand details
   * GET /mystique/api/v1/discover/:merchantId
   * @param merchantId - The merchant ID of the brand
   */
  getBrandDetails: async (merchantId: string): Promise<DiscoverBrand> => {
    const response = await authenticatedApi.get<ApiResponse<DiscoverBrand>>(
      `${BASE_PATH}/${merchantId}`
    );
    return response.data;
  },

  /**
   * Get all products for a merchant (paginated)
   * GET /mystique/api/v1/products/merchant/:merchantId
   * @param merchantId - The merchant ID
   * @param offset - Offset for pagination (1-indexed)
   * @param limit - Number of products to fetch
   */
  getMerchantProducts: async (
    merchantId: string,
    offset: number = 1,
    limit: number = 50
  ): Promise<MerchantProductsResponse> => {
    const response = await authenticatedApi.get<MerchantProductsApiResponse>(
      `${PRODUCTS_PATH}/merchant/${merchantId}`,
      { params: { offset, limit } }
    );

    // Map the raw API response to our DiscoverProduct format
    const products = response.data.map(mapMerchantProductToDiscoverProduct);

    return {
      products,
      total: products.length,
      offset,
      limit,
    };
  },

  /**
   * Get a single product for a merchant
   * GET /mystique/api/v1/products/merchant/:merchantId/:productId
   * @param merchantId - The merchant ID
   * @param productId - The product ID
   */
  getMerchantProduct: async (
    merchantId: string,
    productId: string
  ): Promise<DiscoverProduct> => {
    const response = await authenticatedApi.get<ApiResponse<MerchantProduct>>(
      `${PRODUCTS_PATH}/merchant/${merchantId}/${productId}`
    );
    return mapMerchantProductToDiscoverProduct(response.data);
  },
};

export default discoverApi;
