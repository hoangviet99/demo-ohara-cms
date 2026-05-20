import { useState, useEffect } from "react";
import { CustomButton } from "../../../components/common/CustomButton";
import { SpinnerIcon } from "../../../components/icons";
import { generateSlug, generateSKU } from "../../../utils/slugify";
import type { Product, CreateProductRequest, UpdateProductRequest } from "../../../types/product";

interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    slug: "",
    sku: "",
    description: "",
    price: "",
    sale_price: "",
    thumbnail: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [slugApiError, setSlugApiError] = useState<string>("");
  const [skuEdited, setSkuEdited] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        name: initialData.name,
        slug: initialData.slug,
        sku: initialData.sku,
        description: initialData.description,
        price: initialData.price,
        sale_price: initialData.sale_price,
        thumbnail: initialData.thumbnail,
      });
      setSkuEdited(false);
      setSlugEdited(false);
    }
  }, [initialData, mode]);

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
    setSlugApiError("");
    if (!slugEdited && value.trim()) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
    if (!skuEdited && value.trim()) {
      setFormData((prev) => ({ ...prev, sku: generateSKU(value) }));
    }
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setSlugApiError("");
    setFormData((prev) => ({ ...prev, slug: value.toLowerCase() }));
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  const handleSKUChange = (value: string) => {
    setSkuEdited(true);
    setFormData((prev) => ({ ...prev, sku: value.toUpperCase() }));
    if (errors.sku) {
      setErrors((prev) => ({ ...prev, sku: "" }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "name") {
      handleNameChange(value);
    } else if (name === "slug") {
      handleSlugChange(value);
    } else if (name === "sku") {
      handleSKUChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (formData.sale_price && (isNaN(Number(formData.sale_price)) || Number(formData.sale_price) < 0)) {
      newErrors.sale_price = "Sale price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const { createProduct } = await import("../../../api/product");
        await createProduct(formData);
      } else {
        const { updateProduct } = await import("../../../api/product");
        if (initialData) {
          const data: UpdateProductRequest = { ...formData };
          await updateProduct(initialData.id, data);
        }
      }
      onSuccess();
    } catch (error: any) {
      const errCode = error.response?.data?.code;
      const errMsg = error.response?.data?.message || "An error occurred. Please try again.";
      if (errCode === "PRD-026" || errCode === "PRD-027") {
        setSlugApiError(errMsg);
        setApiError("");
      } else {
        setApiError(errMsg);
        setSlugApiError("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-slate-900">
        {mode === "create" ? "Add New Product" : "Edit Product"}
      </h2>

      {apiError && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-200"
            }`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="mb-1 block text-sm font-medium text-slate-700">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2 ${
              errors.slug
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-200"
            }`}
            placeholder="Auto-generated from name"
          />
          {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
          {slugApiError && <p className="mt-1 text-xs text-red-500">{slugApiError}</p>}
          <p className="mt-1 text-xs text-slate-400">
            {slugEdited
              ? "Custom slug - will not auto-regenerate when name changes"
              : "Auto-generated from product name. Appears in the product URL."}
          </p>
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku" className="mb-1 block text-sm font-medium text-slate-700">
            SKU
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={(e) => handleSKUChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Auto-generated from name"
          />
          <p className="mt-1 text-xs text-slate-400">
            {skuEdited
              ? "Custom SKU - will not auto-regenerate when name changes"
              : "Auto-generated from product name. Used for inventory management."}
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Enter product description"
          />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium text-slate-700">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 pr-8 text-sm transition focus:outline-none focus:ring-2 ${
                  errors.price
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-200"
                }`}
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">VND</span>
            </div>
            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
          </div>

          {/* Sale Price */}
          <div>
            <label htmlFor="sale_price" className="mb-1 block text-sm font-medium text-slate-700">
              Sale Price
            </label>
            <div className="relative">
              <input
                type="text"
                id="sale_price"
                name="sale_price"
                value={formData.sale_price}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2.5 pr-8 text-sm transition focus:outline-none focus:ring-2 ${
                  errors.sale_price
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-200"
                }`}
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">VND</span>
            </div>
            {errors.sale_price && <p className="mt-1 text-xs text-red-500">{errors.sale_price}</p>}
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label htmlFor="thumbnail" className="mb-1 block text-sm font-medium text-slate-700">
            Thumbnail URL
          </label>
          <input
            type="url"
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="https://example.com/image.jpg"
          />
          {formData.thumbnail && (
            <div className="mt-2">
              <img
                src={formData.thumbnail}
                alt="Thumbnail preview"
                className="h-20 w-20 rounded-lg border border-slate-200 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
          <CustomButton
            type="button"
            onClick={onCancel}
            className="bg-slate-100 text-slate-700 hover:bg-slate-200"
            disabled={isSubmitting}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            className="min-w-[120px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <SpinnerIcon className="h-4 w-4" />
                Saving...
              </span>
            ) : mode === "create" ? (
              "Create Product"
            ) : (
              "Update Product"
            )}
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
