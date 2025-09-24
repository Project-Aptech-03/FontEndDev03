// hooks/useBooks.ts
import { useState, useEffect, useCallback } from 'react';
import { Book } from '../@type/book';
import { getProducts } from '../api/products.api';

const mapProductsToBooks = (products: any[]): Book[] => {
  return products.map((p) => ({
    id: p.id,
    title: p.productName,
    author: p.author,
    price: p.price,
    description: p.description,
    inStock: p.stockQuantity > 0,
    category: p.category?.categoryName,
    manufacturer: p.manufacturer?.manufacturerName,
    publisher: p.publisher?.publisherName,
    image: p.photos?.[0]?.photoUrl || '',
    photos: p.photos?.map((photo: { photoUrl: string }) => photo.photoUrl) || [],
    productCode: p.productCode,
    productType: p.productType,
    pages: p.pages,
    dimensions: p.dimensions,
    weight: p.weight,
    stockQuantity: p.stockQuantity,
    createdDate: p.createdDate
  }));
};

export const useBooks = (
    initialKeyword = '',
    initialCategoryId?: number,
    initialManufacturerId?: number
) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(
      async (keyword = initialKeyword, categoryId?: number, manufacturerId?: number) => {
        try {
          setLoading(true);
          setError(null);
          const response = await getProducts(1, 100, keyword, categoryId, manufacturerId);

          if (response.success && response.data) {
            setBooks(mapProductsToBooks(response.data.items));
          } else {
            throw new Error(response.message || 'API returned no data');
          }
        } catch (err: any) {
          console.error('Error fetching books:', err);
          setError(err.message || 'Failed to fetch books');
          setBooks([]);
        } finally {
          setLoading(false);
        }
      },
      [initialKeyword, initialCategoryId, initialManufacturerId]
  );

  // fetch ngay lần đầu
  useEffect(() => {
    fetchBooks(initialKeyword, initialCategoryId, initialManufacturerId);
  }, [fetchBooks, initialKeyword, initialCategoryId, initialManufacturerId]);

  return {
    books,
    setBooks,
    loading,
    error,
    fetchBooks, // ✅ trả về để BookStore gọi lại khi search
  };
};
