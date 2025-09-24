import React, { useEffect, useState } from "react";
import {
    Button,
    Input,
    Modal,
    Table,
    Tag,
    Form,
    Space,
    message,
    Popconfirm,
    Switch,
    Card,
    Typography,
    Tooltip
} from "antd";
import {
    createPublisher,
    deletePublisher,
    getPublishers,
    updatePublisher,
} from "../../../../api/publisher.api";
import { ApiResponse } from "../../../../@type/apiResponse";
import { Publisher } from "../../../../@type/products";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

const { Title } = Typography;

interface PagedResponse<T> {
    items: T[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
}

const PublisherTab: React.FC = () => {
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState("");
    const [keyword, setKeyword] = useState("");
    const [editItem, setEditItem] = useState<Publisher | null>(null);
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
            const res = await getPublishers(page, pageSize, kw);

            if (res.success && res.data) {
                const data = res.data as PagedResponse<Publisher>;
                setPublishers(data.items);
                setPagination({
                    current: data.pageIndex,
                    pageSize: data.pageSize,
                    total: data.totalCount,
                });
            } else {
                message.error(res.message || "Failed to fetch publishers");
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
        fetchData(pagination.current, pagination.pageSize, keyword);
    }, [keyword]);

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, current: 1 }));
        setKeyword(search);
    };

    const openForm = (item: Publisher | null = null) => {
        setEditItem(item);
        if (item) {
            form.setFieldsValue({
                publisherName: item.publisherName,
                contactInfo: item.contactInfo,
                publisherAddress: item.publisherAddress,
                isActive: item.isActive,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ isActive: true }); // Default to active
        }
        setOpenModal(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (editItem) {
                const res = await updatePublisher(editItem.id, values);
                if (res.success) {
                    message.success("Publisher updated successfully");
                } else {
                    message.error(res.message || "Update failed");
                }
            } else {
                const res = await createPublisher(values);
                if (res.success) {
                    message.success("Publisher created successfully");
                } else {
                    message.error(res.message || "Create failed");
                }
            }

            setOpenModal(false);
            setEditItem(null);
            form.resetFields();
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
            setDeleteLoadingId(id);
            const res = await deletePublisher(id);

            if (res.success) {
                message.success("Publisher deleted successfully");
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
            setDeleteLoadingId(null);
        }
    };

    const columns: ColumnsType<Publisher> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 60,
            sorter: true,
        },
        {
            title: "Publisher Name",
            dataIndex: "publisherName",
            key: "publisherName",
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
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            width: 100,
            align: "center",
            render: (active: boolean) => (
                <Tag
                    color={active ? "success" : "error"}
                    style={{
                        borderRadius: 6,
                        fontWeight: 500,
                        minWidth: 60,
                        textAlign: "center"
                    }}
                >
                    {active ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Contact Info",
            dataIndex: "contactInfo",
            key: "contactInfo",
            width: 130,
            render: (phone: string) => (
                <span style={{ fontFamily: "monospace", fontSize: "13px" }}>
                    {phone}
                </span>
            ),
        },
        {
            title: "Address",
            dataIndex: "publisherAddress",
            key: "publisherAddress",
            ellipsis: {
                showTitle: false,
            },
            render: (address: string) => (
                <Tooltip placement="topLeft" title={address}>
                    {address}
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
            title: "Books",
            dataIndex: "productCount",
            key: "productCount",
            width: 80,
            align: "center",
            render: (count: number) => (
                <Tag color={count > 0 ? "blue" : "default"} style={{ minWidth: 40, textAlign: "center" }}>
                    {count}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            align: "center",
            render: (_: any, record: Publisher) => (
                <Space size="small">
                    <Tooltip title="Edit Publisher">
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
                        title="Delete Publisher"
                        description="Are you sure you want to delete this publisher?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Publisher">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                loading={deleteLoadingId === record.id}
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
                            placeholder="Search publishers..."
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
                        Add Publisher
                    </Button>
                </Space>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={publishers}
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
                        `${range[0]}-${range[1]} of ${total} publishers`,
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
                        {editItem ? "Update Publisher" : "Add New Publisher"}
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
                width={520}
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
                            label={<span style={{ fontWeight: 500 }}>Publisher Name</span>}
                            name="publisherName"
                            rules={[
                                { required: true, message: "Please enter publisher name" },
                                { min: 2, message: "Name must be at least 2 characters" },
                                { max: 100, message: "Name cannot exceed 100 characters" }
                            ]}
                        >
                            <Input
                                placeholder="Enter publisher name..."
                                style={{ borderRadius: 6, height: 36 }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ fontWeight: 500 }}>Contact Phone</span>}
                            name="contactInfo"
                            rules={[
                                { required: true, message: "Please enter contact phone" },
                                {
                                    pattern: /^[0-9]{9,11}$/,
                                    message: "Phone number must be 9-11 digits",
                                },
                            ]}
                        >
                            <Input
                                placeholder="e.g., 0901234567"
                                maxLength={11}
                                style={{ borderRadius: 6, height: 36 }}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    form.setFieldsValue({ contactInfo: value });
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ fontWeight: 500 }}>Address</span>}
                            name="publisherAddress"
                            rules={[
                                { required: true, message: "Please enter publisher address" },
                                { min: 10, message: "Address must be at least 10 characters" },
                                { max: 200, message: "Address cannot exceed 200 characters" }
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Enter publisher address..."
                                rows={3}
                                style={{ borderRadius: 6 }}
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

export default PublisherTab;