import {Button, Card, Col, Spin} from "antd";
import { useState } from "react";
import { useProfile } from "./useProfile";
import { useChangePassword } from "./useChangePassword";
import ProfileForm from "./ProfileForm";
import ChangePasswordModal from "./ChangePasswordModal";
import {useNavigate} from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";

const EditProfile: React.FC = () => {
    const { form, loading, submitting, handleFinish, setSubmitting, currentUser } = useProfile(); // currentUser là UsersResponseDto
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
            title={`Chỉnh sửa thông tin cá nhân: ${fullName}`}
            extra={
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: 16 }}
                >
                    Quay lại
                </Button>
            }
            style={{
                maxWidth: 720,
                margin: "40px auto",
                borderRadius: 16,
                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
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
