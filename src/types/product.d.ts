// Product represents a product entity
export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: string;
  sale_price: string;
  thumbnail: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Request types for creating/updating products
export interface CreateProductRequest {
  name: string;
  slug?: string;
  sku?: string;
  description?: string;
  price: string;
  sale_price?: string;
  thumbnail?: string;
}

export interface UpdateProductRequest {
  name?: string;
  slug?: string;
  sku?: string;
  description?: string;
  price?: string;
  sale_price?: string;
  thumbnail?: string;
}

// Query parameters for product listing
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  keyword?: string;
}

// API response types
export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ProductDetailResponse extends Product {}

// API error response
export interface ApiErrorResponse {
  code: string;
  message: string;
}
