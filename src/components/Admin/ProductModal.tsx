import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Row, Col, Typography, Upload, message, Button } from 'antd';
import { PlusOutlined, UploadOutlined , InfoCircleOutlined } from '@ant-design/icons';
import { AdminProduct, ProductFormData } from '../../@type/adminProduct';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface ProductModalProps {
  visible: boolean;
  editingProduct: AdminProduct | null;
  onOk: (values: ProductFormData) => void;
  onCancel: () => void;
  form: any;
  loading?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  visible,
  editingProduct,
  onOk,
  onCancel,
  form,
  loading = false
}) => {
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleOk = () => {
    form.validateFields().then((values: ProductFormData) => {
      onOk(values);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImagePreview(url);
    form.setFieldsValue({ image: url });
  };

  const handleBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
    return false; // Prevent auto upload
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PlusOutlined style={{ color: '#1890ff' }} />
          <Title level={4} style={{ margin: 0 }}>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </Title>
        </div>
      }
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={editingProduct ? "Update Product" : "Create Product"}
      cancelText="Cancel"
      width={800}
      okButtonProps={{ loading, size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
      destroyOnClose
      maskClosable={false}
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '0 4px' }}>
        <Form 
          form={form} 
          layout="vertical" 
          size="large"
          initialValues={{ isActive: true }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productCode"
                label={
                  <span>
                    Product Code <Text type="danger">*</Text>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter product code" },
                  { min: 3, message: "Product code must be at least 3 characters" }
                ]}
                tooltip="Unique identifier for the product"
              >
                <Input 
                  placeholder="e.g., 12dsauf" 
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="productName"
                label={
                  <span>
                    Product Name <Text type="danger">*</Text>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter product name" },
                  { min: 2, message: "Product name must be at least 2 characters" }
                ]}
              >
                <Input 
                  placeholder="e.g., Sach Hay" 
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="author"
                label={
                  <span>
                    Author <Text type="danger">*</Text>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter author name" },
                  { min: 2, message: "Author name must be at least 2 characters" }
                ]}
              >
                <Input 
                  placeholder="e.g., Nguyen tien dat" 
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="productType"
                label={
                  <span>
                    Product Type <Text type="danger">*</Text>
                  </span>
                }
                rules={[{ required: true, message: "Please select product type" }]}
              >
                <Select 
                  placeholder="Select product type"
                  style={{ borderRadius: 6 }}
                  size="large"
                >
                  <Select.Option value="book">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      📚 Book
                    </div>
                  </Select.Option>
                  <Select.Option value="stationery">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      ✏️ Stationery
                    </div>
                  </Select.Option>
                  <Select.Option value="magazine">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      📰 Magazine
                    </div>
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="pages"
                label={
                  <span>
                    Pages <Text type="danger">*</Text>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter number of pages" },
                  { type: 'number', min: 1, message: "Pages must be at least 1" }
                ]}
              >
                <InputNumber
                  style={{ width: "100%", borderRadius: 6 }}
                  placeholder="10"
                  min={1}
                  precision={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dimensions"
                label={
                  <span>
                    Dimensions <Text type="danger">*</Text>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter dimensions" },
                  { min: 2, message: "Dimensions must be at least 2 characters" }
                ]}
              >
                <Input 
                  placeholder="e.g., 20x15x2 cm" 
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="weight"
                label={
                  <span>
                    Weight (kg) <Text type="danger">*</Text>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter weight" },
                  { type: 'number', min: 0, message: "Weight must be 0 or greater" }
                ]}
              >
                <InputNumber
                  style={{ width: "100%", borderRadius: 6 }}
                  placeholder="1.00"
                  min={0}
                  precision={2}
                  step={0.1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Category"
                tooltip="Product category (optional)"
              >
                <Input 
                  placeholder="e.g., Fiction, Non-fiction" 
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="manufacturer"
                label="Manufacturer"
                tooltip="Product manufacturer (optional)"
              >
                <Input 
                  placeholder="e.g., NXB Tre Publishing" 
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="publisher"
                label="Publisher"
                tooltip="Product publisher (optional)"
              >
                <Input 
                  placeholder="e.g., NXB Kim Dong" 
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
              name="photos"
              label="Product Images"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.fileList || [];
              }}
          >
            <Upload
                name="files"
                multiple
                beforeUpload={handleBeforeUpload}
                listType="picture"
                showUploadList={{ showRemoveIcon: true }}
                style={{
                  width: "10%",
                  minHeight: 100,
                  border: "1px dashed #d9d9d9",
                  borderRadius: 8,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  padding: 12,
                  backgroundColor: "#fafafa",
                }}
            >
              <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    cursor: "pointer",
                  }}
              >
                <UploadOutlined style={{ fontSize: 28, color: "#1890ff" }} />
                <span style={{ marginTop: 8, fontSize: 16, color: "#555" }}>Upload</span>
              </div>
            </Upload>
          </Form.Item>





          <Form.Item
            name="description"
            label={
              <span>
                Description <Text type="danger">*</Text>
              </span>
            }
            rules={[
              { required: true, message: "Please enter product description" },
              { min: 10, message: "Description must be at least 10 characters" }
            ]}
            tooltip="Detailed description of the product"
          >
            <TextArea 
              rows={3} 
              placeholder="Enter detailed product description..."
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label={
                  <span>
                    Price ($) <Text type="danger">*</Text>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter product price" },
                  { type: 'number', min: 0, message: "Price must be greater than 0" }
                ]}
              >
                <InputNumber
                  style={{ width: "100%", borderRadius: 6 }}
                  placeholder="0.00"
                  min={0}
                  precision={2}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stockQuantity"
                label={
                  <span>
                    Stock Quantity <Text type="danger">*</Text>
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter stock quantity" },
                  { type: 'number', min: 0, message: "Stock must be 0 or greater" }
                ]}
              >
                <InputNumber
                  style={{ width: "100%", borderRadius: 6 }}
                  placeholder="0"
                  min={0}
                  precision={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            name="isActive" 
            label="Product Status"
            tooltip="Active products will be visible to customers"
            valuePropName="checked"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Switch 
                checkedChildren="Active" 
                unCheckedChildren="Inactive"
                size="default"
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                <InfoCircleOutlined /> Toggle to activate/deactivate product
              </Text>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ProductModal;
