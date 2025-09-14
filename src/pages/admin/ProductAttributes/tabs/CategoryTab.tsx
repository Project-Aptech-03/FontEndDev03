// src/pages/admin/tabs/CategoryTab.tsx
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
    Card,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Category } from "../../../../@type/products";
import {ApiResponse, PagedResult} from "../../../../@type/apiResponse";
import {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../../../api/category.api";

const CategoryTab: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [keyword, setKeyword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [form] = Form.useForm();

    const fetchCategories = async (
        pageIndex: number = 1,
        pageSize: number = 10,
        keyword: string = ""
    ) => {
        try {
            setLoading(true);
            // Gọi API có kèm keyword search
            const res = await getCategory(pageIndex, pageSize, keyword);

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
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<string>;
            if (apiError?.errors) {
                Object.values(apiError.errors)
                    .flat()
                    .forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "Lỗi hệ thống không xác định");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(pagination.current, pagination.pageSize, keyword);
    }, [pagination.current, pagination.pageSize, keyword]);


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
                const res = await updateCategory(editingCategory.id, values);
                if (res.success) {
                    message.success("Category updated successfully");
                } else {
                    message.error(res.message || "Update failed");
                }
            } else {
                const res = await createCategory(values);
                if (res.success) {
                    message.success("Category created successfully");
                } else {
                    message.error(res.message || "Create failed");
                }
            }
            setIsModalOpen(false);
            fetchCategories(pagination.current, pagination.pageSize);
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<string>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "Lỗi hệ thống không xác định");
            }}
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await deleteCategory(id);
            if (res.success) {
                message.success("Category deleted successfully");
                fetchCategories(pagination.current, pagination.pageSize);
            } else {
                message.error(res.message || "Delete failed");
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

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Code", dataIndex: "categoryCode", key: "categoryCode"},
        { title: "Name", dataIndex: "categoryName", key: "categoryName" },
        {
            title: "Products",
            dataIndex: "productCount",
            key: "productCount",

        },
        {
            title: "Actions",
            key: "actions",

            render: (_: any, record: Category) => (
                <Space>
                    <Button onClick={() => openModal(record)}>✏ Sửa</Button>
                    <Popconfirm
                        title="Are you sure to delete this category?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger >
                            🗑 Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card
            bordered={false}
            style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        >
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search by name"
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onPressEnter={() => {
                        setPagination(prev => ({ ...prev, current: 1 })); // reset trang về 1
                        fetchCategories(1, pagination.pageSize, search);
                    }}
                    allowClear
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Add Category
                </Button>
            </Space>


            <Table
                rowKey="id"
                columns={columns}
                dataSource={categories}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (page, pageSize) => fetchCategories(page, pageSize, keyword),
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
                        rules={
                            !editingCategory
                                ? [
                                    { required: true, message: "Please enter code" },
                                    {
                                        pattern: /^[A-Z]$/,
                                        message: "Code must be exactly 1 uppercase letter (A-Z).",
                                    },
                                ]
                                : []
                        }
                    >
                        <Input
                            placeholder="Code must be 1 uppercase letter (A-Z)"
                            value={form.getFieldValue("categoryCode") || ""}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
                                form.setFieldsValue({ categoryCode: value.slice(0, 1) });
                            }}
                            maxLength={1}
                        />
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
        </Card>
    );
};

export default CategoryTab;
