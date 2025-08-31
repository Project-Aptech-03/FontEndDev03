import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import CelebrationIcon from "@mui/icons-material/Celebration";
import dayjs from "dayjs";
import { UsersResponseDto } from "../../@type/UserResponseDto";

const ProfileHeader: React.FC<{ user: UsersResponseDto }> = ({ user }) => {
    return (
        <div style={{ padding: "0 24px", marginTop: -50 }}>
            <Avatar
                size={100}
                src={user.avataUrl || "https://i.pravatar.cc/150?img=12"}
                icon={<UserOutlined />}
                style={{
                    border: "4px solid white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
            />

            <h2
                style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "baseline",
                    gap: 12,
                }}
            >
                <span style={{ fontSize: 22, fontWeight: 600 }}>{user.fullName}</span>
                <span
                    style={{
                        fontSize: 14,
                        color: "#888",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                    }}
                >
          <CelebrationIcon style={{ color: "#ff4d4f", fontSize: 16 }} />
                    {dayjs().diff(dayjs(user.dateOfBirth), "year")} tuổi
        </span>
            </h2>

            <p style={{ color: "#888" }}>
                {user.role || "Người dùng"} - {user.address || "Chưa có địa chỉ"}
            </p>
        </div>
    );
};

export default ProfileHeader;
