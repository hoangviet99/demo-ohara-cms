import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router';
import { userApi } from '../../api/user';
import type { User, PaginatedData } from '../../types/user';
import { EditIcon } from '../../components/icons/EditIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { SearchIcon } from '../../components/icons/SearchIcon';

export default function UserListPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<PaginatedData<User> | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({
    keyword: '',
    role: 'All',
    status: 'All',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, keyword, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getUsers({
        page: filters.page,
        limit: filters.limit,
        keyword: filters.keyword,
        role: filters.role,
        status: filters.status,
      });
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || !data || newPage > data.total_pages) return;
    setFilters({ ...filters, page: newPage });
  };



  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.deleteUser(id);
        fetchUsers();
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Failed to delete user';
        alert(msg);
        console.error('Failed to delete user', error);
      }
    }
  };



  return (
    <div className="p-6 h-full flex flex-col bg-slate-50/50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
          <p className="text-sm text-slate-500 mt-1">Total: {data?.total || 0} users</p>
        </div>
        <button
          onClick={() => navigate('/users/create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon size={18} />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Filter Section */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <SearchIcon size={16} />
              </div>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by name / email..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
              className="border border-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">Role: All</option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
              <option value="Manager">Manager</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="border border-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">Status: All</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : data?.items?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                data?.items?.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">#{user.id.toString().padStart(3, '0')}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.full_name || user.username}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.roles && user.roles.join(', ')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-700' : 
                        user.status === 'Blocked' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.created_at).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/users/update/${user.id}`)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                        >
                          <EditIcon size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors font-medium"
                        >
                          <TrashIcon size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {data && data.total_pages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing {(data.page - 1) * data.limit + 1}-{Math.min(data.page * data.limit, data.total)} of {data.total}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={data.page === 1}
                onClick={() => handlePageChange(data.page - 1)}
                className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-50"
              >
                &lt;
              </button>
              {/* Simple pagination logic for demo */}
              {Array.from({ length: Math.min(5, data.total_pages) }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                      data.page === pageNum
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {data.total_pages > 5 && <span className="text-slate-400 px-1">...</span>}
              {data.total_pages > 5 && (
                <button
                  onClick={() => handlePageChange(data.total_pages)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                    data.page === data.total_pages
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {data.total_pages}
                </button>
              )}
              <button
                disabled={data.page === data.total_pages}
                onClick={() => handlePageChange(data.page + 1)}
                className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
