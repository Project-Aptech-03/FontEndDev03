


import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Space,
  Spin,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Tooltip
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { FAQ, UpdateFAQDto } from '../../../services/faqService';
import faqService from '../../../services/faqService';
import './FaqAdmin.css';

const FaqAdmin: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [form] = Form.useForm();
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: number]: boolean }>({});

  // Thống kê
  const stats = {
    total: faqs.length,
    active: faqs.filter(f => f.isActive).length,
    inactive: faqs.filter(f => !f.isActive).length
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [faqs, searchText]);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await faqService.getAllFaqs();
      setFaqs(data);
    } catch (error: any) {
      console.error('Error loading FAQs:', error);
      if (error.response?.status === 401) {
        message.error('You do not have access. Please log in again.');
      } else {
        message.error('Unable to load FAQ list');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterFaqs = () => {
    let filtered = faqs;

    if (searchText) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredFaqs(filtered);
  };

  const checkDuplicateOrder = (displayOrder: number, excludeId?: number): boolean => {
    return faqs.some(faq => 
      faq.displayOrder === displayOrder && 
      faq.id !== excludeId
    );
  };

  const handleCreate = async (values: any) => {
    try {
      // Kiểm tra trùng số thứ tự
      if (checkDuplicateOrder(values.displayOrder)) {
        message.error('Display order already exists. Please choose another one.');
        return;
      }

      const createData = {
        question: values.question,
        answer: values.answer,
        displayOrder: values.displayOrder,
        isActive: values.isActive // Lấy giá trị từ form
      };
      
      await faqService.createFaq(createData);
      message.success('Created FAQ successfully');
      setModalVisible(false);
      form.resetFields();
      loadFaqs(); // Load lại từ server để có dữ liệu chính xác
    } catch (error) {
      console.error('Error creating FAQ:', error);
      message.error('Unable to create FAQ');
    }
  };

  const handleUpdate = async (id: number, values: any) => {
    try {
      // Kiểm tra trùng số thứ tự (trừ chính bản ghi đang sửa)
      if (checkDuplicateOrder(values.displayOrder, id)) {
        message.error('Display order already exists. Please choose another one.');
        return;
      }

      const updateData: UpdateFAQDto = {
        question: values.question,
        answer: values.answer,
        displayOrder: values.displayOrder,
        isActive: values.isActive // Lấy giá trị từ form
      };
      
      await faqService.updateFaq(id, updateData);
      message.success('Updated FAQ successfully');
      setModalVisible(false);
      setEditingFaq(null);
      form.resetFields();
      loadFaqs(); // Load lại từ server để có dữ liệu chính xác
    } catch (error) {
      console.error('Error updating FAQ:', error);
      message.error('Unable to update FAQ');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await faqService.deleteFaq(id);
      message.success('Deleted FAQ successfully');
      loadFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      message.error('Unable to delete FAQ');
    }
  };

  const handleStatusToggle = async (id: number, isActive: boolean) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [id]: true }));
      
      const faq = faqs.find(f => f.id === id);
      if (!faq) {
        message.error('FAQ not found');
        return;
      }

      const updateData: UpdateFAQDto = {
        question: faq.question,
        answer: faq.answer,
        displayOrder: faq.displayOrder,
        isActive: isActive
      };

      await faqService.updateFaq(id, updateData);
      
      // Cập nhật state ngay lập tức để UI phản hồi nhanh
      setFaqs(prev => prev.map(item => 
        item.id === id ? { ...item, isActive: isActive } : item
      ));
      
      message.success(isActive ? 'Activated FAQ' : 'Deactivated FAQ');
    } catch (error) {
      console.error('Error toggling FAQ status:', error);
      message.error('Unable to change status');
      
      // Khôi phục lại trạng thái cũ nếu có lỗi
      setFaqs(prev => prev.map(item => 
        item.id === id ? { ...item, isActive: !isActive } : item
      ));
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    form.setFieldsValue({
      question: faq.question,
      answer: faq.answer,
      displayOrder: faq.displayOrder,
      isActive: faq.isActive // Set giá trị chính xác từ database
    });
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingFaq(null);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    if (editingFaq) {
      handleUpdate(editingFaq.id, values);
    } else {
      handleCreate(values);
    }
  };

  const columns: ColumnsType<FAQ> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true,
      render: (text, record) => (
        <div>
          <div className="faq-question-text">{text}</div>
          <div className="faq-answer-preview">
            {record.answer.length > 50 
              ? `${record.answer.substring(0, 50)}...` 
              : record.answer
            }
          </div>
        </div>
      )
    },
    {
      title: 'DisplayOrder',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 200,
      sorter: (a, b) => a.displayOrder - b.displayOrder,
      render: (order) => (
        <Tag color="blue">{order}</Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive, record) => {
        return (
          <Space direction="vertical" align="center">
            <Tag color={isActive ? 'green' : 'red'}>
              {isActive ? 'VISIBLE' : 'HIDDEN'}
            </Tag>
            <Switch
              checked={isActive}
              loading={updatingStatus[record.id]}
              onChange={(checked) => handleStatusToggle(record.id, checked)}
              checkedChildren={<EyeOutlined />}
              unCheckedChildren={<EyeInvisibleOutlined />}
            />
          </Space>
        );
      }
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
      sorter: (a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime()
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this FAQ?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okType="danger"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  if (loading) {
    return (
      <div className="faq-admin-loading">
        <Spin size="large" />
        <p>Loading FAQ data...</p>
      </div>
    );
  }

  return (
    <div className="faq-admin">
      <div className="faq-admin-header">
        <div className="faq-header-content">
          <h1>FAQ Management</h1>
          <p>Manage and update frequently asked questions on the website</p>
        </div>
        
        <Space>
          <Input.Search
            placeholder="Search FAQs..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            onSearch={filterFaqs}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={loadFaqs}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingFaq(null);
              form.setFieldsValue({
                question: '',
                answer: '',
                displayOrder: faqs.length > 0 ? Math.max(...faqs.map(f => f.displayOrder)) + 1 : 1,
                isActive: true // Mặc định là hiển thị khi tạo mới
              });
              setModalVisible(true);
            }}
          >
            Add FAQ
          </Button>
        </Space>
      </div>

      Statistics
      <Row gutter={16} className="faq-stats-row">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total FAQs"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Visible"
              value={stats.active}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Hidden"
              value={stats.inactive}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng dữ liệu */}
      <Card className="faq-admin-content">
        <Table
          columns={columns}
          dataSource={filteredFaqs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} FAQ`
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal thêm/sửa FAQ */}
      <Modal
        title={editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="question"
            label="Question"
            rules={[
              { required: true, message: 'Please enter the question' },
              { min: 10, message: 'Question must be at least 10 characters' }
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter frequently asked question..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="answer"
            label="Answer"
            rules={[
              { required: true, message: 'Please enter the answer' },
              { min: 10, message: 'Answer must be at least 10 characters' }
            ]}
          >
            <Input.TextArea
              rows={5}
              placeholder="Enter detailed answer..."
              maxLength={2000}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="displayOrder"
            label={
              <span>
                Display Order{' '}
                <Tooltip title="Order number must not duplicate other FAQs">
                  <ExclamationCircleOutlined style={{ color: '#1890ff' }} />
                </Tooltip>
              </span>
            }
            rules={[
              { required: true, message: 'Please enter the display order' },
              { type: 'number', min: 0, message: 'Order must be a positive number' },
              {
                validator: async (_, value) => {
                  if (editingFaq && checkDuplicateOrder(value, editingFaq.id)) {
                    throw new Error('Order number already exists');
                  }
                  if (!editingFaq && checkDuplicateOrder(value)) {
                    throw new Error('Order number already exists');
                  }
                }
              }
            ]}
          >
            <InputNumber
              min={0}
              max={100}
              placeholder="0"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Display Status"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Visible"
              unCheckedChildren="Hidden"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingFaq ? 'Update' : 'Create'}
              </Button>
              <Button onClick={handleModalCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FaqAdmin;