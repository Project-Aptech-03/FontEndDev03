import { useEffect, useState } from "react";
import { Form, message } from "antd";
import dayjs from "dayjs";
import { getProfile, updateProfile } from "../../../api/profile.api";
import { UpdateProfileDto, UsersResponseDto } from "../../../@type/UserResponseDto";
import { ApiResponse } from "../../../@type/apiResponse";
import {useNavigate} from "react-router-dom";

export const useProfile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getProfile();
                if (res.success && res.data) {
                    const data = res.data;
                    form.setFieldsValue({
                        ...data,
                        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : undefined,
                    });
                } else {
                    message.error(res.message || "Lỗi tải thông tin");
                }
            } catch (err: any) {
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
        fetchUser();
    }, [form]);

    const handleFinish = async (values: UpdateProfileDto) => {
        setSubmitting(true);
        try {
            if (!values.password) delete values.password;
            if (values.dateOfBirth) values.dateOfBirth = dayjs(values.dateOfBirth).format("YYYY-MM-DD");
            const res = await updateProfile(values);
            res.success ? message.success("Cập nhật thành công") : message.error(res.message || "Cập nhật thất bại");
            navigate("/profile")
        } finally {
            setSubmitting(false);
        }
    };

    return { form, loading, submitting, handleFinish, setSubmitting };
};
