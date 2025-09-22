import { Modal, Typography, notification } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { UsersResponseDto } from "../../../@type/UserResponseDto";

const { confirm } = Modal;
const { Text } = Typography;

export const showSuccessNotification = (message: string) => {
    notification.success({
        message: 'Success',
        description: message,
        placement: 'topRight',
        duration: 3,
        icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
    });
};

export const showErrorNotification = (message: string) => {
    notification.error({
        message: 'Error',
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
        title: 'Confirm user deletion',
        icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
        content: (
            <span>
                Are you sure you want to delete user{" "}
                <Text strong>{user.firstName} {user.lastName}</Text>
                ? This action cannot be undone.
            </span>
        ),
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
        onOk() {
            onDelete(user.id);
        },
    });
};