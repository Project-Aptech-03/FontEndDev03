
import { useState, useEffect } from 'react';
import { Book } from '../@type/book';
import { getProducts } from '../api/products.api';

const mapProductsToBooks = (products: any[]): Book[] => {
  return products.map((p) => ({
    id: p.id,
    title: p.productName,
    author: p.author,
    price: p.price,
    originalPrice: undefined,
    rating: undefined,
    reviewCount: undefined,
    description: p.description,
    inStock: p.stockQuantity > 0,
    category: p.category?.categoryName,
    manufacturer: p.manufacturer?.manufacturerName,
    publisher: p.publisher?.publisherName,
    image: p.photos?.[0]?.photoUrl || '',
    photos: p.photos?.map((photo: { photoUrl: string; }) => photo.photoUrl) || [],
    productCode: p.productCode,
    productType: p.productType,
    pages: p.pages,
    dimensions: p.dimensions,
    weight: p.weight,
    stockQuantity: p.stockQuantity,
    createdDate: p.createdDate
  }));
};

interface UseBooksParams {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
  categoriesId?: number;
  manufacturerId?: number;
}

export const useBooks = (
    pageIndex: number = 1,
    pageSize: number = 20,
    keyword?: string,
    categoriesId?: number,
    manufacturerId?: number
) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getProducts(
            pageIndex,
            pageSize,
            keyword,
            categoriesId,
            manufacturerId
        );

        if (response.success && response.data) {
          const mappedBooks = mapProductsToBooks(response.data.items);
          setBooks(mappedBooks);
          setTotalCount(response.data.totalCount);
          setTotalPages(response.data.totalPages);
        } else {
          throw new Error(response.message || 'API returned no data');
        }
      } catch (err: any) {
        console.error('Error fetching books:', err);
        setError(err.message || 'Failed to fetch books');
        setBooks([]);
        setTotalCount(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [pageIndex, pageSize, keyword, categoriesId, manufacturerId]);

  return {
    books,
    loading,
    error,
    totalCount,
    totalPages
  };
};