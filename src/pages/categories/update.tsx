import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import CategoryForm from './components/CategoryForm';
import { categoryApi } from '../../api/category';
import type { Category } from '../../types/category';
import toast from 'react-hot-toast';

export default function UpdateCategoryPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCategory(parseInt(id));
    }
  }, [id]);

  const fetchCategory = async (categoryId: number) => {
    try {
      const res = await categoryApi.getCategory(categoryId);
      setCategory(res.data);
    } catch (err: any) {
      toast.error('Failed to load category details');
    }
  };

  const fromPage = searchParams.get("fromPage");

  const handleSubmit = async (data: Partial<Category>) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await categoryApi.updateCategory(parseInt(id), data);
      toast.success('Category updated successfully');
      navigate(fromPage ? `/categories?page=${fromPage}` : '/categories');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update category');
    } finally {
      setIsLoading(false);
    }
  };

  if (!category) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Update Category</h1>
        <p className="text-slate-500">Modify category information.</p>
      </div>

      <CategoryForm 
        initialData={category} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        isEdit={true} 
      />
    </div>
  );
}
