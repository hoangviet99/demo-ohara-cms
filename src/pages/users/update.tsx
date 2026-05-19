import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import UserForm from './components/UserForm';
import { userApi } from '../../api/user';
import type { User } from '../../types/user';

export default function UpdateUserPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError('Failed to load user details');
    }
  };

  const handleSubmit = async (data: Partial<User>) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      await userApi.updateUser(parseInt(id), data);
      navigate('/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user && !error) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Update User</h1>
        <p className="text-slate-500">Modify user information.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {user && (
        <UserForm 
          initialData={user} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          isEdit={true} 
        />
      )}
    </div>
  );
}
