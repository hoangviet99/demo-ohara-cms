import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { categoryApi } from "../../api/category";
import type { Category } from "../../types/category";
import type { PaginatedData } from "../../types/common";
import { PlusIcon } from "../../components/icons/PlusIcon";
import { SwitchButton } from "../../components/common/SwitchButton";
import { CustomButton } from "../../components/common/CustomButton";
import { Pagination } from "../../components/common/Pagination";
import { FilterBar } from "../../components/common/FilterBar";
import { DataTable, type DataTableColumn } from "../../components/common/DataTable";
import { TableActions } from "../../components/common/TableActions";
import { STATUS_FILTER_OPTIONS } from "../../constants";
import { usePaginationHistory } from "../../hooks/usePaginationHistory";
import toast from "react-hot-toast";

export default function CategoryListPage() {
  const navigate = useNavigate();

  const { page, setPage } = usePaginationHistory({ scope: "categories" });
  const limit = 10;

  const [data, setData] = useState<PaginatedData<Category> | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState({
    keyword: "",
    status: "All",
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        keyword: filters.keyword,
      };
      if (filters.status !== "All") {
        params.is_active = filters.status === "active";
      }
      const res = await categoryApi.getCategories(params);
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters.keyword, filters.status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        if (prev.keyword === keyword) return prev;
        return { ...prev, keyword };
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (setter: (prev: typeof filters) => typeof filters) => {
    setFilters(setter);
    setPage(1);
  };

  const handleStatusToggle = async (category: Category) => {
    try {
      await categoryApi.updateStatus(category.id, !category.is_active);
      if (data) {
        setData({
          ...data,
          items: data.items.map((c) =>
            c.id === category.id ? { ...c, is_active: !c.is_active } : c
          ),
        });
      }
      toast.success("Status updated successfully");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update status";
      toast.error(msg);
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryApi.deleteCategory(id);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (error: any) {
        const msg = error.response?.data?.message || "Failed to delete category";
        toast.error(msg);
        console.error("Failed to delete category", error);
      }
    }
  };

  const columns: DataTableColumn<Category>[] = [
    {
      key: "id",
      header: "ID",
      render: (category) => (
        <span className="text-slate-500">#{category.id.toString().padStart(3, "0")}</span>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (category) => (
        <span className="font-medium text-slate-900">{category.name}</span>
      ),
    },
    {
      key: "code",
      header: "Code",
    },
    {
      key: "is_active",
      header: "Status",
      render: (category) => (
        <SwitchButton
          checked={category.is_active}
          onChange={() => handleStatusToggle(category)}
        />
      ),
    },
    {
      key: "created_at",
      header: "Created",
      render: (category) => (
        <span>{new Date(category.created_at).toISOString().split("T")[0]}</span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Total: {data?.total || 0} categories
          </p>
        </div>
        <CustomButton onClick={() => navigate("/categories/create")}>
          <PlusIcon size={18} />
          Add Category
        </CustomButton>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={keyword}
        onSearchChange={setKeyword}
        searchPlaceholder="Search by name / code..."
      >
        <select
          value={filters.status}
          onChange={(e) =>
            handleFilterChange((prev) => ({ ...prev, status: e.target.value }))
          }
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[120px]"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </FilterBar>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        rowKey={(category) => category.id}
        loading={loading}
        loadingMessage="Loading categories..."
        emptyMessage="No categories found."
        actions={(category) => (
          <TableActions
            onEdit={() =>
              navigate(
                `/categories/update/${category.id}${page > 1 ? `?fromPage=${page}` : ""}`
              )
            }
            onDelete={() => handleDelete(category.id)}
          />
        )}
      />

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <Pagination
            page={data.page}
            totalPages={data.total_pages}
            total={data.total}
            limit={data.limit}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
