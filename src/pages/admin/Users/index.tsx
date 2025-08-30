
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Card,
  Typography,
  Tag,
  Avatar,
  Row,
  Col,
  Divider,
  notification,
  Tooltip
} from 'antd';
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  CheckCircleFilled,

} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {Users} from "../../../@type/Users";
import {useEffect, useState} from "react";
import {createUser, deleteUser, getUsers, updateUser} from "../../../api/user.api";
import {filterUsers} from "../../../util/userFunciton";


const { Title, Text } = Typography;
const { confirm } = Modal;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<Users | null>(null);
  const [form] = Form.useForm();
  const fetchUsers = async (page: number, size: number) => {
    setLoading(true);
    try {
      const res = await getUsers(page + 1, size);

      setUsers(res.items);        // ✅ danh sách user
      setTotal(res.totalCount);   // ✅ tổng số bản ghi
    } catch (err: any) {
      showErrorNotification(err.message || "Không tải được danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };


  const [search, setSearch] = useState("");
  useEffect(() => {
    if (search) {
      filterUsers(users, search);
      setUsers(filterUsers(users, search));
    } else {
      fetchUsers(page, pageSize);
    }

  }, [search]);

  const showSuccessNotification = (message: string) => {
    notification.success({
      message: 'Thành công',
      description: message,
      placement: 'topRight',
      duration: 3,
      icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
    });
  };

  const showErrorNotification = (message: string) => {
    notification.error({
      message: 'Lỗi',
      description: message,
      placement: 'topRight',
      duration: 4,
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
    });
  };

  const showDeleteConfirm = (user: Users) => {
    confirm({
      title: 'Xác nhận xóa người dùng',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: `Bạn có chắc chắn muốn xóa người dùng ${user.firstname} ${user.lastname}? Hành động này không thể hoàn tác.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      onOk() {
        handleDelete(user.id);
      },
    });
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteUser(id);
      showSuccessNotification("Đã xóa người dùng thành công!");
      fetchUsers(page, pageSize);
    } catch {
      showErrorNotification("Xóa người dùng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    form.validateFields()
        .then(async (values) => {
          setLoading(true);
          try {
            if (editingUser) {
              await updateUser(editingUser.id, values);
              showSuccessNotification("Cập nhật thông tin người dùng thành công!");
            } else {
              await createUser(values);
              showSuccessNotification("Thêm người dùng mới thành công!");
            }
            setModalVisible(false);
            fetchUsers(page, pageSize);
          } catch {
            showErrorNotification("Thao tác thất bại!");
          } finally {
            setLoading(false);
          }
        })
        .catch(() => {
          showErrorNotification("Vui lòng kiểm tra lại thông tin đã nhập!");
        });
  };


  // Xử lý thêm người dùng mới
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Xử lý sửa người dùng
  const handleEdit = (record: Users) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const columns: ColumnsType<Users> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      align: 'center',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'HỌ VÀ TÊN',
      key: 'fullnamex`',
      render: (_, record) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
                size="large"
                style={{ backgroundColor: '#7265e6', marginRight: 12 }}
                icon={<UserAddOutlined />}
            />
            <div>
              <div style={{ fontWeight: 500 }}>{`${record.firstname} ${record.lastname}`}</div>
              <Text type="secondary">{record.email}</Text>
            </div>
          </div>
      ),
    },
    {
      title: 'SỐ ĐIỆN THOẠI',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: 'ĐỊA CHỈ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'TRẠNG THÁI',
      key: 'status',
      align: 'center',
      render: () => <Tag color="green">Hoạt động</Tag>,
    },
    {
      title: 'THAO TÁC',
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
                  onClick={() => handleEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Xóa">
              <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => showDeleteConfirm(record)}
              />
            </Tooltip>
          </Space>
      ),
    },
  ];

  return (
      <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}
        >
          <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
            <Col>
              <Title level={3} style={{ margin: 0, color: '#262626' }}>
                <UserAddOutlined style={{ marginRight: 10, color: '#1890ff' }} />
                Quản Lý Người Dùng
              </Title>
              <Text type="secondary">Tổng số: {users.length} người dùng</Text>
            </Col>
            <Col>
              <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  size="large"
                  onClick={handleAdd}
              >
                Thêm Người Dùng
              </Button>
            </Col>
          </Row>

          <Divider style={{ margin: '16px 0' }} />

          <Row justify="space-between" style={{ marginBottom: 20 }}>
            <Col>
              <Input
                  placeholder="🔍 Tìm kiếm theo tên, email hoặc số điện thoại..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                  style={{ width: 400 }}
                  size="large"
              />
            </Col>
          </Row>

          <Table
              rowKey="id"
              columns={columns}
              dataSource={users}
              loading={loading}
              pagination={{
                total,
                current: page,
                pageSize: pageSize,
                showSizeChanger: true,
                onChange: (p, ps) => {
                  setPage(p);
                  setPageSize(ps);
                },
              }}
          />

          <Modal
              open={modalVisible}
              title={
                <div>
                  {editingUser ? (
                      <>
                        <EditOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                        Chỉnh Sửa Người Dùng
                      </>
                  ) : (
                      <>
                        <UserAddOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        Thêm Người Dùng Mới
                      </>
                  )}
                </div>
              }
              onCancel={() => setModalVisible(false)}
              onOk={handleSave}
              okText={editingUser ? "Cập nhật" : "Thêm mới"}
              cancelText="Hủy"
              confirmLoading={loading}
              width={600}
              centered
              styles={{
                body: { padding: '20px 0' },
                header: { borderBottom: '1px solid #f0f0f0', marginBottom: 20 }
              }}
          >
            <Divider style={{ margin: '10px 0' }} />

            <Form
                form={form}
                layout="vertical"
                style={{ padding: '0 24px' }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                      name="firstname"
                      label="Họ"
                      rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                  >
                    <Input
                        placeholder="Nhập họ..."
                        size="large"
                        prefix={<UserAddOutlined style={{ color: '#bfbfbf' }} />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                      name="lastname"
                      label="Tên"
                      rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                  >
                    <Input
                        placeholder="Nhập tên..."
                        size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
              >
                <Input
                    placeholder="Nhập email..."
                    size="large"
                    prefix={<span style={{ color: '#bfbfbf' }}>@</span>}
                />
              </Form.Item>

              <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                  ]}
              >
                <Input
                    placeholder="Nhập số điện thoại..."
                    size="large"
                    prefix={<span style={{ color: '#bfbfbf' }}>📱</span>}
                />
              </Form.Item>

              <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input.TextArea
                    placeholder="Nhập địa chỉ..."
                    rows={3}
                />
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </div>
  );
};

export default UserManagement;