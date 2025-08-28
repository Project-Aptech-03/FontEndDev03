
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
} from "antd";
import {useState} from "react";

const { Option } = Select;

const Stocks = () => {
  const [data, setData] = useState([
    {
      id: 1,
      productName: "iPhone 14",
      quantity: 10,
      previousStock: 50,
      newStock: 60,
      referenceType: "Import",
      unitCost: 2000,
      reason: "Stock replenishment",
      createdBy: "admin",
      createdDate: "2025-08-27",
    },
    {
      id: 2,
      productName: "Samsung S23",
      quantity: -5,
      previousStock: 30,
      newStock: 25,
      referenceType: "Export",
      unitCost: 1800,
      reason: "Customer order",
      createdBy: "admin",
      createdDate: "2025-08-27",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (qty) => (qty > 0 ? `+${qty}` : qty),
    },
    {
      title: "Previous Stock",
      dataIndex: "previousStock",
      key: "previousStock",
    },
    {
      title: "New Stock",
      dataIndex: "newStock",
      key: "newStock",
    },
    {
      title: "Reference Type",
      dataIndex: "referenceType",
      key: "referenceType",
    },
    {
      title: "Unit Cost",
      dataIndex: "unitCost",
      key: "unitCost",
      render: (cost) => `$${cost.toLocaleString()}`,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const {
        productName,
        quantity,
        previousStock,
        referenceType,
        unitCost,
        reason,
      } = values;
      const newStock = previousStock + quantity;
      const newRecord = {
        id: data.length + 1,
        productName,
        quantity,
        previousStock,
        newStock,
        referenceType,
        unitCost,
        reason,
        createdBy: "admin",
        createdDate: new Date().toISOString().split("T")[0],
      };
      setData([...data, newRecord]);
      message.success("Stock movement added successfully!");
      setIsModalVisible(false);
    });
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        + Add Stock Movement
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        title="Add Stock Movement"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="productName"
            label="Product"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity (positive for import, negative for export)"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="previousStock"
            label="Previous Stock"
            rules={[{ required: true, message: "Please enter previous stock" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="referenceType"
            label="Reference Type"
            rules={[
              { required: true, message: "Please select reference type" },
            ]}
          >
            <Select placeholder="Select type">
              <Option value="Import">Import</Option>
              <Option value="Export">Export</Option>
              <Option value="Adjustment">Adjustment</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="unitCost"
            label="Unit Cost"
            rules={[{ required: true, message: "Please enter unit cost" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="reason" label="Reason">
            <Input placeholder="Enter reason (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Stocks;
