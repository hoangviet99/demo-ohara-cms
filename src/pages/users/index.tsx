import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { userApi } from "../../api/user";
import type { User } from "../../types/user";
import type { PaginatedData } from "../../types/common";
import { PlusIcon } from "../../components/icons/PlusIcon";
import { SwitchButton } from "../../components/common/SwitchButton";
import { CustomButton } from "../../components/common/CustomButton";
import { Pagination } from "../../components/common/Pagination";
import { FilterBar } from "../../components/common/FilterBar";
import { DataTable, type DataTableColumn } from "../../components/common/DataTable";
import { TableActions } from "../../components/common/TableActions";
import { STATUS_FILTER_OPTIONS, ROLE_FILTER_OPTIONS } from "../../constants";
import { usePaginationHistory } from "../../hooks/usePaginationHistory";
import toast from "react-hot-toast";

export default function UserListPage() {
  const navigate = useNavigate();

  const { page, setPage } = usePaginationHistory({ scope: "users" });
  const limit = 10;

  const [data, setData] = useState<PaginatedData<User> | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState({
    keyword: "",
    role: "All",
    status: "All",
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        keyword: filters.keyword,
        role: filters.role,
      };
      if (filters.status !== "All") {
        params.is_active = filters.status === "active";
      }
      const res = await userApi.getUsers(params);
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters.keyword, filters.role, filters.status]);

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
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (setter: (prev: typeof filters) => typeof filters) => {
    setFilters(setter);
    setPage(1);
  };

  const handleStatusToggle = async (user: User) => {
    try {
      await userApi.updateStatus(user.id, !user.is_active);
      if (data) {
        setData({
          ...data,
          items: data.items.map((u) =>
            u.id === user.id ? { ...u, is_active: !u.is_active } : u
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
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userApi.deleteUser(id);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error: any) {
        const msg = error.response?.data?.message || "Failed to delete user";
        toast.error(msg);
        console.error("Failed to delete user", error);
      }
    }
  };

  const columns: DataTableColumn<User>[] = [
    {
      key: "id",
      header: "ID",
      render: (user) => (
        <span className="text-slate-500">#{user.id.toString().padStart(3, "0")}</span>
      ),
    },
    {
      key: "full_name",
      header: "Name",
      render: (user) => (
        <span className="font-medium text-slate-900">{user.full_name || user.username}</span>
      ),
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "roles",
      header: "Role",
      render: (user) => <span>{user.roles?.join(", ")}</span>,
    },
    {
      key: "is_active",
      header: "Status",
      render: (user) => (
        <SwitchButton
          checked={user.is_active}
          onChange={() => handleStatusToggle(user)}
        />
      ),
    },
    {
      key: "created_at",
      header: "Created",
      render: (user) => (
        <span>{new Date(user.created_at).toISOString().split("T")[0]}</span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
          <p className="text-sm text-slate-500 mt-1">Total: {data?.total || 0} users</p>
        </div>
        <CustomButton onClick={() => navigate("/users/create")}>
          <PlusIcon size={18} />
          Add User
        </CustomButton>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={keyword}
        onSearchChange={setKeyword}
        searchPlaceholder="Search by name / email..."
      >
        <select
          value={filters.role}
          onChange={(e) =>
            handleFilterChange((prev) => ({ ...prev, role: e.target.value }))
          }
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[120px]"
        >
          {ROLE_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
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
        rowKey={(user) => user.id}
        loading={loading}
        loadingMessage="Loading users..."
        emptyMessage="No users found."
        actions={(user) => (
          <TableActions
            onEdit={() =>
              navigate(`/users/update/${user.id}${page > 1 ? `?fromPage=${page}` : ""}`)
            }
            onDelete={() => handleDelete(user.id)}
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
