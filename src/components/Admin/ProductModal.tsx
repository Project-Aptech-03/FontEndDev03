import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Typography,
  Upload,
  message,
  FormInstance,
  Card,
  Space,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  ShoppingOutlined,
  TagOutlined,
  DollarOutlined,
  InboxOutlined,
  AppstoreOutlined,
  ToolOutlined
} from '@ant-design/icons';
import {Products, Category, Manufacturer, ProductFormData, Publisher} from '../../@type/products';
import {generateProductCode} from "../../api/products.api";
import {useEffect} from "react";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface ProductModalProps {
  visible: boolean;
  editingProduct: Products | null;
  onOk: (values: ProductFormData) => void;
  onCancel: () => void;
  form: FormInstance;
  loading?: boolean;
  categories: Category[];
  manufacturers: Manufacturer[];
  publishers: Publisher[];
}

const ProductModal: React.FC<ProductModalProps> = ({
                                                     visible,
                                                     editingProduct,
                                                     onOk,
                                                     onCancel,
                                                     form,
                                                     loading = false,
                                                     categories,
                                                     manufacturers,
                                                     publishers
                                                   }) => {
  const handleOk = () => {
    form
        .validateFields()
        .then((values: ProductFormData) => {
          onOk(values);
        })
        .catch((info) => {
          console.log("Validate Failed:", info);
        });
  };

  const handleValuesChange = async (changedValues: any, allValues: any) => {
    const { categoryId, manufacturerId } = allValues;

    if (categoryId && manufacturerId) {
      try {
        const res = await generateProductCode(categoryId, manufacturerId);
        if (res.success && res.data) {
          form.setFieldsValue({
            productCode: res.data,
          });
        }
      } catch (error) {
        console.error("Error generating product code:", error);
      }
    }
  };

  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue({
        ...editingProduct,
        categoryId: editingProduct.category?.id,
        manufacturerId: editingProduct.manufacturer?.id,
        publisherId: editingProduct.publisher?.id,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ isActive: true });
    }
  }, [editingProduct, form, visible]);

  const handleBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return false;
    }
    return false;
  };

  return (
      <Modal
          open={visible}
          onOk={handleOk}
          onCancel={onCancel}
          okText={editingProduct ? "Update Product" : "Create Product"}
          cancelText="Cancel"
          width={800}
          centered
          destroyOnClose
          maskClosable={false}
          title={null}
          okButtonProps={{
            loading,
            size: 'large',
            style: {
              borderRadius: 8,
              fontWeight: 600,
              height: 42,
              minWidth: 140
            }
          }}
          cancelButtonProps={{
            size: 'large',
            style: {
              borderRadius: 8,
              height: 42,
              minWidth: 100
            }
          }}
          styles={{
            body: { padding: 0 },
            header: { display: 'none' }
          }}
      >
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '24px 32px',
          color: 'white'
        }}>
          <Space align="center" size={16}>
            <Avatar
                size={48}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
                icon={editingProduct ? <EditOutlined /> : <PlusOutlined />}
            />
            <div>
              <Title level={3} style={{ margin: 0, color: 'white' }}>
                {editingProduct ? 'Update Product' : 'Add New Product'}
              </Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                {editingProduct
                    ? 'Modify product information and details'
                    : 'Fill in the essential information to create a new product'
                }
              </Text>
            </div>
          </Space>
        </div>

        {/* Form Content */}
        <div style={{
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: '32px'
        }}>
          <Form
              form={form}
              layout="vertical"
              size="large"
              requiredMark={false}
              onValuesChange={handleValuesChange}
          >
            <Card
                size="small"
                title={
                  <Space>
                    <ShoppingOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontWeight: 600 }}>Basic Information</span>
                  </Space>
                }
                style={{
                  marginBottom: 24,
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
                headStyle={{
                  background: '#f8f9fa',
                  borderRadius: '8px 8px 0 0'
                }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                      name="productCode"
                      label={<Text strong>Product Code</Text>}
                      tooltip="Auto-generated unique identifier"
                  >
                    <Input
                        placeholder="Auto generated when category & manufacturer selected"
                        style={{ borderRadius: 6 }}
                        disabled
                        prefix={<TagOutlined style={{ color: '#bfbfbf' }} />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                      name="productName"
                      label={<Text strong>Product Name</Text>}
                      rules={[
                        { required: true, message: "Please enter product name" },
                        { min: 2, message: "Product name must be at least 2 characters" },
                        { max: 200, message: "Product name cannot exceed 200 characters" }
                      ]}
                  >
                    <Input
                        placeholder="Enter product name..."
                        style={{ borderRadius: 6 }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                  name="description"
                  label={<Text strong>Product Description</Text>}
                  tooltip="Optional detailed description of the product"
              >
                <TextArea
                    rows={3}
                    placeholder="Enter product description (optional)..."
                    style={{ borderRadius: 6 }}
                    showCount
                    maxLength={500}
                />
              </Form.Item>
            </Card>
            <Card
                size="small"
                title={
                  <Space>
                    <AppstoreOutlined style={{ color: '#52c41a' }} />
                    <span style={{ fontWeight: 600 }}>Category & Classification</span>
                  </Space>
                }
                style={{
                  marginBottom: 24,
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
                headStyle={{
                  background: '#f6ffed',
                  borderRadius: '8px 8px 0 0'
                }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                      name="categoryId"
                      label={<Text strong>Category</Text>}
                      rules={[{ required: true, message: 'Please select a category' }]}
                  >
                    <Select
                        placeholder="Select category"
                        style={{ borderRadius: 6 }}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                      {categories.map((c) =>
                          c.subCategories && c.subCategories.length > 0
                              ? c.subCategories.map((sub) => (
                                  <Select.Option key={sub.id} value={sub.id}>
                                    {`${c.categoryName} - ${sub.subCategoryName}`}
                                  </Select.Option>
                              ))
                              : (
                                  <Select.Option key={c.id} value={c.id}>
                                    {c.categoryName}
                                  </Select.Option>
                              )
                      )}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                      name="manufacturerId"
                      label={<Text strong>Manufacturer</Text>}
                      rules={[{ required: true, message: 'Please select a manufacturer' }]}
                  >
                    <Select
                        placeholder="Select manufacturer"
                        style={{ borderRadius: 6 }}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                      {manufacturers.map((m) => (
                          <Select.Option key={m.id} value={m.id}>
                            {m.manufacturerName}
                          </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                      name="publisherId"
                      label={<Text strong>Publisher</Text>}
                      tooltip="Optional - Select if applicable"
                  >
                    <Select
                        placeholder="Select publisher (optional)"
                        style={{ borderRadius: 6 }}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                      {publishers.map((p) => (
                          <Select.Option key={p.id} value={p.id}>
                            {p.publisherName}
                          </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card
                size="small"
                title={
                  <Space>
                    <DollarOutlined style={{ color: '#fa8c16' }} />
                    <span style={{ fontWeight: 600 }}>Pricing & Inventory</span>
                  </Space>
                }
                style={{
                  marginBottom: 24,
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
                headStyle={{
                  background: '#fff7e6',
                  borderRadius: '8px 8px 0 0'
                }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                      name="price"
                      label={<Text strong>Unit Price</Text>}
                      rules={[
                        { required: true, message: "Please enter product price" },
                        { type: 'number', min: 0, message: "Price must be greater than or equal to 0" }
                      ]}
                  >
                    <InputNumber
                        style={{ width: "100%", borderRadius: 6 }}
                        placeholder="0.00"
                        min={0}
                        precision={2}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                        prefix={<DollarOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                      name="stockQuantity"
                      label={<Text strong>Stock Quantity</Text>}
                      rules={[
                        { required: true, message: "Please enter stock quantity" },
                        { type: 'number', min: 0, message: "Stock must be 0 or greater" }
                      ]}
                  >
                    <InputNumber
                        style={{ width: "100%", borderRadius: 6 }}
                        placeholder="Enter quantity"
                        min={0}
                        precision={0}
                        prefix={<InboxOutlined />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Optional Fields Card */}
            <Card
                size="small"
                title={
                  <Space>
                    <ToolOutlined style={{ color: '#722ed1' }} />
                    <span style={{ fontWeight: 600 }}>Additional Information</span>
                    <Text type="secondary" style={{ fontSize: 12 }}>(Optional)</Text>
                  </Space>
                }
                style={{
                  borderRadius: 8,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
                headStyle={{
                  background: '#f9f0ff',
                  borderRadius: '8px 8px 0 0'
                }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                      name="productType"
                      label={<Text strong>Product Type</Text>}
                  >
                    <Select
                        placeholder="Select type (optional)"
                        style={{ borderRadius: 6 }}
                        allowClear
                    >
                      <Select.Option value="Book">Book</Select.Option>
                      <Select.Option value="E-Book">E-Book</Select.Option>
                      <Select.Option value="Audio Book">Audio Book</Select.Option>
                      <Select.Option value="Magazine">Magazine</Select.Option>
                      <Select.Option value="CD">CD</Select.Option>
                      <Select.Option value="DVD">DVD</Select.Option>
                      <Select.Option value="Utility">Utility</Select.Option>
                      <Select.Option value="Art Supplies">Art Supplies</Select.Option>
                      <Select.Option value="Toys">Toys</Select.Option>
                      <Select.Option value="Educational Kit">Educational Kit</Select.Option>
                      <Select.Option value="Gift">Gift</Select.Option>
                      <Select.Option value="Other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                      name="author"
                      label={<Text strong>Author</Text>}
                  >
                    <Input
                        placeholder="Enter author name (optional)"
                        style={{ borderRadius: 6 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                      name="pages"
                      label={<Text strong>Pages</Text>}
                  >
                    <InputNumber
                        style={{ width: "100%", borderRadius: 6 }}
                        placeholder="Number of pages"
                        min={1}
                        precision={0}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                      name="weight"
                      label={<Text strong>Weight (kg)</Text>}
                  >
                    <InputNumber
                        style={{ width: "100%", borderRadius: 6 }}
                        placeholder="0.00"
                        min={0}
                        precision={3}
                        step={0.1}
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                      label={<Text strong>Dimensions (L × W × H)</Text>}
                      style={{ marginBottom: 0 }}
                  >
                    <Input.Group compact style={{ display: "flex", gap: 8 }}>
                      <Form.Item name="dimensionLength" noStyle>
                        <InputNumber
                            placeholder="Length"
                            min={0}
                            precision={2}
                            style={{ width: "33%", borderRadius: 6 }}
                        />
                      </Form.Item>
                      <Form.Item name="dimensionWidth" noStyle>
                        <InputNumber
                            placeholder="Width"
                            min={0}
                            precision={2}
                            style={{ width: "33%", borderRadius: 6 }}
                        />
                      </Form.Item>
                      <Form.Item name="dimensionHeight" noStyle>
                        <InputNumber
                            placeholder="Height"
                            min={0}
                            precision={2}
                            style={{ width: "33%", borderRadius: 6 }}
                        />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                  name="photos"
                  label={<Text strong>Product Images</Text>}
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) return e;
                    return e?.fileList || [];
                  }}
                  tooltip="Upload product images (optional, max 5MB each)"
              >
                <Upload
                    name="files"
                    multiple
                    beforeUpload={handleBeforeUpload}
                    listType="picture-card"
                    showUploadList={{ showRemoveIcon: true }}
                    style={{ width: "100%" }}
                >
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16
                  }}>
                    <UploadOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
                    <Text style={{ fontSize: 14, color: '#666' }}>Upload Images</Text>
                  </div>
                </Upload>
              </Form.Item>
            </Card>
          </Form>
        </div>

        <style jsx>{`
        .ant-modal-content {
          border-radius: 8px !important;
          overflow: hidden;
        }
        .ant-form-item-label > label {
          font-weight: 500;
          color: #262626;
        }
        .ant-input:focus,
        .ant-input-focused {
          border-color: #40a9ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
          border-color: #40a9ff;
        }
        .ant-input-number:hover {
          border-color: #40a9ff;
        }
        .ant-upload-list-picture-card .ant-upload-list-item {
          border-radius: 6px;
        }
      `}</style>
      </Modal>
  );
};

export default ProductModal;