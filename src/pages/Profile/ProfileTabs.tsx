import { Tabs, Descriptions } from "antd";
import { UserOutlined, SettingOutlined, ShoppingOutlined } from "@ant-design/icons";
import { UsersResponseDto } from "../../@type/UserResponseDto";
import dayjs from "dayjs";

const { TabPane } = Tabs;

const ProfileTabs: React.FC<{ user: UsersResponseDto }> = ({ user }) => {
    return (
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
                        <Descriptions.Item label="Họ và tên">{user.fullName}</Descriptions.Item>
                        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {user.phoneNumber || "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            {user.dateOfBirth ? dayjs(user.dateOfBirth).format("YYYY-MM-DD") : "-"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Role">{user.role || "-"}</Descriptions.Item>
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
        </div>
    );
};

export default ProfileTabs;
