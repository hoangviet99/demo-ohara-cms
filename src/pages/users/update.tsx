import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import UserForm from './components/UserForm';
import { userApi } from '../../api/user';
import type { User } from '../../types/user';
import toast from 'react-hot-toast';

export default function UpdateUserPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUser(parseInt(id));
    }
  }, [id]);

  const fetchUser = async (userId: number) => {
    try {
      const res = await userApi.getUser(userId);
      setUser(res.data);
    } catch (err: any) {
      toast.error('Failed to load user details');
    }
  };

  const fromPage = searchParams.get("fromPage");

  const handleSubmit = async (data: Partial<User>) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await userApi.updateUser(parseInt(id), data);
      toast.success('User updated successfully');
      navigate(fromPage ? `/users?page=${fromPage}` : '/users');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Update User</h1>
        <p className="text-slate-500">Modify user information.</p>
      </div>

      <UserForm 
        initialData={user} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        isEdit={true} 
      />
    </div>
  );
}
