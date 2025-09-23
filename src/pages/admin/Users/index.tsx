import { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Divider, Input, message, Button, Tooltip } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import UserTable from './UserTable';
import UserForm from './UserForm';
import { deleteUser, getAllUsers } from "../../../api/user.api";
import { filterUsers } from "../../../utils/userFunciton";
import { UsersResponseDto } from "../../../@type/UserResponseDto";
import { showSuccessNotification } from "./userNotifications";
import { useAuth } from "../../../routes/AuthContext";

const { Title, Text } = Typography;

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UsersResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UsersResponseDto | null>(null);
  const [search, setSearch] = useState("");
  const currentUserRole = user?.role ? user.role.toLowerCase() : "user";
  const canAddUser = currentUserRole === "admin";



  const fetchUsers = async (pageIndex = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await getAllUsers(pageIndex, pageSize);
      setUsers(res.data.items);
      setTotal(res.data.totalCount);
    } catch (err: any) {
      const apiError = err.response?.data;
      if (apiError?.errors && typeof apiError.errors === "object") {
        const messages = Object.values(apiError.errors).flat() as string[];
        messages.forEach(msg => message.error(msg));
      } else if (apiError?.message) {
        message.error(apiError.message);
      } else if (err.message) {
        message.error(err.message);
      } else {
        message.error("Unknown system error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, pageSize);
  }, [page, pageSize]);

  useEffect(() => {
    if (search) {
      setUsers(filterUsers(users, search));
    } else {
      fetchUsers(page, pageSize);
    }
  }, [search]);

  const handleAdd = () => {
    if (!canAddUser) {
      message.warning("You do not have permission to add users");
      return;
    }
    setEditingUser(null);
    setModalVisible(true);
  };

  const handleEdit = (record: UsersResponseDto) => {
    setEditingUser(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteUser(id);
      showSuccessNotification("User deleted successfully!");
      fetchUsers(page, pageSize);
    } catch (err: any) {
      const apiError = err.response?.data;
      if (apiError?.errors && typeof apiError.errors === "object") {
        const messages = Object.values(apiError.errors).flat() as string[];
        messages.forEach(msg => message.error(msg));
      } else if (apiError?.message) {
        message.error(apiError.message);
      } else if (err.message) {
        message.error(err.message);
      } else {
        message.error("Unknown system error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Card style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
            <Col>
              <Title level={3} style={{ margin: 0, color: "#262626" }}>
                <UserAddOutlined style={{ marginRight: 10, color: "#1890ff" }} />
                User Management
              </Title>
              <Text type="secondary">Total: {users.length} users</Text>
            </Col>
            <Col>
              <Tooltip title={!canAddUser ? "You do not have permission to add users" : ""}>
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    size="large"
                    onClick={handleAdd}
                    disabled={!canAddUser} // 👈 disable if no permission
                >
                  Add User
                </Button>
              </Tooltip>
            </Col>
          </Row>

          <Divider style={{ margin: "16px 0" }} />

          <Row justify="space-between" style={{ marginBottom: 20 }}>
            <Col>
              <Input
                  placeholder="🔍 Search by email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                  style={{ width: 400 }}
                  size="large"
              />
            </Col>
          </Row>

          <UserTable
              users={users}
              loading={loading}
              total={total}
              page={page}
              pageSize={pageSize}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPageChange={(p, ps) => {
                setPage(p);
                setPageSize(ps);
              }}
              currentUserRole={currentUserRole}
          />

          <UserForm
              visible={modalVisible}
              editingUser={editingUser}
              onCancel={() => setModalVisible(false)}
              onSuccess={() => {
                setModalVisible(false);
                fetchUsers(page, pageSize);
              }}
          />
        </Card>
      </div>
  );
};

export default UserManagement;
