import { Button, Card, Spin, Typography } from "antd";
import { useState } from "react";
import { useProfile } from "./useProfile";
import { useChangePassword } from "./useChangePassword";
import ProfileForm from "./ProfileForm";
import ChangePasswordModal from "./ChangePasswordModal";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;

const EditProfile: React.FC = () => {
    const { form, loading, submitting, handleFinish, setSubmitting, currentUser } =
        useProfile();
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const navigate = useNavigate();
    const { passwordForm, handlePasswordUpdate } = useChangePassword(
        setPasswordModalOpen,
        setSubmitting
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Spin size="large" tip="Đang tải thông tin..." />
            </div>
        );
    }

    const fullName = `${form.getFieldValue("firstName") || ""} ${
        form.getFieldValue("lastName") || ""
    }`;

    return (
        <>
            <Card
                title={<Title level={4}>✏️ Chỉnh sửa hồ sơ: {fullName || "Người dùng"}</Title>}
                extra={
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                    >
                        Quay lại
                    </Button>
                }
                style={{
                    maxWidth: 800,
                    margin: "40px auto",
                    borderRadius: 20,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    padding: "24px 32px",
                }}
            >
                {currentUser && (
                    <ProfileForm
                        form={form}
                        submitting={submitting}
                        onFinish={handleFinish}
                        openChangePassword={() => setPasswordModalOpen(true)}
                        user={currentUser}
                    />
                )}
            </Card>

            <ChangePasswordModal
                visible={isPasswordModalOpen}
                onCancel={() => setPasswordModalOpen(false)}
                onOk={handlePasswordUpdate}
                passwordForm={passwordForm}
            />
        </>
    );
};

export default EditProfile;
