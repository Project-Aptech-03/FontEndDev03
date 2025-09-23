import { ColumnsType } from 'antd/es/table';
import { Button, Space, Tag, Avatar, Typography, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { showDeleteConfirm } from './userNotifications';
import {UsersResponseDto} from "../../../@type/UserResponseDto";

const { Text } = Typography;

const userColumns = (
    onEdit: (user: UsersResponseDto) => void,
    onDelete: (id: string) => void,
    currentUserRole: 'admin' | 'employee' | 'user' = 'user'
): ColumnsType<UsersResponseDto> => {

    const canModify = currentUserRole === 'admin';
    console.log('Current User Role:', currentUserRole, 'Can Modify:', canModify);
    return [
        {
            title: 'Name',
            key: 'fullname',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        size="large"
                        style={{ backgroundColor: '#7265e6', marginRight: 12 }}
                        src={record.avatarUrl}
                    >
                        {!record.avatarUrl && <UserAddOutlined />}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 500 }}>
                            {`${record.firstName} ${record.lastName}`}
                        </div>
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
                let displayText = role;

                // Standardize role display
                if (role === 'admin' || role === 'Admin') {
                    color = 'red';
                    displayText = 'Administrator';
                } else if (role === 'user' || role === 'User') {
                    color = 'green';
                    displayText = 'User';
                } else if (role === 'employee' || role === 'Employee') {
                    color = 'blue';
                    displayText = 'Employee';
                } else if (role === 'Manager') {
                    color = 'orange';
                    displayText = 'Manager';
                }

                return <Tag color={color}>{displayText}</Tag>;
            },
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            align: 'center',
            render: (text) => text || <Text type="secondary">Not updated</Text>,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
            render: (text) => text || <Text type="secondary">Not updated</Text>,
        },

        {
            title: 'Date Of Birth',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            align: 'center',
            render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : <Text type="secondary">Not updated</Text>,
        },
        {
            title: 'Status',
            key: 'status',
            align: 'center',
            render: () => <Tag color="green">Active</Tag>,
        },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip
                        title={canModify ? "Edit" : "You don't have permission to edit"}
                    >
                        <Button
                            type="primary"
                            ghost
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                                if (canModify) {
                                    onEdit(record);
                                } else {
                                    // Can show message or do nothing
                                    console.warn('No permission to edit');
                                }
                            }}
                            disabled={!canModify}
                            style={{
                                opacity: canModify ? 1 : 0.5,
                                cursor: canModify ? 'pointer' : 'not-allowed'
                            }}
                        />
                    </Tooltip>
                    <Tooltip
                        title={canModify ? "Delete" : "You don't have permission to delete"}
                    >
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                if (canModify) {
                                    showDeleteConfirm(record, onDelete);
                                } else {
                                    // Can show message or do nothing
                                    console.warn('No permission to delete');
                                }
                            }}
                            disabled={!canModify}
                            style={{
                                opacity: canModify ? 1 : 0.5,
                                cursor: canModify ? 'pointer' : 'not-allowed'
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];
};

export default userColumns;