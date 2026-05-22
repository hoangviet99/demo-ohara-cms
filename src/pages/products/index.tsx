import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ProductTable } from "./components/ProductTable";
import { DeleteModal } from "./components/DeleteModal";
import { Pagination } from "../../components/common/Pagination";
import { FilterBar } from "../../components/common/FilterBar";
import { Select } from "../../components/common/Select";
import { STATUS_FILTER_OPTIONS } from "../../constants";
import type { Product, ProductQueryParams } from "../../types/product";
import { getProducts, deleteProduct, updateProductStatus } from "../../api/product";
import { categoryApi } from "../../api/category";
import type { Category } from "../../types/category";
import { SpinnerIcon } from "../../components/icons";
import { usePaginationHistory } from "../../hooks/usePaginationHistory";
import toast from "react-hot-toast";

function useProductList(page: number, limit: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    status: "All",
    category: "All",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryApi.getListCommon({});
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: ProductQueryParams = { page, limit };
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.category !== "All") params.is_category = filters.category;
      if (filters.status !== "All") params.is_active = filters.status === "active";
      const response = await getProducts(params);
      setProducts(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters.keyword, filters.category, filters.status]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        if (prev.keyword === searchInput) return prev;
        return { ...prev, keyword: searchInput };
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDelete = useCallback(
    async (product: Product) => {
      setIsDeleting(true);
      try {
        await deleteProduct(product.id);
        const params: ProductQueryParams = { page, limit };
        if (filters.keyword) params.keyword = filters.keyword;
        if (filters.category !== "All") params.is_category = filters.category;
        if (filters.status !== "All") params.is_active = filters.status === "active";
        const response = await getProducts(params);
        setProducts(response.items);
        setTotal(response.total);
      } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to delete product");
      } finally {
        setIsDeleting(false);
      }
    },
    [page, limit, filters.keyword, filters.category, filters.status]
  );

  const handleToggleStatus = useCallback(
    async (product: Product) => {
      try {
        await updateProductStatus(product.id, !product.is_active);
        const params: ProductQueryParams = { page, limit };
        if (filters.keyword) params.keyword = filters.keyword;
        if (filters.category !== "All") params.is_category = filters.category;
        if (filters.status !== "All") params.is_active = filters.status === "active";
        const response = await getProducts(params);
        setProducts(response.items);
        setTotal(response.total);
      } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to update status");
      }
    },
    [page, limit, filters.keyword, filters.category, filters.status]
  );

  return {
    products,
    loading,
    error,
    total,
    filters,
    fetchProducts,
    handleDelete,
    handleToggleStatus,
    setFilters,
    setSearchInput,
    searchInput,
    isDeleting,
    categories,
  };
}

export default function ProductListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { page, setPage } = usePaginationHistory({ scope: "products" });
  const limit = 10;

  const {
    products,
    loading,
    error,
    total,
    searchInput,
    setSearchInput,
    filters,
    handleDelete: deleteProduct,
    handleToggleStatus,
    setFilters,
    isDeleting,
    categories,
  } = useProductList(page, limit);

  const totalPages = Math.ceil(total / limit);

  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    product: Product | null;
  }>({
    show: false,
    product: null,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchParams((prev) => {
      if (newPage === 1) {
        prev.delete("page");
        return prev;
      }
      prev.set("page", String(newPage));
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (
    setter: (prev: typeof filters) => typeof filters
  ) => {
    setFilters(setter);
    setPage(1);
    setSearchParams((prev) => {
      prev.delete("page");
      return prev;
    });
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/${product.id}/edit${page > 1 ? `?fromPage=${page}` : ""}`);
  };

  const handleViewDetail = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteModal({ show: true, product });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.product) return;
    try {
      await deleteProduct(deleteModal.product);
      setDeleteModal({ show: false, product: null });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  const handleToggleStatusClick = (product: Product) => {
    handleToggleStatus(product).catch((err: Error) => {
      toast.error(err.message);
    });
  };

  const categoryOptions = [
    { value: "All", label: "Category: All" },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <button
          onClick={() => navigate("/products/create")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search by name or SKU..."
      >
        <Select
          value={filters.category}
          onChange={(e) =>
            handleFilterChange((prev) => ({ ...prev, category: e.target.value }))
          }
          options={categoryOptions}
        />
        <Select
          value={filters.status}
          onChange={(e) =>
            handleFilterChange((prev) => ({ ...prev, status: e.target.value }))
          }
          options={STATUS_FILTER_OPTIONS}
        />
      </FilterBar>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <SpinnerIcon className="h-8 w-8 text-blue-600" />
        </div>
      )}

      {/* Products Table */}
      {!loading && (
        <>
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onToggleStatus={handleToggleStatusClick}
            onViewDetail={handleViewDetail}
            isLoading={loading}
          />

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.product && (
        <DeleteModal
          product={deleteModal.product}
          isOpen={deleteModal.show}
          isDeleting={isDeleting}
          onClose={() => setDeleteModal({ show: false, product: null })}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
