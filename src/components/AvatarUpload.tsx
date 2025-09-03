// AvatarUpload.tsx
import { Avatar, Upload, message, Spin } from "antd";
import { PlusOutlined, LoadingOutlined, UserOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

interface AvatarUploadProps {
    avatarUrl?: string;
    onUpload: (file: File) => Promise<void>;
    loading?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatarUrl, onUpload, loading }) => {

    const handleChange: UploadProps["customRequest"] = async ({ file, onSuccess, onError }) => {
        const f = file as File;
        if (!f.type.startsWith("image/")) {
            message.error("Chỉ được upload file ảnh!");
            onError?.(new Error("File không hợp lệ"));
            return;
        }

        try {
            await onUpload(f);
            onSuccess?.("ok");
        } catch (err) {
            console.error(err);
            message.error("Upload thất bại!");
            onError?.(new Error("Upload thất bại"));
        }
    };

    return (
        <Upload showUploadList={false} customRequest={handleChange}>
            <div style={{ position: "relative", width: 120, height: 120 }}>
                <Avatar
                    src={avatarUrl}
                    size={120}
                    icon={!avatarUrl && <UserOutlined />}
                    style={{
                        border: "3px solid #fff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        cursor: "pointer",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: "35%",
                        background: "rgba(0,0,0,0.45)",
                        borderBottomLeftRadius: "50%",
                        borderBottomRightRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 14,
                        opacity: 0,
                        transition: "opacity 0.3s",
                    }}
                    className="avatar-hover"
                >
                    {loading ? <Spin indicator={<LoadingOutlined spin />} /> : <PlusOutlined />}
                </div>
                <style>{`
                    .avatar-hover:hover {
                        opacity: 1;
                    }
                `}</style>
            </div>
        </Upload>
    );
};

export default AvatarUpload;
