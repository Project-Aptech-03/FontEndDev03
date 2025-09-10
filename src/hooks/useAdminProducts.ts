import { useState, useEffect } from 'react';
import {Products, ProductFormData, Category, Manufacturer, Publisher, toFormData} from '../@type/products';

import {ProductsResponseDto} from '../@type/productsResponse';
import {getCategory} from "../api/category.api";
import {getManufacturers} from "../api/manufacturer.api";
import {getPublishers} from "../api/publisher.api";
import {createProduct, deleteProduct, getProducts, updateProduct} from "../api/products.api";
const mapToAdminProduct = (product: ProductsResponseDto): Products => {
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
    photos: product.photos.map((photo, index) => ({
      id: photo.id || index,
      photoUrl: photo.photoUrl,
      isActive: photo.isActive ?? true,
      createdDate: photo.createdDate || new Date().toISOString(),
    })),

  };
};
const mapToCategory = (dto: any): Category => {
  return {
    id: dto.id,
    categoryCode: dto.categoryCode,
    categoryName: dto.categoryName,
    isActive: dto.isActive,
    createdDate: dto.createdDate,
    productCount: dto.productCount,
  };
};
const mapToManufacturer = (dto: any): Manufacturer => ({
  id: dto.id,
  manufacturerCode: dto.manufacturerCode,
  manufacturerName: dto.manufacturerName,
  isActive: dto.isActive,
  createdDate: dto.createdDate,
  productCount: dto.productCount,
});

const mapToPublisher = (dto: any): Publisher => ({
  id: dto.id,
  publisherName: dto.publisherName,
  publisherAddress: dto.publisherAddress,
  contactInfo: dto.contactInfo,
  isActive: dto.isActive,
  createdDate: dto.createdDate,
  productCount: dto.productCount,
});





export const useAdminProducts = (pageIndex: number = 1, pageSize: number = 20) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsRes, categoriesRes, manufacturersRes, publishersRes] = await Promise.all([
          getProducts(pageIndex, pageSize),
          getCategory(pageIndex, pageSize),
          getManufacturers(pageIndex, pageSize),
          getPublishers(pageIndex, pageSize)
        ]);

        // products
        if (productsRes.success && productsRes.data) {
          const mappedProducts = productsRes.data.items.map(mapToAdminProduct);
          setProducts(mappedProducts);
          setTotalCount(productsRes.data.totalCount);
          setTotalPages(productsRes.data.totalPages);
        }

        if (categoriesRes.success && categoriesRes.data?.items) {
          const mappedCategories = categoriesRes.data.items.map(mapToCategory);
          setCategories(mappedCategories);
        }

        // manufacturers
        if (manufacturersRes.success && manufacturersRes.data?.items) {
          const mappedManufacturers = manufacturersRes.data.items.map(mapToManufacturer);
          setManufacturers(mappedManufacturers);
        }

        // publishers
        if (publishersRes.success && publishersRes.data?.items) {
          const mappedPublishers = publishersRes.data.items.map(mapToPublisher);
          setPublishers(mappedPublishers);
        }


      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [pageIndex, pageSize]);

  const handleCreateProduct = async (productData: ProductFormData) => {
    try {
      const formData = toFormData(productData);
      const response = await createProduct(formData);

      if (response.success) {
        const updatedResponse = await getProducts(pageIndex, pageSize);
        if (updatedResponse.success && updatedResponse.data) {
          const mappedProducts = updatedResponse.data.items.map(mapToAdminProduct);
          setProducts(mappedProducts);
        }
        return { success: true };
      }

      return { success: false, error: "Failed to create product" };
    } catch (err) {
      console.error("Error creating product:", err);
      return { success: false, error: "Failed to create product" };
    }
  };

  const handleUpdateProduct = async (id: number, productData: ProductFormData) => {
    try {
      const formData = toFormData(productData);
      const response = await updateProduct(id, formData);

      if (response.success) {
        const updatedResponse = await getProducts(pageIndex, pageSize);
        if (updatedResponse.success && updatedResponse.data) {
          const mappedProducts = updatedResponse.data.items.map(mapToAdminProduct);
          setProducts(mappedProducts);
        }
        return { success: true };
      }

      return { success: false, error: "Failed to update product" };
    } catch (err) {
      console.error("Error updating product:", err);
      return { success: false, error: "Failed to update product" };
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const response = await deleteProduct(id);
      if (response.success) {
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
    categories,
    manufacturers,
    publishers,
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
          const response = await getProducts(pageIndex, pageSize);
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
