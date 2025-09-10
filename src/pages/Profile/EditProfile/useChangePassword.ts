import { Form, message } from "antd";
import { changePassword } from "../../../api/profile.api";
import { ApiResponse } from "../../../@type/apiResponse";
import { UsersResponseDto } from "../../../@type/UserResponseDto";

export const useChangePassword = (setModalVisible: (v: boolean) => void, setSubmitting: (v: boolean) => void) => {
    const [passwordForm] = Form.useForm();

    const handlePasswordUpdate = async () => {
        try {
            const values = await passwordForm.validateFields();
            if (values.newPassword !== values.confirmPassword) {
                message.error("Mật khẩu mới và xác nhận không khớp");
                return;
            }
            const res = await changePassword(values.currentPassword, values.newPassword, values.confirmPassword);
            if (res.success) {
                message.success("Đổi mật khẩu thành công");
                setModalVisible(false);
                passwordForm.resetFields();
            } else {
                message.error(res.message || "Đổi mật khẩu thất bại");
            }
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<UsersResponseDto>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "Lỗi hệ thống không xác định");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return { passwordForm, handlePasswordUpdate };
};
