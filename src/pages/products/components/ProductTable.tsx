import type { ChangeEvent } from "react";
import type { Product } from "../../../types/product";
import { ImageIcon } from "../../../components/icons";
import { TableActions } from "../../../components/common/TableActions";
import { SwitchButton } from "../../../components/common/SwitchButton";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
  onViewDetail: (product: Product) => void;
  isLoading: boolean;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetail,
  isLoading,
}: ProductTableProps) {
  if (isLoading) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Product
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Slug
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              SKU
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-8 text-center text-sm text-slate-500"
              >
                No products found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                        onError={(e) => {
                          (
                            e.target as HTMLImageElement
                          ).src = "https://via.placeholder.com/40";
                        }}
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                    <div className="min-w-0 max-w-[240px]">
                      <p className="text-sm font-medium text-slate-900 truncate" title={product.name}>
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate" title={product.description}>
                        {product.description || "No description"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                  {product.category ? (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {product.category.name}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                  {product.slug || "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                  {product.sku || "-"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <p className="font-medium text-slate-900">
                    {Number(product.price).toLocaleString()} VND
                  </p>
                  {product.sale_price &&
                    Number(product.sale_price) > 0 && (
                      <p className="text-xs text-slate-400 line-through">
                        {Number(product.sale_price).toLocaleString()} VND
                      </p>
                    )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <SwitchButton
                    checked={product.is_active}
                    onChange={() => onToggleStatus(product)}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                  <TableActions
                    onDetail={() => onViewDetail(product)}
                    onEdit={() => onEdit(product)}
                    onDelete={() => onDelete(product)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
