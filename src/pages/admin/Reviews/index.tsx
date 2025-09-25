
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Space,
  Button,
  Tag,
  Rate,
  Modal,
  Form,
  Input,
  message,
  Avatar,
  Image,
  Typography,
  Row,
  Col,
  Divider,
  Tooltip,
  Badge,
  Select,
  DatePicker,
  Spin,
  Alert,
  List,
  Collapse,
} from 'antd';
import {
  UserOutlined,
  MessageOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PictureOutlined,
  CalendarOutlined,
  StarFilled,
  SendOutlined, // Changed from ReplyOutlined
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  ExportOutlined,
  SyncOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { ReviewResponse, CreateReplyRequest, ReviewReply } from '../../../@type/Orders';
import {
  getProductReviews,
  getPendingReviews,
  approveReview,
  rejectReview,
  addReply,
  deleteReply
} from '../../../api/reviews.api';
import { getProducts } from '../../../api/products.api'; // Changed function name
import { ProductsResponseDto } from '../../../@type/productsResponse';
import './AdminReviews.css'; // Import CSS file

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface AdminReviewsProps {}

interface FilterOptions {
  status: 'all' | 'approved' | 'pending';
  rating: number | null;
  dateRange: [string, string] | null;
  productId: number | null;
}

const AdminReviews: React.FC<AdminReviewsProps> = () => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [products, setProducts] = useState<ProductsResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({});
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(null);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    rating: null,
    dateRange: null,
    productId: null
  });

  const [form] = Form.useForm();
  const [rejectForm] = Form.useForm();

  const baseUrl = 'https://localhost:7275';

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch products for filter dropdown - Fixed API call
      const productsResponse = await getProducts(1, 100); // Fetch first 100 products
      if (productsResponse.success && productsResponse.data) {
        setProducts(productsResponse.data.items || productsResponse.data);
      }

      await fetchReviews();
    } catch (error) {
      message.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      let allReviews: ReviewResponse[] = [];

      if (filters.productId) {
        // Fetch reviews for specific product
        const response = await getProductReviews(filters.productId);
        if (response.success && response.result?.data) {
          allReviews = response.result.data;
        }
      } else {
        // Fetch reviews from all products
        for (const product of products) {
          const response = await getProductReviews(product.id);
          if (response.success && response.result?.data) {
            allReviews = [...allReviews, ...response.result.data];
          }
        }
      }

      // Apply filters
      let filteredReviews = allReviews;

      if (filters.status !== 'all') {
        filteredReviews = filteredReviews.filter(review =>
            filters.status === 'approved' ? review.isApproved : !review.isApproved
        );
      }

      if (filters.rating) {
        filteredReviews = filteredReviews.filter(review => review.rating === filters.rating);
      }

      if (filters.dateRange) {
        const [start, end] = filters.dateRange;
        filteredReviews = filteredReviews.filter(review => {
          const reviewDate = new Date(review.reviewDate);
          return reviewDate >= new Date(start) && reviewDate <= new Date(end);
        });
      }

      // Sort by date (newest first)
      filteredReviews.sort((a, b) =>
          new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
      );

      setReviews(filteredReviews);
    } catch (error) {
      message.error('Failed to fetch reviews');
    }
  };

  const handleApproveReview = async (reviewId: number) => {
    try {
      setActionLoading({ ...actionLoading, [reviewId]: true });

      const response = await approveReview(reviewId);
      if (response.success) {
        message.success('Review approved successfully');
        fetchReviews();
      } else {
        message.error(response.error?.message || 'Failed to approve review');
      }
    } catch (error) {
      message.error('Failed to approve review');
    } finally {
      setActionLoading({ ...actionLoading, [reviewId]: false });
    }
  };

  const handleRejectReview = async (values: { reason: string }) => {
    if (!selectedReview) return;

    try {
      setActionLoading({ ...actionLoading, [selectedReview.id]: true });

      const response = await rejectReview(selectedReview.id, values.reason);
      if (response.success) {
        message.success('Review rejected successfully');
        setRejectModalVisible(false);
        setSelectedReview(null);
        rejectForm.resetFields();
        fetchReviews();
      } else {
        message.error(response.error?.message || 'Failed to reject review');
      }
    } catch (error) {
      message.error('Failed to reject review');
    } finally {
      setActionLoading({ ...actionLoading, [selectedReview.id]: false });
    }
  };

  const handleAddReply = async (values: { comment: string; parentReplyId?: number }) => {
    if (!selectedReview) return;

    try {
      const replyData: CreateReplyRequest = {
        comment: values.comment,
        parentReplyId: values.parentReplyId
      };

      const response = await addReply(selectedReview.id, replyData);
      if (response.success) {
        message.success('Reply added successfully');
        setReplyModalVisible(false);
        form.resetFields();
        fetchReviews();

        // Update selected review with new reply
        const updatedReviews = reviews.map(review =>
            review.id === selectedReview.id
                ? { ...review, reviewReplies: [...review.reviewReplies, response.result?.data] }
                : review
        );
        setReviews(updatedReviews);
      } else {
        message.error(response.error?.message || 'Failed to add reply');
      }
    } catch (error) {
      message.error('Failed to add reply');
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    try {
      const response = await deleteReply(replyId);
      if (response.success) {
        message.success('Reply deleted successfully');
        fetchReviews();
      } else {
        message.error(response.error?.message || 'Failed to delete reply');
      }
    } catch (error) {
      message.error('Failed to delete reply');
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    return imagePath.startsWith('/') ? `${baseUrl}${imagePath}` : imagePath;
  };

  const columns: ColumnsType<ReviewResponse> = [
    {
      title: 'Customer',
      key: 'customer',
      width: 200,
      render: (_, record) => (
          <div className="customer-info">
            <Avatar icon={<UserOutlined />} className="customer-avatar" />
            <div className="customer-details">
              <div className="customer-name">
                {record.customer?.fullName || 'Anonymous'}
              </div>
              <div className="customer-email">
                {record.customer?.email}
              </div>
            </div>
          </div>
      ),
    },
    {
      title: 'Product',
      key: 'product',
      width: 250,
      render: (_, record) => (
          <div>
            <div className="product-name">
              {record.product?.productName || 'Code'}
            </div>
            <Text type="secondary" className="order-info">
              Order #{record.orderId}
            </Text>
          </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating: number) => (
          <div className="rating-container">
            <Rate disabled defaultValue={rating} className="rating-stars" />
            <div className="rating-value">
              {rating}.0
            </div>
          </div>
      ),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      width: 300,
      render: (comment: string) => (
          <Paragraph
              ellipsis={{ rows: 2, tooltip: comment }}
              className="comment-text"
          >
            {comment || 'No comment provided'}
          </Paragraph>
      ),
    },
    {
      title: 'Images',
      key: 'images',
      width: 100,
      render: (_, record) => (
          <div className="images-container">
            {record.reviewImages && record.reviewImages.length > 0 ? (
                <Badge count={record.reviewImages.length} color="#52c41a">
                  <PictureOutlined className="images-icon" />
                </Badge>
            ) : (
                <Text type="secondary">No images</Text>
            )}
          </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, record) => (
          <div className="status-container">
            <Tag color={record.isApproved ? 'success' : 'warning'}>
              {record.isApproved ? 'Approved' : 'Pending'}
            </Tag>
          </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'reviewDate',
      key: 'reviewDate',
      width: 120,
      render: (date: string) => (
          <div className="date-container">
            <CalendarOutlined className="date-icon" />
            {new Date(date).toLocaleDateString()}
          </div>
      ),
    },
    {
      title: 'Replies',
      key: 'replies',
      width: 80,
      render: (_, record) => (
          <div className="replies-container">
            <Badge count={record.reviewReplies?.length || 0} color="#722ed1">
              <MessageOutlined className="replies-icon" />
            </Badge>
          </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
          <Space direction="horizontal" wrap className="actions-space">
            <Tooltip title="View Details">
              <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    setSelectedReview(record);
                    setDetailModalVisible(true);
                  }}
                  className="action-button"
              />
            </Tooltip>

            <Tooltip title="Add Reply">
              <Button
                  type="text"
                  icon={<SendOutlined />}
                  onClick={() => {
                    setSelectedReview(record);
                    setReplyModalVisible(true);
                  }}
                  className="action-button"
              />
            </Tooltip>

            {!record.isApproved && (
                <Tooltip title="Approve">
                  <Button
                      type="text"
                      icon={<CheckCircleOutlined />}
                      loading={actionLoading[record.id]}
                      onClick={() => handleApproveReview(record.id)}
                      className="action-button approve-button"
                  />
                </Tooltip>
            )}

            {!record.isApproved && (
                <Tooltip title="Reject">
                  <Button
                      type="text"
                      icon={<CloseCircleOutlined />}
                      loading={actionLoading[record.id]}
                      onClick={() => {
                        setSelectedReview(record);
                        setRejectModalVisible(true);
                      }}
                      className="action-button reject-button"
                  />
                </Tooltip>
            )}
          </Space>
      ),
    },
  ];

  const FilterPanel = () => (
      <Card className="filter-panel">
        <Row gutter={[16, 8]} align="middle">
          <Col xs={24} sm={6}>
            <Select
                placeholder="Filter by Status"
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                className="filter-select"
            >
              <Option value="all">All Reviews</Option>
              <Option value="approved">Approved Only</Option>
              <Option value="pending">Pending Only</Option>
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <Select
                placeholder="Filter by Rating"
                value={filters.rating}
                onChange={(value) => setFilters({ ...filters, rating: value })}
                className="filter-select"
                allowClear
            >
              {[5, 4, 3, 2, 1].map(rating => (
                  <Option key={rating} value={rating}>
                    <Rate disabled defaultValue={rating} className="option-rating" /> {rating}
                  </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <Select
                placeholder="Filter by Product"
                value={filters.productId}
                onChange={(value) => setFilters({ ...filters, productId: value })}
                className="filter-select"
                allowClear
                showSearch
                optionFilterProp="children"
            >
              {products.map(product => (
                  <Option key={product.id} value={product.id}>
                    {product.productName}
                  </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <Space>
              <Button
                  icon={<SyncOutlined />}
                  onClick={fetchReviews}
                  loading={loading}
                  className="refresh-button"
              >
                Refresh
              </Button>

              {/* chưa hoạt động */}
              {/* <Button icon={<ExportOutlined />} className="export-button">
              Export
            </Button> */}
            </Space>
          </Col>
        </Row>
      </Card>
  );

  const ReviewDetailModal = () => (
      <Modal
          title={
            <div className="modal-title">
              <StarFilled className="modal-icon" />
              Review Details
            </div>
          }
          open={detailModalVisible}
          onCancel={() => {
            setDetailModalVisible(false);
            setSelectedReview(null);
          }}
          footer={null}
          width={800}
          className="review-detail-modal"
      >
        {selectedReview && (
            <div>
              {/* Review Header */}
              <Row gutter={16} className="review-header">
                <Col span={12}>
                  <Card className="customer-card">
                    <div className="customer-profile">
                      <Avatar icon={<UserOutlined />} className="profile-avatar" />
                      <div className="profile-name">
                        {selectedReview.customer?.fullName || 'Anonymous'}
                      </div>
                      <Text type="secondary">{selectedReview.customer?.email}</Text>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className="rating-card">
                    <div className="rating-profile">
                      <Rate disabled defaultValue={selectedReview.rating} className="profile-rating" />
                      <div className="profile-score">
                        {selectedReview.rating}.0 / 5.0
                      </div>
                      <Tag color={selectedReview.isApproved ? 'success' : 'warning'} className="status-tag">
                        {selectedReview.isApproved ? 'Approved' : 'Pending Approval'}
                      </Tag>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* Product Info */}
              <Card className="product-info-card">
                <Text strong>Product: </Text>
                <Text>{selectedReview.product?.productName}</Text>
                <Divider type="vertical" />
                <Text strong>Order: </Text>
                <Text>#{selectedReview.orderId}</Text>
                <Divider type="vertical" />
                <Text strong>Date: </Text>
                <Text>{new Date(selectedReview.reviewDate).toLocaleDateString()}</Text>
              </Card>

              {/* Comment */}
              <Card title="Customer Comment" className="comment-card">
                <Paragraph className="comment-paragraph">
                  {selectedReview.comment || 'No comment provided.'}
                </Paragraph>
              </Card>

              {/* Images */}
              {selectedReview.reviewImages && selectedReview.reviewImages.length > 0 && (
                  <Card title="Customer Images" className="images-card">
                    <Image.PreviewGroup>
                      <div className="images-grid">
                        {selectedReview.reviewImages.map((image) => (
                            <Image
                                key={image.id}
                                src={getImageUrl(image.imageUrl)}
                                width={100}
                                height={100}
                                className="review-image"
                            />
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  </Card>
              )}

              {/* Replies */}
              <Card title={`Replies (${selectedReview.reviewReplies?.length || 0})`} className="replies-card">
                {selectedReview.reviewReplies && selectedReview.reviewReplies.length > 0 ? (
                    <List
                        dataSource={selectedReview.reviewReplies}
                        renderItem={(reply) => (
                            <List.Item
                                actions={[
                                  <Button
                                      type="text"
                                      danger
                                      icon={<DeleteOutlined />}
                                      onClick={() => handleDeleteReply(reply.id)}
                                      className="delete-reply-button"
                                  >
                                    Delete
                                  </Button>
                                ]}
                                className="reply-item"
                            >
                              <List.Item.Meta
                                  avatar={<Avatar icon={<UserOutlined />} />}
                                  title={
                                    <div className="reply-title">
                                      {reply.user?.fullName || 'Admin'}
                                      {reply.isAdminReply && <Tag color="blue" className="admin-tag">Admin</Tag>}
                                    </div>
                                  }
                                  description={
                                    <div className="reply-description">
                                      <div className="reply-comment">{reply.comment}</div>
                                      <Text type="secondary" className="reply-date">
                                        {new Date(reply.replyDate).toLocaleString()}
                                      </Text>
                                    </div>
                                  }
                              />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Text type="secondary">No replies yet</Text>
                )}
              </Card>
            </div>
        )}
      </Modal>
  );

  if (loading && reviews.length === 0) {
    return (
        <div className="loading-container">
          <Spin size="large" />
          <div className="loading-text">Loading reviews...</div>
        </div>
    );
  }

  return (
      <div className="admin-reviews-container">
        <Card>
          <div className="page-header">
            <Title level={2} className="page-title">

              Reviews Management
              <Badge
                  count={reviews.filter(r => !r.isApproved).length}
                  className="pending-badge"
              />
            </Title>
            <Text type="secondary" className="page-subtitle">
              Manage customer reviews and replies • Total: {reviews.length} reviews
            </Text>
          </div>

          <FilterPanel />

          <Table
              columns={columns}
              dataSource={reviews}
              rowKey="id"
              scroll={{ x: 1400 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} reviews`,
              }}
              loading={loading}
              className="reviews-table"
          />
        </Card>

        {/* Reply Modal */}
        <Modal
            title="Add Reply to Review"
            open={replyModalVisible}
            onCancel={() => {
              setReplyModalVisible(false);
              setSelectedReview(null);
              form.resetFields();
            }}
            onOk={() => form.submit()}
            okText="Send Reply"
            className="reply-modal"
        >
          <Form
              form={form}
              onFinish={handleAddReply}
              layout="vertical"
          >
            <Form.Item
                label="Reply Message"
                name="comment"
                rules={[
                  { required: true, message: 'Please enter your reply!' },
                  { max: 2000, message: 'Reply cannot exceed 2000 characters!' }
                ]}
            >
              <TextArea
                  rows={4}
                  placeholder="Enter your reply to this review..."
                  showCount
                  maxLength={2000}
                  className="reply-textarea"
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Reject Modal */}
        <Modal
            title="Reject Review"
            open={rejectModalVisible}
            onCancel={() => {
              setRejectModalVisible(false);
              setSelectedReview(null);
              rejectForm.resetFields();
            }}
            onOk={() => rejectForm.submit()}
            okText="Reject Review"
            okButtonProps={{ danger: true }}
            className="reject-modal"
        >
          <Form
              form={rejectForm}
              onFinish={handleRejectReview}
              layout="vertical"
          >
            <Alert
                message="This action cannot be undone"
                description="The review will be permanently rejected and hidden from customers."
                type="warning"
                className="reject-warning"
            />
            <Form.Item
                label="Rejection Reason"
                name="reason"
                rules={[
                  { required: true, message: 'Please provide a reason for rejection!' },
                  { max: 500, message: 'Reason cannot exceed 500 characters!' }
                ]}
            >
              <TextArea
                  rows={3}
                  placeholder="Please explain why this review is being rejected..."
                  showCount
                  maxLength={500}
                  className="reject-textarea"
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Detail Modal */}
        <ReviewDetailModal />
      </div>
  );
};

export default AdminReviews;