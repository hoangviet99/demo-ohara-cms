import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { User } from '../../../types/user';
import { Input } from '../../../components/common/Input';
import { SwitchButton } from '../../../components/common/SwitchButton';

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
  isEdit?: boolean;
}

const ROLES = ['Admin', 'Customer', 'Manager'];

export default function UserForm({ initialData, onSubmit, isLoading, isEdit = false }: UserFormProps) {
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({
    username: '',
    email: '',
    full_name: '',
    roles: ['Customer'],
    is_active: true,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'is_active') {
        setFormData({ ...formData, [name]: checked });
      } else {
        // Handle roles checkbox
        const currentRoles = formData.roles || [];
        if (checked) {
          setFormData({ ...formData, roles: [...currentRoles, value] });
        } else {
          setFormData({ ...formData, roles: currentRoles.filter((r) => r !== value) });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Username *"
          type="text"
          name="username"
          value={formData.username || ''}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Email *"
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          required
        />

        {!isEdit && (
          <Input
            label="Password *"
            type="password"
            name="password"
            value={formData.password || ''}
            onChange={handleChange}
            required={!isEdit}
          />
        )}

        <Input
          label="Full Name"
          type="text"
          name="full_name"
          value={formData.full_name || ''}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Roles</label>
        <div className="flex flex-wrap gap-4">
          {ROLES.map((role) => (
            <label key={role} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="roles"
                value={role}
                checked={(formData.roles || []).includes(role)}
                onChange={handleChange}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">{role}</span>
            </label>
          ))}
        </div>
      </div>

      {!isEdit && (
        <div className="pt-2">
          <SwitchButton
            name="is_active"
            checked={!!formData.is_active}
            onChange={handleChange}
            label="Active"
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save User'}
        </button>
      </div>
    </form>
  );
}
