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
    dimensionHeight : product.dimensionHeight,
    dimensionWidth: product.dimensionWidth,
    dimensionLength: product.dimensionLength,
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
          subCategories: product.category.subCategories?.map(sub => ({
            id: sub.id,
            subCategoryCode: sub.subCategoryCode,
            subCategoryName: sub.subCategoryName,
            isActive: sub.isActive,
            createdDate: sub.createdDate,
          })) || [],
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
    subCategories: dto.subCategories?.map((sub: any) => ({
      id: sub.id,
      subCategoryCode: sub.subCategoryCode,
      subCategoryName: sub.subCategoryName,
      isActive: sub.isActive,
      createdDate: sub.createdDate,
    })) || [],
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

export const useAdminProducts = (pageIndex: number = 1, pageSize: number = 20, keyword: string = '') => {
  const [products, setProducts] = useState<Products[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch products with search and pagination
  const fetchProducts = async (page: number = pageIndex, size: number = pageSize, search: string = keyword) => {
    try {
      setLoading(true);
      setError(null);

      const productsRes = await getProducts(page, size, search);

      if (productsRes.success && productsRes.data) {
        const mappedProducts = productsRes.data.items.map(mapToAdminProduct);
        setProducts(mappedProducts);
        setTotalCount(productsRes.data.totalCount);
        setTotalPages(productsRes.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
      setProducts([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reference data (categories, manufacturers, publishers) - only once
  const fetchReferenceData = async () => {
    try {
      const [categoriesRes, manufacturersRes, publishersRes] = await Promise.all([
        getCategory(1, 100),
        getManufacturers(1, 100),
        getPublishers(1, 100)
      ]);

      if (categoriesRes.success && categoriesRes.data?.items) {
        const mappedCategories = categoriesRes.data.items.map(mapToCategory);
        setCategories(mappedCategories);
      }

      if (manufacturersRes.success && manufacturersRes.data?.items) {
        const mappedManufacturers = manufacturersRes.data.items.map(mapToManufacturer);
        setManufacturers(mappedManufacturers);
      }

      if (publishersRes.success && publishersRes.data?.items) {
        const mappedPublishers = publishersRes.data.items.map(mapToPublisher);
        setPublishers(mappedPublishers);
      }
    } catch (err) {
      console.error('Error fetching reference data:', err);
    }
  };

  useEffect(() => {
    fetchProducts(pageIndex, pageSize, keyword);
  }, [pageIndex, pageSize, keyword]);

  useEffect(() => {
    fetchReferenceData();
  }, []); // Only fetch reference data once

  const handleCreateProduct = async (productData: ProductFormData) => {
    try {
      const formData = toFormData(productData);
      const response = await createProduct(formData);

      if (response.success) {
        // Refresh current page after creating
        await fetchProducts(pageIndex, pageSize, keyword);
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
        // Refresh current page after updating
        await fetchProducts(pageIndex, pageSize, keyword);
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
        // Remove from local state immediately for better UX
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

  const refetch = () => {
    fetchProducts(pageIndex, pageSize, keyword);
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
    fetchProducts,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    refetch
  };
};