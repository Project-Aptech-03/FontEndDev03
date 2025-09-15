import React, { useEffect, useState } from "react";
import {
    createManufacturer,
    deleteManufacturer,
    getManufacturers,
    updateManufacturer,
} from "../../../../api/manufacturer.api";
import {
    Button,
    Input,
    Modal,
    Table,
    Space,
    Form,
    message,
    Popconfirm,
    Card,
    Tag,
    Tooltip
} from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { ApiResponse } from "../../../../@type/apiResponse";

interface Manufacturer {
    id: number;
    manufacturerCode: string;
    manufacturerName: string;
    isActive: boolean;
    createdDate: string;
    productCount: number;
}

interface PagedResponse<T> {
    items: T[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
}

const ManufacturerTab: React.FC = () => {
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState("");
    const [keyword, setKeyword] = useState("");
    const [editItem, setEditItem] = useState<Manufacturer | null>(null);
    const [form] = Form.useForm();

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchData = async (
        page = pagination.current,
        pageSize = pagination.pageSize,
        kw = keyword
    ) => {
        try {
            setLoading(true);
            const res = await getManufacturers(page, pageSize, kw);

            if (res.success && res.data) {
                const data = res.data as PagedResponse<Manufacturer>;
                setManufacturers(data.items);
                setPagination({
                    current: data.pageIndex,
                    pageSize: data.pageSize,
                    total: data.totalCount,
                });
            } else {
                message.error(res.message || "Failed to fetch manufacturers");
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
        fetchData();
    }, [keyword]);

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, current: 1 }));
        setKeyword(search);
    };

    const openForm = (item: Manufacturer | null = null) => {
        setEditItem(item);
        if (item) {
            form.setFieldsValue({
                manufacturerCode: item.manufacturerCode,
                manufacturerName: item.manufacturerName,
            });
        } else {
            form.resetFields();
        }
        setOpenModal(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (editItem) {
                const res = await updateManufacturer(editItem.id, values);
                if (res.success) {
                    message.success("Manufacturer updated successfully");
                } else {
                    message.error(res.message || "Update failed");
                }
            } else {
                const res = await createManufacturer(values);
                if (res.success) {
                    message.success("Manufacturer created successfully");
                } else {
                    message.error(res.message || "Create failed");
                }
            }

            setOpenModal(false);
            fetchData(pagination.current, pagination.pageSize, keyword);
        } catch (err: any) {
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
            const res = await deleteManufacturer(id);

            if (res.success) {
                message.success("Manufacturer deleted successfully");
                fetchData(pagination.current, pagination.pageSize, keyword);
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

    const columns: ColumnsType<Manufacturer> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 60,
            sorter: true,
        },
        {
            title: "Code",
            dataIndex: "manufacturerCode",
            key: "manufacturerCode",
            width: 100,
            render: (code: string) => (
                <Tag
                    color="processing"
                    style={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        fontSize: "12px",
                        minWidth: 50,
                        textAlign: "center"
                    }}
                >
                    {code}
                </Tag>
            ),
        },
        {
            title: "Manufacturer Name",
            dataIndex: "manufacturerName",
            key: "manufacturerName",
            ellipsis: {
                showTitle: false,
            },
            render: (name: string) => (
                <Tooltip placement="topLeft" title={name}>
                    <span style={{ fontWeight: 500 }}>{name}</span>
                </Tooltip>
            ),
        },
        {
            title: "Created Date",
            dataIndex: "createdDate",
            key: "createdDate",
            width: 120,
            render: (date: string) => (
                <span style={{ fontSize: "13px", color: "#666" }}>
                    {new Date(date).toLocaleDateString("vi-VN")}
                </span>
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
                    color={count > 0 ? "blue" : "default"}
                    style={{
                        minWidth: 40,
                        textAlign: "center",
                        fontWeight: 500
                    }}
                >
                    {count}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            align: "center",
            render: (_: any, record: Manufacturer) => (
                <Space size="small">
                    <Tooltip title="Edit Manufacturer">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openForm(record)}
                            style={{
                                color: "#1890ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Manufacturer"
                        description="Are you sure you want to delete this manufacturer?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Manufacturer">
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
                            placeholder="Search manufacturers..."
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
                        onClick={() => openForm()}
                        style={{
                            borderRadius: 8,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 500,
                            boxShadow: "0 2px 8px rgba(24, 144, 255, 0.3)"
                        }}
                    >
                        Add Manufacturer
                    </Button>
                </Space>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={manufacturers}
                loading={loading}
                bordered={false}
                size="middle"
                scroll={{ x: 800 }}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} manufacturers`,
                    onChange: (page, pageSize) => fetchData(page, pageSize, keyword),
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
                        {editItem ? <EditOutlined /> : <PlusOutlined />}
                        {editItem ? "Update Manufacturer" : "Add New Manufacturer"}
                    </Space>
                }
                open={openModal}
                onCancel={() => {
                    setOpenModal(false);
                    setEditItem(null);
                    form.resetFields();
                }}
                onOk={handleSave}
                okText={editItem ? "Update" : "Create"}
                cancelText="Cancel"
                width={480}
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
                        <Form.Item
                            label={<span style={{ fontWeight: 500 }}>Manufacturer Code</span>}
                            name="manufacturerCode"
                            rules={
                                !editItem
                                    ? [
                                        { required: true, message: "Please enter manufacturer code" },
                                        {
                                            pattern: /^[A-Z]{3}$/,
                                            message: "Code must be exactly 3 uppercase letters (e.g., ABC)",
                                        },
                                    ]
                                    : []
                            }
                        >
                            <Input
                                placeholder="ABC"
                                maxLength={3}
                                disabled={!!editItem}
                                style={{
                                    borderRadius: 6,
                                    height: 36,
                                    fontFamily: "monospace",
                                    fontWeight: "bold",
                                    textAlign: "center"
                                }}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
                                    form.setFieldsValue({ manufacturerCode: value.slice(0, 3) });
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ fontWeight: 500 }}>Manufacturer Name</span>}
                            name="manufacturerName"
                            rules={[
                                { required: true, message: "Please enter manufacturer name" },
                                { min: 2, message: "Name must be at least 2 characters" },
                                { max: 150, message: "Name cannot exceed 150 characters" },
                            ]}
                        >
                            <Input
                                placeholder="Enter manufacturer name..."
                                style={{ borderRadius: 6, height: 36 }}
                            />
                        </Form.Item>
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

export default ManufacturerTab;