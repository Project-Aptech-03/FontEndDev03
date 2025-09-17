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
    Tag,
    Tooltip,
} from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {Category, SubCategoryResponseDto} from "../../../../@type/products";
import { ApiResponse, PagedResult } from "../../../../@type/apiResponse";
import {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../../../api/category.api";
import type { ColumnsType } from "antd/es/table";

const CategoryTab: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [keyword, setKeyword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
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
    }, [keyword]);

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, current: 1 }));
        setKeyword(search);
    };
    const openModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            const subCategoriesArray = category.subCategories
                ? category.subCategories.map(s => ({
                    id: s.id, // nếu có
                    subCategoryName: s.subCategoryName
                }))
                : [];

            form.setFieldsValue({
                categoryCode: category.categoryCode,
                categoryName: category.categoryName,
                subCategories: subCategoriesArray
            });

        } else {
            setEditingCategory(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const cleanSubCategories = (values.subCategories || [])
                .filter((sub: any) => sub && sub.subCategoryName?.trim() !== "")
                .map((sub: any) => ({
                    id: sub.id || 0, 
                    subCategoryName: sub.subCategoryName
                }));

            const payload = {
                categoryCode: values.categoryCode,
                categoryName: values.categoryName,
                subCategories: cleanSubCategories
            };
            let res;
            if (editingCategory) {
                res = await updateCategory(editingCategory.id, payload);
                if (res.success) message.success("Category updated successfully");
                else message.error(res.message || "Update failed");
            } else {
                res = await createCategory(payload);
                if (res.success) message.success("Category created successfully");
                else message.error(res.message || "Create failed");
            }

            setIsModalOpen(false);
            setEditingCategory(null);
            form.resetFields();
            fetchCategories(pagination.current, pagination.pageSize, keyword);
        } catch (err: any) {
            console.error('Error in handleSave:', err);
            const apiError = err?.response?.data as ApiResponse<string>;
            if (apiError?.errors) {
                Object.values(apiError.errors)
                    .flat()
                    .forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "Lỗi hệ thống không xác định");
            }
        }
    };



    const handleDelete = async (id: number) => {
        try {
            setDeletingId(id);
            const res = await deleteCategory(id);

            if (res.success) {
                message.success("Category deleted successfully");
                fetchCategories(pagination.current, pagination.pageSize, keyword);
            } else {
                message.error(res.message || "Delete failed");
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
            setDeletingId(null);
        }
    };

        const columns: ColumnsType<Category> = [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                width: 60,
                sorter: true,
            },
            {
                title: "Code",
                dataIndex: "categoryCode",
                key: "categoryCode",
                width: 80,
                render: (code: string) => (
                    <Tag
                        color="purple"
                        style={{
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            fontSize: "14px",
                            minWidth: 40,
                            textAlign: "center",
                            borderRadius: 6
                        }}
                    >
                        {code}
                    </Tag>
                ),
            },
            {
                title: "Category Name",
                dataIndex: "categoryName",
                key: "categoryName",
                ellipsis: {
                    showTitle: false,
                },
                render: (name: string) => (
                    <Tooltip placement="topLeft" title={name}>
                        <span style={{ fontWeight: 500, fontSize: "14px" }}>{name}</span>
                    </Tooltip>
                ),
            },
            {
                title: "SubCategories",
                dataIndex: "subCategories",
                key: "subCategories",
                render: (subs: SubCategoryResponseDto[] | undefined) => (
                    <>
                        {subs && subs.length > 0 ? (
                            subs.map((s, i) => (
                                <Tag color="blue" key={i} style={{ marginBottom: 4 }}>
                                    {s.subCategoryName}
                                </Tag>
                            ))
                        ) : (
                            <Tag color="default">None</Tag>
                        )}
                    </>
                ),
            },

            {
                title: "Products",
                dataIndex: "productCount",
                key: "productCount",
                width: 100,
                align: "center",
                render: (count: number) => (
                    <Tag
                        color={count > 0 ? "green" : "default"}
                        style={{
                            minWidth: 50,
                            textAlign: "center",
                            fontWeight: 500,
                            fontSize: "13px"
                        }}
                    >
                        {count} items
                    </Tag>
                ),
            },
            {
                title: "Actions",
                key: "actions",
                width: 120,
                align: "center",
                render: (_: any, record: Category) => (
                    <Space size="small">
                        <Tooltip title="Edit Category">
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => openModal(record)}
                                style={{
                                    color: "#1890ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            />
                        </Tooltip>
                        <Popconfirm
                            title="Delete Category"
                            description="Are you sure you want to delete this category?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Delete Category">
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    loading={deletingId === record.id}
                                    danger
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                ),
            },
        ];

    return (
        <Card
            bordered={false}
            style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                background: "#fff"
            }}
        >
            <div style={{ marginBottom: 20 }}>
                <Space
                    style={{
                        width: "100%",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 16
                    }}
                >
                    <Space size="middle">
                        <Input
                            placeholder="Search categories..."
                            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onPressEnter={handleSearch}
                            allowClear
                            style={{
                                width: 280,
                                borderRadius: 8,
                            }}
                        />
                    </Space>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => openModal()}
                        style={{
                            borderRadius: 8,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 500,
                            boxShadow: "0 2px 8px rgba(24, 144, 255, 0.3)"
                        }}
                    >
                        Add Category
                    </Button>
                </Space>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={categories}
                loading={loading}
                bordered={false}
                size="middle"
                scroll={{ x: 600 }}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} categories`,
                    onChange: (page, pageSize) => fetchCategories(page, pageSize, keyword),
                    style: { marginTop: 16 }
                }}
                style={{
                    borderRadius: 8,
                    overflow: "hidden"
                }}
                rowClassName={(_, index) =>
                    index % 2 === 0 ? "table-row-light" : "table-row-dark"
                }
            />

            <Modal
                title={
                    <Space>
                        {editingCategory ? <EditOutlined /> : <PlusOutlined />}
                        {editingCategory ? "Update Category" : "Add New Category"}
                    </Space>
                }
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                    form.resetFields();
                }}
                onOk={handleSave}
                okText={editingCategory ? "Update" : "Create"}
                cancelText="Cancel"
                width={450}
                style={{ top: 20 }}
                okButtonProps={{
                    style: {
                        borderRadius: 6,
                        fontWeight: 500,
                    }
                }}
                cancelButtonProps={{
                    style: {
                        borderRadius: 6,
                    }
                }}
            >
                <div style={{ padding: "20px 0 10px" }}>
                    <Form form={form} layout="vertical" requiredMark={false}>
                        {/* Category Code */}
                        <Form.Item
                            label={<span style={{ fontWeight: 500 }}>Category Code</span>}
                            name="categoryCode"
                            rules={
                                !editingCategory
                                    ? [
                                        { required: true, message: "Please enter category code" },
                                        {
                                            pattern: /^[A-Z]$/,
                                            message: "Code must be exactly 1 uppercase letter (A-Z)",
                                        },
                                    ]
                                    : []
                            }
                        >
                            <Input
                                placeholder="A"
                                maxLength={1}
                                disabled={!!editingCategory}
                                style={{
                                    borderRadius: 6,
                                    height: 36,
                                    fontFamily: "monospace",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    fontSize: "16px"
                                }}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
                                    form.setFieldsValue({ categoryCode: value.slice(0, 1) });
                                }}
                            />
                        </Form.Item>

                        {/* Category Name */}
                        <Form.Item
                            label={<span style={{ fontWeight: 500 }}>Category Name</span>}
                            name="categoryName"
                            rules={[
                                { required: true, message: "Please enter category name" },
                                { min: 2, message: "Name must be at least 2 characters" },
                                { max: 100, message: "Name cannot exceed 100 characters" }
                            ]}
                        >
                            <Input
                                placeholder="Enter category name..."
                                style={{ borderRadius: 6, height: 36 }}
                            />
                        </Form.Item>
                        <Form.List name="subCategories">
                            {(fields, { add, remove }) => (
                                <div>
                                    <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
                                        Subcategories
                                    </label>
                                    {fields.slice(0, 1).map((field, index) => (
                                        <Space key={field.key} align="baseline" style={{ width: '100%' }}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, "subCategoryName"]}
                                                fieldKey={[field.fieldKey, "subCategoryName"]}
                                                style={{ flex: 1, marginBottom: 0 }}
                                                rules={[
                                                    { required: true, message: "Please enter subcategory" },
                                                    { min: 2, message: "Subcategory must be at least 2 characters" }
                                                ]}
                                            >
                                                <Input
                                                    placeholder={`Subcategory ${index + 1}`}
                                                    style={{ borderRadius: 6, height: 36 }}
                                                />
                                            </Form.Item>
                                            <Button type="text" danger onClick={() => remove(field.name)}>
                                                Remove
                                            </Button>
                                        </Space>
                                    ))}

                                    {fields.length < 1 && (
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block>
                                                + Add Subcategory
                                            </Button>
                                        </Form.Item>
                                    )}
                                </div>
                            )}
                        </Form.List>


                    </Form>
                </div>
            </Modal>


            <style jsx>{`
                .table-row-light {
                    background-color: #fafafa;
                }
                .table-row-dark {
                    background-color: #ffffff;
                }
                .ant-table-thead > tr > th {
                    background-color: #f8f9fa !important;
                    font-weight: 600;
                    color: #262626;
                    border-bottom: 2px solid #e8e8e8;
                }
                .ant-table-tbody > tr:hover > td {
                    background-color: #e6f7ff !important;
                }
            `}</style>
        </Card>
    );
};

export default CategoryTab;