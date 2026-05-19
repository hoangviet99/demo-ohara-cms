import { useState } from 'react';
import { useNavigate } from 'react-router';
import UserForm from './components/UserForm';
import { userApi } from '../../api/user';
import type { User } from '../../types/user';

export default function CreateUserPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      await userApi.createUser(data);
      navigate('/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create User</h1>
        <p className="text-slate-500">Add a new user to the system.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
