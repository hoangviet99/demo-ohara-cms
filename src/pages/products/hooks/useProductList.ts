// hook for product list
import { useState, useCallback, useEffect } from "react";
import type { Product, ProductQueryParams } from "../../../types/product";
import { getProducts, deleteProduct, updateProductStatus } from "../../../api/product";

interface UseProductListOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface UseProductListReturn {
  products: Product[];
  loading: boolean;
  error: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  keyword: string;
  fetchProducts: () => Promise<void>;
  handleDelete: (product: Product) => Promise<void>;
  handleToggleStatus: (product: Product) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setKeyword: (keyword: string) => void;
  setSearchInput: (value: string) => void;
  searchInput: string;
  isDeleting: boolean;
}

export function useProductList(
  options: UseProductListOptions = {}
): UseProductListReturn {
  const { initialPage = 1, initialLimit = 10 } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: ProductQueryParams = { page, limit };
      if (keyword) {
        params.keyword = keyword;
      }
      const response = await getProducts(params);
      setProducts(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, limit, keyword]);

  useEffect(() => {
    fetchProducts();
  }, [page, limit, keyword]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDelete = useCallback(async (product: Product) => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      fetchProducts();
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Failed to delete product"
      );
    } finally {
      setIsDeleting(false);
    }
  }, [fetchProducts]);

  const handleToggleStatus = useCallback(async (product: Product) => {
    try {
      await updateProductStatus(product.id, !product.is_active);
      fetchProducts();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to update status");
    }
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    keyword,
    fetchProducts,
    handleDelete,
    handleToggleStatus,
    setPage,
    setLimit,
    setKeyword,
    setSearchInput,
    searchInput,
    isDeleting,
  };
}

export type { UseProductListReturn };
