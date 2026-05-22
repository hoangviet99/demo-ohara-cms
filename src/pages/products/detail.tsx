import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import type { Product } from "../../types/product";
import { getProduct } from "../../api/product";
import { ChevronLeftIcon, ImageIcon, SpinnerIcon } from "../../components/icons";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProduct(Number(id));
        setProduct(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <SpinnerIcon className="h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="mb-4 text-sm text-red-600">{error}</p>
        <button
          onClick={() => navigate("/products")}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-lg bg-slate-50 p-6 text-center">
        <p className="mb-4 text-sm text-slate-600">Product not found</p>
        <button
          onClick={() => navigate("/products")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/products")}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Product Detail</h1>
        </div>
        <button
          onClick={() => navigate(`/products/${product.id}/edit`)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Edit Product
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Product Image */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center rounded-lg bg-slate-100 text-slate-400">
              <ImageIcon className="h-16 w-16 text-slate-400" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
            <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
              product.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
            }`}>
              {product.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="space-y-3">
            {/* Category */}
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">Category</span>
              <span className="text-sm font-medium text-slate-900">
                {product.category ? product.category.name : "—"}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">Slug</span>
              <span className="text-sm font-medium text-slate-900">{product.slug || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">SKU</span>
              <span className="text-sm font-medium text-slate-900">{product.sku || "-"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">Price</span>
              <span className="text-sm font-medium text-slate-900">
                {Number(product.price).toLocaleString()} VND
              </span>
            </div>
            {product.sale_price && Number(product.sale_price) > 0 && (
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Sale Price</span>
                <span className="text-sm font-medium text-red-600">
                  {Number(product.sale_price).toLocaleString()} VND
                </span>
              </div>
            )}
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">Created At</span>
              <span className="text-sm font-medium text-slate-900">
                {new Date(product.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Updated At</span>
              <span className="text-sm font-medium text-slate-900">
                {new Date(product.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Description</h3>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{product.description}</p>
        </div>
      )}
    </div>
  );
}
