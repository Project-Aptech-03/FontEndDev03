import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Table, Tag, Form, Space, message, Popconfirm, Switch } from "antd";
import {
    createPublisher,
    deletePublisher,
    getPublishers,
    updatePublisher,
} from "../../../../api/publisher.api";
import { ApiResponse } from "../../../../@type/apiResponse";
import { Publisher } from "../../../../@type/products";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";

const PublisherTab = () => {
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState("");
    const [keyword, setKeyword] = useState(""); // keyword để gửi API
    const [editItem, setEditItem] = useState<Publisher | null>(null);
    const [form] = Form.useForm();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const fetchData = async (
        page = pageNumber,
        size = pageSize,
        kw = keyword
    ) => {
        try {
            setLoading(true);
            const res = await getPublishers(page, size, kw); // gửi keyword
            if (res.success && res.data) {
                setPublishers(res.data.items as Publisher[]);
                setTotalCount(res.data.totalCount);
                setPageNumber(res.data.pageIndex);
                setPageSize(res.data.pageSize);
            } else {
                message.error(res.message || "Failed to fetch publishers");
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

    // 👉 Khi search
    const handleSearch = () => {
        setPageNumber(1);
        setKeyword(search);
    };
    const handleTableChange = (page: number, size?: number) => {
        setPageNumber(page);
        if (size) setPageSize(size);
        fetchData(page, size || pageSize, keyword);
    };
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editItem) {
                await updatePublisher(editItem.id, { ...values });
                message.success("Cập nhật Publisher thành công");
            } else {
                await createPublisher({ ...values, isActive: values.isActive ?? true });
                message.success("Thêm Publisher thành công");
            }
            setOpenModal(false);
            setEditItem(null);
            form.resetFields();
            fetchData(pageNumber, pageSize);
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<string>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "Lỗi hệ thống không xác định");
            }
        }
    };

    // 👉 Xóa
    const handleDelete = async (id: number) => {
        try {
            setDeleteLoadingId(id);
            await deletePublisher(id);
            message.success("Xóa Publisher thành công");
            fetchData(pageNumber, pageSize);
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<string>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "Lỗi hệ thống không xác định");
            }
        } finally {
            setDeleteLoadingId(null);
        }
    };

    const columns: ColumnsType<Publisher> = [
        { title: "ID", dataIndex: "id", key: "id", width: 60 },
        { title: "Name", dataIndex: "publisherName", key: "publisherName" },
        {
            title: "Active",
            dataIndex: "isActive",
            key: "isActive",
            render: (active: boolean) =>
                active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
        },
        { title: "Phone Number", dataIndex: "contactInfo", key: "contactInfo" },
        { title: "Address", dataIndex: "publisherAddress", key: "publisherAddress" },
        {
            title: "Created Date",
            dataIndex: "createdDate",
            key: "createdDate",
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        { title: "Books", dataIndex: "productCount", key: "bookCount", align: "center" },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Publisher) => (
                <Space>
                    <Button
                        type="link"
                        onClick={() => {
                            setEditItem(record);
                            form.setFieldsValue({
                                publisherName: record.publisherName,
                                contactInfo: record.contactInfo,
                                publisherAddress: record.publisherAddress,
                                isActive: record.isActive,
                            });
                            setOpenModal(true);
                        }}
                    >
                        ✏ Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa publisher này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="link" danger loading={deleteLoadingId === record.id}>
                            🗑 Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    return (
        <div className="p-4">
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search by name"
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                    onPressEnter={handleSearch}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
                    Add Publisher
                </Button>
            </Space>

            <Table
                className="mt-4"
                columns={columns}
                dataSource={publishers}
                rowKey="id"
                loading={loading}
                bordered
                pagination={{
                    current: pageNumber,
                    pageSize,
                    total: totalCount,
                    showSizeChanger: true,
                    onChange: handleTableChange,
                }}
            />

            <Modal
                title={editItem ? "✏ Cập nhật Publisher" : "+ Thêm Publisher"}
                open={openModal}
                onCancel={() => {
                    setOpenModal(false);
                    setEditItem(null);
                    form.resetFields();
                }}
                onOk={handleSave}
                okText={editItem ? "Lưu thay đổi" : "Thêm mới"}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Publisher Name"
                        name="publisherName"
                        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                    >
                        <Input placeholder="Nhập tên Publisher" />
                    </Form.Item>

                    <Form.Item
                        label="Publisher Info"
                        name="contactInfo"
                        rules={[
                            { required: true, message: "Vui lòng nhập số liên lạc" },
                            {
                                pattern: /^[0-9]{9,11}$/,
                                message: "Số điện thoại không hợp lệ, chỉ nhập 9-11 chữ số",
                            },
                        ]}
                    >
                        <Input placeholder="VD: 09xxxxxxxx" maxLength={11} />
                    </Form.Item>

                    <Form.Item
                        label="Publisher Address"
                        name="publisherAddress"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                    >
                        <Input placeholder="VD: 123 đường ABC" />
                    </Form.Item>

                    <Form.Item label="Active" name="isActive" valuePropName="checked">
                        <Switch defaultChecked />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PublisherTab;
