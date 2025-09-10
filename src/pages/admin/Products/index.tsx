
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

  const [form] = Form.useForm();
  const [modalLoading, setModalLoading] = useState(false);

  const {
    products,
    loading,
    error,
    categories,
    manufacturers,
    publishers,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    refetch,
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
        dimensions: values.dimensions || '',
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

  const handleRefresh = () => {
    refetch();
    message.info("Refreshing products...");
  };

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 24
        }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              Products Management
            </Title>
            <Text type="secondary">
              Manage your product inventory and details
            </Text>
          </div>
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              size="large"
              style={{ borderRadius: 8 }}
            >
              Add Product
            </Button>
          </Space>
        </div>

        {loading && products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Loading products...</Text>
            </div>
          </div>
        ) : products.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  No products found
                </Text>
                <br />
                <Text type="secondary">
                  Start by adding your first product
                </Text>
              </div>
            }
          >
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              size="large"
            >
              Add Your First Product
            </Button>
          </Empty>
        ) : (
          <ProductTable
            products={products}
            loading={loading}
            onEdit={showModal}
            onDelete={handleDelete}
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
