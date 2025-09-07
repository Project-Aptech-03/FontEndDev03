import { useState, useEffect } from 'react';
import { AdminProduct, ProductFormData } from '../@type/adminProduct';
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '../api/adminProducts.api';
import { ProductsResponseDto } from '../@type/productsResponse';

// Mock data for fallback
const mockProducts: AdminProduct[] = [
  {
    id: 1,
    productCode: "12dsauf",
    productName: "Sach Hay",
    description: "HIHIHIHII",
    author: "Nguyen tien dat",
    productType: "book",
    pages: 10,
    dimensions: "ok",
    weight: 1.00,
    price: 19.00,
    stockQuantity: 12,
    isActive: true,
    createdDate: "2025-09-05T06:01:06.1833333",
    category: null,
    manufacturer: null,
    publisher: null,
    photos: [],
  },
];
const mapToAdminProduct = (product: ProductsResponseDto): AdminProduct => {
  return {
    id: product.id,
    productCode: product.productCode,
    productName: product.productName,
    description: product.description,
    author: product.author,
    productType: product.productType,
    pages: product.pages,
    dimensions: product.dimensions,
    weight: product.weight,
    price: product.price,
    stockQuantity: product.stockQuantity,
    isActive: product.isActive,
    createdDate: product.createdDate,
    category: product.category
        ? {
          id: product.category.id,
          categoryCode: product.category.categoryCode,
          categoryName: product.category.categoryName,
          isActive: product.category.isActive,
          createdDate: product.category.createdDate,
          productCount: product.category.productCount,
        }
        : null,
    manufacturer: product.manufacturer
        ? {
          id: product.manufacturer.id,
          manufacturerCode: product.manufacturer.manufacturerCode,
          manufacturerName: product.manufacturer.manufacturerName,
          isActive: product.manufacturer.isActive,
          createdDate: product.manufacturer.createdDate,
          productCount: product.manufacturer.productCount,
        }
        : null,
    publisher: product.publisher
        ? {
          id: product.publisher.id,
          publisherName: product.publisher.publisherName,
          publisherAddress: product.publisher.publisherAddress,
          contactInfo: product.publisher.contactInfo,
          isActive: product.publisher.isActive,
          createdDate: product.publisher.createdDate,
          productCount: product.publisher.productCount,
        }
        : null,
    photos: product.photos.map((url, index) => ({
      id: index,
      photoUrl: url,
      isActive: true,
      createdDate: new Date().toISOString(),
    })),
  };
};


export const useAdminProducts = (pageIndex: number = 1, pageSize: number = 20) => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getAdminProducts(pageIndex, pageSize);
        
        if (response.success && response.data) {
          const mappedProducts = response.data.items.map(mapToAdminProduct);
          setProducts(mappedProducts);
          setTotalCount(response.data.totalCount);
          setTotalPages(response.data.totalPages);
        } else {
          console.warn('API failed, using mock data');
          setProducts(mockProducts);
          setTotalCount(mockProducts.length);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
        setProducts(mockProducts);
        setTotalCount(mockProducts.length);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageIndex, pageSize]);

  const handleCreateProduct = async (productData: ProductFormData) => {
    try {
      const response = await createProduct(productData);
      if (response.success) {
        const updatedResponse = await getAdminProducts(pageIndex, pageSize);
        if (updatedResponse.success && updatedResponse.data) {
          const mappedProducts = updatedResponse.data.items.map(mapToAdminProduct);
          setProducts(mappedProducts);
        }
        return { success: true };
      }
      return { success: false, error: 'Failed to create product' };
    } catch (err) {
      console.error('Error creating product:', err);
      return { success: false, error: 'Failed to create product' };
    }
  };

  const handleUpdateProduct = async (id: number, productData: ProductFormData) => {
    try {
      const response = await updateProduct(id, productData);
      if (response.success) {
        const updatedResponse = await getAdminProducts(pageIndex, pageSize);
        if (updatedResponse.success && updatedResponse.data) {
          const mappedProducts = updatedResponse.data.items.map(mapToAdminProduct);
          setProducts(mappedProducts);
        }
        return { success: true };
      }
      return { success: false, error: 'Failed to update product' };
    } catch (err) {
      console.error('Error updating product:', err);
      return { success: false, error: 'Failed to update product' };
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const response = await deleteProduct(id);
      if (response.success) {
        // Remove from local state
        setProducts(prev => prev.filter(p => p.id !== id));
        setTotalCount(prev => prev - 1);
        return { success: true };
      }
      return { success: false, error: 'Failed to delete product' };
    } catch (err) {
      console.error('Error deleting product:', err);
      return { success: false, error: 'Failed to delete product' };
    }
  };

  return {
    products,
    loading,
    error,
    totalCount,
    totalPages,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    refetch: () => {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await getAdminProducts(pageIndex, pageSize);
          if (response.success && response.data) {
            const mappedProducts = response.data.items.map(mapToAdminProduct);
            setProducts(mappedProducts);
            setTotalCount(response.data.totalCount);
            setTotalPages(response.data.totalPages);
          }
        } catch (err) {
          console.error('Error refetching products:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  };
};
