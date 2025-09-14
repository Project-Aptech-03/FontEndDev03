
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
  FormInstance
} from 'antd';
import { PlusOutlined, UploadOutlined  } from '@ant-design/icons';
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
    }
  }, [editingProduct, form]);

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
    return false;
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
          onValuesChange={handleValuesChange}
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
                  rules={[{ required: true, message: "Product code is required" }]}
                  tooltip="Unique identifier for the product"
              >
                <Input
                    placeholder="Auto generated"
                    style={{ borderRadius: 6 }}
                    disabled
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
                  name="productType"
                  label={
                    <span>
                      Product Type <Text type="danger">*</Text>
                    </span>
                  }
                  rules={[{ required: true, message: "Please select product type" }]}
              >
                <Select placeholder="Select product type" style={{ borderRadius: 6 }} size="large">
                  <Select.Option value="Book">
                    📖 Book
                  </Select.Option>
                  <Select.Option value="E-Book">
                    📱 E-Book
                  </Select.Option>
                  <Select.Option value="Audio Book">
                    🎧 Audio Book
                  </Select.Option>
                  <Select.Option value="Magazine">
                    📰 Magazine
                  </Select.Option>
                  <Select.Option value="CD">
                    💿 CD
                  </Select.Option>
                  <Select.Option value="DVD">
                    📀 DVD
                  </Select.Option>
                  <Select.Option value="Utility">
                    🖊️ Utility
                  </Select.Option>
                  <Select.Option value="Art Supplies">
                    🎨 Art Supplies
                  </Select.Option>
                  <Select.Option value="Toys">
                    🧸 Toys / Games
                  </Select.Option>
                  <Select.Option value="Educational Kit">
                    🧪 Educational Kit
                  </Select.Option>
                  <Select.Option value="Gift">
                    🎁 Gift / Souvenir
                  </Select.Option>
                  <Select.Option value="other">
                    ❓ Other
                  </Select.Option>
                </Select>
              </Form.Item>

            </Col>
            <Col span={12}>
              <Form.Item noStyle shouldUpdate={(prev, cur) => prev.productType !== cur.productType}>
                {({ getFieldValue }) => {
                  const productType = getFieldValue("productType");

                  return (
                      <>
                        {["Book", "Audio Book"].includes(productType) && (
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
                                  placeholder="e.g., Nguyen Tien Dat"
                                  style={{ borderRadius: 6 }}
                              />
                            </Form.Item>
                        )}
                      </>
                  );
                }}
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={16}>
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.productType !== cur.productType}>
              {({ getFieldValue }) => {
                const productType = getFieldValue("productType");

                return (
                    <>
                      {/* Pages - áp dụng cho sách và tạp chí */}
                      {["Book",  "Magazine","E-Book", "Audio Book" ].includes(productType) && (
                          <Col span={8}>
                            <Form.Item
                                name="pages"
                                label={<span>Pages <Text type="danger">*</Text></span>}
                                rules={[
                                  { required: true, message: "Please enter number of pages" },
                                  { type: "number", min: 1, message: "Pages must be at least 1" },
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
                      )}

                      {/* Length / Width / Height - áp dụng cho DVD, CD, Magazine, Utility, Art Supplies, Toys, Educational Kit, Gift */}
                      {["DVD", "E-Book", "Audio Book", "CD", "Magazine", "Utility", "Art Supplies", "Toys", "Educational Kit", "Gift"].includes(productType) && (
                          <Col span={8}>
                            <Form.Item label={<span>Kích thước <Text type="danger">*</Text></span>} required>
                              <Input.Group compact style={{ display: "flex", gap: 8 }}>
                                <Form.Item name="dimensionLength" noStyle rules={[{ required: true, message: "Nhập chiều dài" }]}>
                                  <InputNumber
                                      placeholder="D"
                                      min={1}
                                      style={{ width: "33%", borderRadius: 6 }}
                                  />
                                </Form.Item>

                                <Form.Item name="dimensionWidth" noStyle rules={[{ required: true, message: "Nhập chiều rộng" }]}>
                                  <InputNumber
                                      placeholder="R"
                                      min={1}
                                      style={{ width: "33%", borderRadius: 6 }}
                                  />
                                </Form.Item>

                                <Form.Item name="dimensionHeight" noStyle rules={[{ required: true, message: "Nhập chiều cao" }]}>
                                  <InputNumber
                                      placeholder="H"
                                      min={1}
                                      style={{ width: "33%", borderRadius: 6 }}
                                  />
                                </Form.Item>
                              </Input.Group>
                            </Form.Item>
                          </Col>
                      )}

                      {["DVD", "CD", "Toys", "Educational Kit" ,"E-Book", "Audio Book"].includes(productType) && (
                          <Col span={8}>
                            <Form.Item
                                name="weight"
                                label={<span>Weight (kg) <Text type="danger">*</Text></span>}
                                rules={[
                                  { required: true, message: "Please enter weight" },
                                  { type: "number", min: 0, message: "Weight must be 0 or greater" },
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
                      )}
                    </>
                );
              }}
            </Form.Item>

          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                  name="categoryId"
                  label="Category"
                  rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select placeholder="Select category">
                  {categories.map((c) => (
                      <Select.Option key={c.id} value={c.id}>
                        {c.categoryName}
                      </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                  name="manufacturerId"
                  label="Manufacturer"
                  rules={[{ required: true, message: 'Please select a manufacturer' }]}
              >
                <Select placeholder="Select manufacturer">
                  {manufacturers.map((m) => (
                      <Select.Option key={m.id} value={m.id}>
                        {m.manufacturerName}
                      </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.productType !== cur.productType}>
              {({ getFieldValue }) => {
                const productType = getFieldValue("productType");

                return (
                    <>
                      {["Book", "Audio Book", "E-Book"].includes(productType) && (
                          <Col span={8}>
                            <Form.Item
                                name="publisherId"
                                label="Publisher"
                                rules={[{ required: true, message: "Please select a publisher" }]}
                            >
                              <Select placeholder="Select publisher">
                                {publishers.map((p) => (
                                    <Select.Option key={p.id} value={p.id}>
                                      {p.publisherName}
                                    </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                      )}
                    </>
                );
              }}
            </Form.Item>
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

        </Form>
      </div>
    </Modal>
  );
};

export default ProductModal;
