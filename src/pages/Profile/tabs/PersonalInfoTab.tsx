import React from "react";
import { Descriptions } from "antd";
import dayjs from "dayjs";
import {UsersResponseDto} from "../../../@type/UserResponseDto";
import ProfileActions from "../ProfileActions";
import {useNavigate} from "react-router-dom";

interface Props {
    user: UsersResponseDto;
    navigate: ReturnType<typeof useNavigate>;
    handleLogout: () => void;
}
const PersonalInfoTab: React.FC<Props> = ({ user, navigate, handleLogout }) => {
    return (
        <>
        <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Họ và tên">{user.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{user.phoneNumber || "-"}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
                {user.dateOfBirth ? dayjs(user.dateOfBirth).format("YYYY-MM-DD") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{user.address || "-"}</Descriptions.Item>
            <Descriptions.Item label="Role">{user.role || "-"}</Descriptions.Item>
        </Descriptions>

             <ProfileActions navigate={navigate} handleLogout={handleLogout} />
        </>

    );
};

export default PersonalInfoTab;
