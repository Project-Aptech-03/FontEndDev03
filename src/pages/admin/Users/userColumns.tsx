import { ColumnsType } from 'antd/es/table';
import { Button, Space, Tag, Avatar, Typography, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { showDeleteConfirm } from './userNotifications';
import {UsersResponseDto} from "../../../@type/UserResponseDto";

const { Text } = Typography;

const userColumns = (
    onEdit: (user: UsersResponseDto) => void,
    onDelete: (id: number) => void
): ColumnsType<UsersResponseDto> => [
    {
        title: 'Name',
        key: 'fullname',
        render: (_, record) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                    size="large"
                    style={{ backgroundColor: '#7265e6', marginRight: 12 }}
                    icon={<UserAddOutlined />}
                />
                <div>
                    <div style={{ fontWeight: 500 }}>{`${record.firstName} ${record.lastName}`}</div>
                    <Text type="secondary">{record.email}</Text>
                </div>
            </div>
        ),
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        align: 'center',
        render: (role) => {
            let color = 'blue';
            if (role === 'Admin') color = 'red';
            else if (role === 'User') color = 'green';
            else if (role === 'Manager') color = 'orange';
            return <Tag color={color}>{role}</Tag>;
        },
    },
    {
        title: ' Phone Number',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        align: 'center',
        render: (text) => text || <Text type="secondary">Chưa cập nhật</Text>,
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
        render: (text) => text || <Text type="secondary">Chưa cập nhật</Text>,
    },

    {
        title: 'Date Of Birth',
        dataIndex: 'dateOfBirth',
        key: 'dateOfBirth',
        align: 'center',
        render: (date) => date ? new Date(date).toLocaleDateString() : <Text type="secondary">Chưa cập nhật</Text>,
    },
    {
        title: 'Status',
        key: 'status',
        align: 'center',
        render: () => <Tag color="green">Hoạt động</Tag>,
    },
    {
        title: 'Action',
        key: 'action',
        width: 150,
        align: 'center',
        render: (_, record) => (
            <Space size="small">
                <Tooltip title="Chỉnh sửa">
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    />
                </Tooltip>
                <Tooltip title="Xóa">
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteConfirm(record, onDelete)}
                    />
                </Tooltip>
            </Space>
        ),
    },
];


export default userColumns;