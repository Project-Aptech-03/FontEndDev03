import { useState, useEffect } from 'react';
import { getCategory } from '../api/category.api';

// Hook for fetching categories
export const useCategories = () => {
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategory(1, 100); // Get first 100 categories
      // The response should have a structure like { data: { items: Category[] } }
      const categoriesData = response?.data?.items || [];
      // Map to the expected format
      const mappedCategories = categoriesData.map((category: any) => ({
        id: category.id,
        name: category.categoryName
      }));
      setCategories(mappedCategories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};
