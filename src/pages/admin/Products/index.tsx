import React, { useState } from "react";
import { Button, Form, message, Card, Typography, Space, Alert, Spin, Empty } from "antd";
import { PlusOutlined, ReloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useAdminProducts } from "../../../hooks/useAdminProducts";
import ProductTable from "../../../components/Admin/ProductTable";
import ProductModal from "../../../components/Admin/ProductModal";
import {Products as ProductType, ProductFormData} from "../../../@type/products";
import {ApiResponse} from "../../../@type/apiResponse";

const { Title, Text } = Typography;

const Products = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);

  // Pagination and Search state
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');

  const [form] = Form.useForm();
  const [modalLoading, setModalLoading] = useState(false);

  const {
    products,
    loading,
    error,
    categories,
    manufacturers,
    publishers,
    totalCount,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    refetch,
    fetchProducts, // Assuming this function exists to fetch with params
  } = useAdminProducts();

  const showModal = (product: ProductType | null = null) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  };

  const handleOk = async (values: ProductFormData) => {
    setModalLoading(true);
    try {
      const photos = values.photos ?
          (typeof values.photos === 'string' ?
              (values.photos as string).split('\n').filter((url: string) => url.trim()) :
              Array.isArray(values.photos) ? values.photos : []) :
          [];

      const productData = {
        ...values,
        photos,
        author: values.author || '',
        productType: values.productType || 'book',
        pages: values.pages || 1,
        dimensionLength: values.dimensionLength,
        dimensionWidth : values.dimensionWidth,
        dimensionHeight: values.dimensionHeight,
        weight: values.weight || 0,
        description: values.description || '',
      };

      let result;
      if (editingProduct) {
        result = await handleUpdateProduct(editingProduct.id, productData);
      } else {
        result = await handleCreateProduct(productData);
      }

      if (result.success) {
        message.success({
          content: editingProduct ? "Product updated successfully!" : "Product created successfully!",
          duration: 3,
        });
        setIsModalVisible(false);
        setEditingProduct(null);
        form.resetFields();
        // Refresh current page with current filters
        handleRefreshData();
      } else {
        message.error({
          content: result.error || "Operation failed. Please try again.",
          duration: 5,
        });
      }
    } catch (err: any) {
      const apiError = err?.response?.data as ApiResponse<string>;
      if (apiError?.errors) {
        Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
      } else {
        message.error(apiError?.message || "Lỗi hệ thống không xác định");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await handleDeleteProduct(id);
      if (result.success) {
        message.success({
          content: "Product deleted successfully!",
          duration: 3,
        });
        // Refresh current page with current filters
        handleRefreshData();
      } else {
        message.error({
          content: result.error || "Failed to delete product. Please try again.",
          duration: 5,
        });
      }
    } catch (err: any) {
      const apiError = err?.response?.data as ApiResponse<string>;
      if (apiError?.errors) {
        Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
      } else {
        message.error(apiError?.message || "Lỗi hệ thống không xác định");
      }
    }
  };

  // Handle pagination change from ProductTable
  const handlePageChange = (page: number, size: number) => {
    setPageIndex(page);
    setPageSize(size);
    // Fetch data with new pagination
    if (fetchProducts) {
      fetchProducts(page, size, keyword);
    }
  };

  // Handle search from ProductTable
  const handleSearch = (searchKeyword: string) => {
    setKeyword(searchKeyword);
    setPageIndex(1); // Reset to first page when searching
    // Fetch data with new search term
    if (fetchProducts) {
      fetchProducts(1, pageSize, searchKeyword);
    }
  };

  // Refresh data with current filters
  const handleRefreshData = () => {
    if (fetchProducts) {
      fetchProducts(pageIndex, pageSize, keyword);
    } else {
      refetch();
    }
  };

  const handleRefresh = () => {
    handleRefreshData();
    message.info("Refreshing products...");
  };

  if (error) {
    return (
        <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
          <Card style={{
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Alert
                message="Error Loading Products"
                description={error}
                type="error"
                icon={<ExclamationCircleOutlined />}
                showIcon
                action={
                  <Button size="small" danger onClick={handleRefresh}>
                    Retry
                  </Button>
                }
            />
          </Card>
        </div>
    );
  }

  return (
      <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
        <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              marginBottom: 24
            }}
        >
          {/* Header Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div>
              <Title level={2} style={{
                margin: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Products Management
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Manage your product inventory and details
              </Text>
            </div>
            <Space>
              <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                  style={{ borderRadius: 8 }}
              >
                Refresh
              </Button>
              <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showModal()}
                  size="large"
                  style={{
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}
              >
                Add Product
              </Button>
            </Space>
          </div>

          {/* Content Section */}
          {loading && products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">Loading products...</Text>
                </div>
              </div>
          ) : (
              <ProductTable
                  products={products}
                  loading={loading}
                  onEdit={showModal}
                  totalItems={totalCount}
                  onDelete={handleDelete}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  keyword={keyword}
                  onPageChange={handlePageChange}
                  onSearch={handleSearch}
              />
          )}

        </Card>

        <ProductModal
            visible={isModalVisible}
            editingProduct={editingProduct}
            onOk={handleOk}
            onCancel={() => {
              setIsModalVisible(false);
              setEditingProduct(null);
              form.resetFields();
            }}
            form={form}
            loading={modalLoading}
            categories={categories}
            manufacturers={manufacturers}
            publishers={publishers}
        />
      </div>
  );
};

export default Products;