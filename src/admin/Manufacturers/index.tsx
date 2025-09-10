import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Space,
  Popconfirm,
  message,
} from "antd";

const Manufacturers = () => {
  const [data, setData] = useState([
    {
      id: 1,
      manufacturerCode: "M001",
      manufacturerName: "Sony",
      isActive: true,
      createdDate: "2025-08-27",
    },
    {
      id: 2,
      manufacturerCode: "M002",
      manufacturerName: "Samsung",
      isActive: false,
      createdDate: "2025-08-27",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Code",
      dataIndex: "manufacturerCode",
      key: "manufacturerCode",
    },
    {
      title: "Name",
      dataIndex: "manufacturerName",
      key: "manufacturerName",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this manufacturer?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setIsEdit(false);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setIsEdit(true);
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    message.success("Deleted successfully!");
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (isEdit) {
        setData(
          data.map((item) =>
            item.id === editingId ? { ...item, ...values } : item
          )
        );
        message.success("Updated successfully!");
      } else {
        const newManufacturer = {
          ...values,
          id: data.length + 1,
          createdDate: new Date().toISOString().split("T")[0],
        };
        setData([...data, newManufacturer]);
        message.success("Added successfully!");
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        + Add Manufacturer
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        title={isEdit ? "Edit Manufacturer" : "Add Manufacturer"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="manufacturerCode"
            label="Manufacturer Code"
            rules={[
              { required: true, message: "Please enter manufacturer code" },
              { max: 5 },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="manufacturerName"
            label="Manufacturer Name"
            rules={[
              { required: true, message: "Please enter manufacturer name" },
              { max: 150 },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Manufacturers;
