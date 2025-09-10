// src/pages/categories/index.tsx
import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    Popconfirm,
    message,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import {Category} from "../../../@type/products";
import {getCategory} from "../../../api/category.api";
import {PagedResult} from "../../../@type/apiResponse";
import apiClient from "../../../services/api";




const CategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [form] = Form.useForm();

    const fetchCategories = async (pageIndex = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const res = await getCategory(pageIndex, pageSize);
            if (res.success) {
                const data = res.data as PagedResult<Category>;
                setCategories(data.items);
                setPagination({
                    current: data.pageIndex,
                    pageSize: data.pageSize,
                    total: data.totalCount,
                });
            } else {
                message.error(res.message || "Failed to fetch categories");
            }
        } catch (err) {
            message.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCategories(pagination.current, pagination.pageSize);
    }, []);

    const openModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            form.setFieldsValue(category);
        } else {
            setEditingCategory(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingCategory) {
                await apiClient.put(`/categories/${editingCategory.id}`, values);
                message.success("Category updated successfully");
            } else {
                await apiClient.post("/categories", values);
                message.success("Category created successfully");
            }
            setIsModalOpen(false);
            fetchCategories(pagination.current, pagination.pageSize);
        } catch (err) {
            message.error("Save failed");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await apiClient.delete(`/categories/${id}`);
            message.success("Category deleted successfully");
            fetchCategories(pagination.current, pagination.pageSize);
        } catch (err) {
            message.error("Delete failed");
        }
    };

    const filteredData = categories.filter((c) =>
        c.categoryName.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", width: 80 },
        { title: "Code", dataIndex: "categoryCode", key: "categoryCode", width: 120 },
        { title: "Name", dataIndex: "categoryName", key: "categoryName" },
        {
            title: "Products",
            dataIndex: "productCount",
            key: "productCount",
            width: 120,
        },
        {
            title: "Active",
            dataIndex: "isActive",
            key: "isActive",
            render: (val: boolean) => (val ? "Yes" : "No"),
            width: 100,
        },
        {
            title: "Actions",
            key: "actions",
            width: 180,
            render: (_: any, record: Category) => (
                <Space>
                    <Button type="link" onClick={() => openModal(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this category?"
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

    return (
        <div style={{ padding: 24 }}>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search by name"
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openModal()}
                >
                    Add Category
                </Button>
            </Space>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (page, pageSize) => fetchCategories(page, pageSize),
                }}
            />

            <Modal
                title={editingCategory ? "Edit Category" : "Add Category"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSave}
                okText="Save"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Code"
                        name="categoryCode"
                        rules={[{ required: true, message: "Please enter code" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Name"
                        name="categoryName"
                        rules={[{ required: true, message: "Please enter name" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryPage;
