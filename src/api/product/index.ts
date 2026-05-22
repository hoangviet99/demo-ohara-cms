import axiosClient from "../axiosClient";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
  ProductListResponse,
} from "../../types/product";

// Fetch paginated list of products with optional keyword filter
export const getProducts = async (params?: ProductQueryParams): Promise<ProductListResponse> => {
  return axiosClient.get<any, ProductListResponse>("/products", { params });
};

// Fetch a single product by ID
export const getProduct = async (id: number): Promise<Product> => {
  return axiosClient.get<any, Product>(`/products/${id}`);
};

// Create a new product
export const createProduct = async (data: CreateProductRequest): Promise<Product> => {
  const payload = {
    name: data.name,
    slug: data.slug,
    sku: data.sku,
    description: data.description,
    price: Number(data.price) || 0,
    sale_price: data.sale_price ? Number(data.sale_price) : null,
    thumbnail: data.thumbnail,
    category_id: data.category_id ?? null,
  };
  return axiosClient.post<any, Product>("/products", payload);
};

// Update an existing product
export const updateProduct = async (id: number, data: UpdateProductRequest): Promise<Product> => {
  const payload = {
    name: data.name,
    slug: data.slug,
    sku: data.sku,
    description: data.description,
    price: data.price !== undefined ? Number(data.price) : undefined,
    sale_price: data.sale_price ? Number(data.sale_price) : undefined,
    thumbnail: data.thumbnail,
    category_id: data.category_id,
  };
  return axiosClient.put<any, Product>(`/products/${id}`, payload);
};

// Delete a product (soft delete)
export const deleteProduct = async (id: number): Promise<void> => {
  return axiosClient.delete(`/products/${id}`);
};

// Update product status (is_active field only)
export const updateProductStatus = async (id: number, isActive: boolean): Promise<Product> => {
  return axiosClient.patch<any, Product>(`/products/${id}/status`, { is_active: isActive });
};
