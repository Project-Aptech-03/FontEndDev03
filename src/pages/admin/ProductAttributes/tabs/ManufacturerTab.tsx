import { useEffect, useState } from "react";
import {
    createManufacturer,
    deleteManufacturer,
    getManufacturers,
    updateManufacturer,
} from "../../../../api/manufacturer.api";
import { Button, Input, Modal, Table, Space, message } from "antd";

interface Manufacturer {
    id: number;
    manufacturerCode: string;
    manufacturerName: string;
    isActive: boolean;
    createdDate: string;
    productCount: number;
}

const ManufacturerTab = () => {
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editItem, setEditItem] = useState<Manufacturer | null>(null);
    const [form, setForm] = useState({ manufacturerCode: "", manufacturerName: "" });

    // Load list
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getManufacturers(1, 10);
            setManufacturers(res.data.items as Manufacturer[]);
        } catch (err) {
            console.error("Fetch manufacturers failed", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    // Save (Create or Update)
    const handleSave = async () => {
        try {
            if (editItem) {
                await updateManufacturer(editItem.id, form);
                message.success("Cập nhật thành công");
            } else {
                await createManufacturer(form);
                message.success("Tạo mới thành công");
            }
            setOpenModal(false);
            setForm({ manufacturerCode: "", manufacturerName: "" });
            setEditItem(null);
            fetchData();
        } catch (err) {
            console.error("Save manufacturer failed", err);
            message.error("Lỗi khi lưu manufacturer");
        }
    };

    // Delete
    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc muốn xóa manufacturer này?")) return;
        try {
            await deleteManufacturer(id);
            message.success("Xóa thành công");
            fetchData();
        } catch (err) {
            console.error("Delete manufacturer failed", err);
            message.error("Xóa thất bại");
        }
    };

    // Table columns
    const columns = [
        { title: "ID", dataIndex: "id" },
        { title: "Code", dataIndex: "manufacturerCode" },
        { title: "Name", dataIndex: "manufacturerName" },
        { title: "Active", dataIndex: "isActive", render: (val: boolean) => (val ? "✅" : "❌") },
        {
            title: "Created Date",
            dataIndex: "createdDate",
            render: (val: string) => new Date(val).toLocaleDateString(),
        },
        { title: "Products", dataIndex: "productCount" },
        {
            title: "Actions",
            render: (_: any, record: Manufacturer) => (
                <Space>
                    <Button
                        onClick={() => {
                            setEditItem(record);
                            setForm({
                                manufacturerCode: record.manufacturerCode,
                                manufacturerName: record.manufacturerName,
                            });
                            setOpenModal(true);
                        }}
                    >
                        ✏ Sửa
                    </Button>
                    <Button danger onClick={() => handleDelete(record.id)}>
                        🗑 Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
                🏭 Quản lý Manufacturer
            </h2>
            <Button type="primary" onClick={() => setOpenModal(true)}>
                + Thêm Manufacturer
            </Button>

            <Table
                className="mt-4"
                rowKey="id"
                columns={columns}
                dataSource={manufacturers}
                loading={loading}
                pagination={false}
            />

            {/* Modal Create/Update */}
            <Modal
                title={editItem ? "✏ Cập nhật Manufacturer" : "+ Thêm Manufacturer"}
                open={openModal}
                onCancel={() => {
                    setOpenModal(false);
                    setEditItem(null);
                    setForm({ manufacturerCode: "", manufacturerName: "" });
                }}
                onOk={handleSave}
                okText={editItem ? "Lưu thay đổi" : "Thêm mới"}
                cancelText="Hủy"
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Input
                        placeholder="Code (VD: ABC01)"
                        value={form.manufacturerCode}
                        onChange={(e) => setForm({ ...form, manufacturerCode: e.target.value })}
                    />
                    <Input
                        placeholder="Name"
                        value={form.manufacturerName}
                        onChange={(e) => setForm({ ...form, manufacturerName: e.target.value })}
                    />
                </Space>
            </Modal>
        </div>
    );
};

export default ManufacturerTab;
