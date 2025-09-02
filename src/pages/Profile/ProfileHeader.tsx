// ProfileHeader.tsx
import { useState } from "react";
import { message } from "antd";
import CelebrationIcon from "@mui/icons-material/Celebration";
import dayjs from "dayjs";
import { UsersResponseDto } from "../../@type/UserResponseDto";
import AvatarUpload from "../../components/AvatarUpload";
import { uploadAvatar } from "../../api/profile.api";
import {updateUser} from "../../api/user.api";
import {ApiResponse} from "../../@type/apiResponse";

const ProfileHeader: React.FC<{ user: UsersResponseDto }> = ({ user }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatarUrl);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (file: File) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await uploadAvatar(file);
            if (res?.url) {
                setAvatarUrl(res.url);
                await updateUser(user.id, { avatarUrl: res.url });
                message.success("Cập nhật avatar thành công!");
            } else {
                message.error("Upload thất bại, server không trả về URL");
            }
        }catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<UsersResponseDto>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "Lỗi hệ thống không xác định");
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={{ padding: "0 24px", marginTop: -50, textAlign: "center" }}>
            <AvatarUpload avatarUrl={avatarUrl} onUpload={handleUpload} loading={loading} />

            <h2 style={{ marginTop: 12, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12 }}>
                <span style={{ fontSize: 22, fontWeight: 600 }}>{user.fullName}</span>
                <span style={{ fontSize: 14, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
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
