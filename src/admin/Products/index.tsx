import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  Space,
  Switch,
} from "antd";

const { TextArea } = Input;

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      productCode: "PRD001",
      categoryId: 1,
      manufacturerId: 1,
      productName: "Programming Book",
      price: 120,
      stockQuantity: 50,
      description: "React programming guide",
      isActive: true,
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const showModal = (product = null) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? { ...p, ...values } : p
          )
        );
      } else {
        const newProduct = { ...values, id: Date.now() };
        setProducts((prev) => [...prev, newProduct]);
      }
      setIsModalVisible(false);
      setEditingProduct(null);
    });
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const columns = [
    { title: "Product Code", dataIndex: "productCode", key: "productCode" },
    { title: "Product Name", dataIndex: "productName", key: "productName" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: "Stock Quantity",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (val) => (val ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 16, marginTop: 16 }}
      >
        + Add Product
      </Button>
      <Table dataSource={products} columns={columns} rowKey="id" />

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="productCode"
            label="Product Code"
            rules={[{ required: true, message: "Please enter product code" }]}
          >
            <Input placeholder="Enter product code" />
          </Form.Item>

          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select category">
              <Select.Option value={1}>Books</Select.Option>
              <Select.Option value={2}>Stationery</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="manufacturerId"
            label="Manufacturer"
            rules={[
              { required: true, message: "Please select a manufacturer" },
            ]}
          >
            <Select placeholder="Select manufacturer">
              <Select.Option value={1}>NXB Tre Publishing</Select.Option>
              <Select.Option value={2}>NXB Kim Dong</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter product price" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter product price"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="stockQuantity"
            label="Stock Quantity"
            rules={[{ required: true, message: "Please enter stock quantity" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter stock quantity"
              min={0}
            />
          </Form.Item>

          <Form.Item name="isActive" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
