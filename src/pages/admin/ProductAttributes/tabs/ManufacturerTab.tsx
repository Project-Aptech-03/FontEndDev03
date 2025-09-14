import React, { useEffect, useState } from "react";
import {
    createManufacturer,
    deleteManufacturer,
    getManufacturers,
    updateManufacturer,
} from "../../../../api/manufacturer.api";
import { Button, Input, Modal, Table, Space, Form, message, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
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

const ManufacturerTab = () => {
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

    // 🔹 Fetch data với pagination + keyword
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
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
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
        setPagination({ ...pagination, current: 1 }); // reset page
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
                await updateManufacturer(editItem.id, values);
                message.success("Cập nhật thành công");
            } else {
                await createManufacturer(values);
                message.success("Tạo mới thành công");
            }
            setOpenModal(false);
            fetchData(pagination.current, pagination.pageSize, keyword);
        } catch (err) {
            console.log("Validation Failed:", err);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setDeletingId(id);
            await deleteManufacturer(id);
            message.success("Xóa thành công");
            fetchData(pagination.current, pagination.pageSize, keyword);
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<string>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "Lỗi hệ thống không xác định");
            }
        } finally {
            setDeletingId(null);
        }
    };

    const columns: ColumnsType<Manufacturer> = [
        { title: "ID", dataIndex: "id", key: "id", width: 60 },
        { title: "Code", dataIndex: "manufacturerCode", key: "manufacturerCode" },
        { title: "Name", dataIndex: "manufacturerName", key: "manufacturerName" },
        {
            title: "Created Date",
            dataIndex: "createdDate",
            key: "createdDate",
            render: (val: string) => new Date(val).toLocaleDateString(),
        },
        { title: "Products", dataIndex: "productCount", key: "productCount" },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Manufacturer) => (
                <Space>
                    <Button onClick={() => openForm(record)}>✏ Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa manufacturer này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger loading={deletingId === record.id}>
                            🗑 Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search by name"
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                    onPressEnter={handleSearch}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
                    Add Manufacturer
                </Button>
            </Space>

            <Table
                className="mt-4"
                rowKey="id"
                columns={columns}
                dataSource={manufacturers}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => fetchData(page, pageSize, keyword),
                }}
            />

            <Modal
                title={editItem ? "✏ Cập nhật Manufacturer" : "+ Thêm Manufacturer"}
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onOk={handleSave}
                okText={editItem ? "Lưu thay đổi" : "Thêm mới"}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Code"
                        name="manufacturerCode"
                        rules={[
                            { required: true, message: "Manufacturer code cannot be empty." },
                            {
                                pattern: /^[A-Z]{3}$/,
                                message: "Manufacturer code must be exactly 3 uppercase letters (e.g., ABC).",
                            },
                        ]}
                    >
                        <Input
                            placeholder="ABC"
                            maxLength={3}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
                                form.setFieldsValue({ manufacturerCode: value.slice(0, 3) });
                            }}
                        />
                    </Form.Item>


                    <Form.Item
                        label="Name"
                        name="manufacturerName"
                        rules={[
                            { required: true, message: "Manufacturer name cannot be empty." },
                            { max: 150, message: "Name cannot exceed 150 characters." },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManufacturerTab;
