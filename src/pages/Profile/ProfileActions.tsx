import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { NavigateFunction } from "react-router-dom";

const ProfileActions: React.FC<{ navigate: NavigateFunction; handleLogout: () => void }> = ({
                                                                                                navigate,
                                                                                                handleLogout,
                                                                                            }) => {
    return (
        <div style={{ textAlign: "right", marginTop: 24, padding: "0 24px 24px" }}>
            <Button type="primary" style={{ marginRight: 12 }} onClick={() => navigate("/profile/edit")}>
                Chỉnh sửa
            </Button>
            <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
            </Button>
        </div>
    );
};

export default ProfileActions;
