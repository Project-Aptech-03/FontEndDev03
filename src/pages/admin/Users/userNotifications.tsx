import { Modal, Typography, notification } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { UsersResponseDto } from "../../../@type/UserResponseDto";

const { confirm } = Modal;
const { Text } = Typography;

export const showSuccessNotification = (message: string) => {
    notification.success({
        message: 'Thành công',
        description: message,
        placement: 'topRight',
        duration: 3,
        icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
});
};

export const showErrorNotification = (message: string) => {
    notification.error({
        message: 'Lỗi',
        description: message,
        placement: 'topRight',
        duration: 4,
        icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
});
};

export const showDeleteConfirm = (
    user: UsersResponseDto,
    onDelete: (id: string) => void
) => {
    confirm({
        title: 'Xác nhận xóa người dùng',
        icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
    content: (
        <span>
            Bạn có chắc chắn muốn xóa người dùng{" "}
    <Text strong>{user.firstName} {user.lastName}</Text>
        ? Hành động này không thể hoàn tác.
    </span>
),
    okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        centered: true,
        onOk() {
        onDelete(user.id);
    },
});
};