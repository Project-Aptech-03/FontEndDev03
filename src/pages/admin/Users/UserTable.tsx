import { Table } from 'antd';
import { UsersResponseDto } from "../../../@type/UserResponseDto";
import userColumns from './userColumns';

interface UserTableProps {
    users: UsersResponseDto[];
    loading: boolean;
    total: number;
    page: number;
    pageSize: number;
    onEdit: (record: UsersResponseDto) => void;
    onDelete: (id: string) => void;
    onPageChange: (page: number, pageSize: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
                                                 users,
                                                 loading,
                                                 total,
                                                 page,
                                                 pageSize,
                                                 onEdit,
                                                 onDelete,
                                                 onPageChange
                                             }) => {
    const columns = userColumns(onEdit, onDelete);

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={users}
            loading={loading}
            pagination={{
                total,
                current: page,
                pageSize,
                showSizeChanger: true,
                onChange: onPageChange,
            }}
        />
    );
};

export default UserTable;
