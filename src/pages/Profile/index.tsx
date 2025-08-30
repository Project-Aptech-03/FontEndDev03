import { Card, Avatar, Tabs, Button, Descriptions } from "antd";
import {
    UserOutlined,
    SettingOutlined,
    ShoppingOutlined,
    LogoutOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;

const Profile: React.FC = () => {
    const handleLogout = (): void => {
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // hoặc dùng navigate("/login") nếu bạn xài react-router
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
                display: "flex",
                justifyContent: "center",
                padding: "40px",
            }}
        >
            <Card
                style={{
                    width: "100%",
                    maxWidth: 950,
                    borderRadius: 16,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                }}
                bodyStyle={{ padding: 0 }}
            >
                {/* Cover ảnh bìa */}
                <div
                    style={{
                        height: 200,
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&q=80')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* Thông tin user */}
                <div style={{ padding: "0 24px", marginTop: -50 }}>
                    <Avatar
                        size={100}
                        src="https://i.pravatar.cc/150?img=12"
                        icon={<UserOutlined />}
                        style={{
                            border: "4px solid white",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                    />
                    <h2 style={{ marginTop: 12 }}>Nguyễn Văn A</h2>
                    <p style={{ color: "#888" }}>Fullstack Developer - Hà Nội, Việt Nam</p>
                </div>

                {/* Tabs */}
                <div style={{ padding: "24px" }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane
                            tab={
                                <span>
                  <UserOutlined /> Thông tin cá nhân
                </span>
                            }
                            key="1"
                        >
                            <Descriptions bordered column={1} size="middle">
                                <Descriptions.Item label="Họ và tên">
                                    Nguyễn Văn A
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    nguyenvana@example.com
                                </Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại">
                                    0123456789
                                </Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ">
                                    Hà Nội, Việt Nam
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày sinh">
                                    01/01/1995
                                </Descriptions.Item>
                            </Descriptions>
                        </TabPane>

                        <TabPane
                            tab={
                                <span>
                  <ShoppingOutlined /> Đơn hàng
                </span>
                            }
                            key="2"
                        >
                            <p>Bạn chưa có đơn hàng nào.</p>
                        </TabPane>

                        <TabPane
                            tab={
                                <span>
                  <SettingOutlined /> Cài đặt
                </span>
                            }
                            key="3"
                        >
                            <p>Chức năng cài đặt đang phát triển...</p>
                        </TabPane>
                    </Tabs>

                    {/* Nút Logout */}
                    <div style={{ textAlign: "right", marginTop: 24 }}>
                        <Button
                            type="primary"
                            danger
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Profile;
