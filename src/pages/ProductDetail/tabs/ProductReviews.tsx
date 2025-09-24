import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Rate, Avatar, List, Spin, Alert,
  Button, Space, Progress, Empty, Tag, Image, Typography, Tabs, Input, Form, Modal, message
} from 'antd';
import {
  StarFilled, UserOutlined,
  EyeOutlined, MessageOutlined, CalendarOutlined,
  PictureOutlined,
  DeleteOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { ReviewResponse, CreateReplyRequest } from "../../../@type/Orders";
import { getProductReviews, getProductReviewStats, addReply, deleteReply } from "../../../api/reviews.api";

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface ProductReviewsProps {
  productId: number;
  onReviewCountChange?: (count: number) => void;
  maxHeight?: string;
}

const getBaseUrl = () => {
  return 'https://localhost:7275';
};

const ProductReviews: React.FC<ProductReviewsProps> = ({
                                                         productId,
                                                         onReviewCountChange,
                                                         maxHeight = "800px" // Mặc định 600px
                                                       }) => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [allReviews, setAllReviews] = useState<ReviewResponse[]>([]);
  const [, setStats] = useState<{
    averageRating: number;
    reviewCount: number;
    ratingDistribution: Array<{ rating: number; count: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'highest' | 'lowest'>('latest');
  const [baseUrl, setBaseUrl] = useState('');
  const [replyingTo, setReplyingTo] = useState<{reviewId: number, parentReplyId?: number} | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState<number | null>(null);

  useEffect(() => {
    setBaseUrl(getBaseUrl());
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [productId, activeTab, sortBy, baseUrl]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        const statsResponse = await getProductReviewStats(productId);
        if (statsResponse.success && statsResponse.result) {
          setStats(statsResponse.result.data);

          // 👇 chỉ truyền số lượng review lên cha
          if (onReviewCountChange) {
            onReviewCountChange(statsResponse.result.data.reviewCount);
          }
        }
      } catch (statsError) {
        console.error("Error fetching stats:", statsError);
      }

      const reviewsResponse = await getProductReviews(productId);

      if (reviewsResponse.success && reviewsResponse.result) {
        setAllReviews(reviewsResponse.result.data);

        let filteredReviews = reviewsResponse.result.data;
        if (activeTab === 'approved') {
          filteredReviews = filteredReviews.filter(review => review.isApproved);
        } else if (activeTab === 'pending') {
          filteredReviews = filteredReviews.filter(review => !review.isApproved);
        }

        let sortedReviews = [...filteredReviews];
        switch (sortBy) {
          case "latest":
            sortedReviews.sort(
                (a, b) =>
                    new Date(b.reviewDate).getTime() -
                    new Date(a.reviewDate).getTime()
            );
            break;
          case "highest":
            sortedReviews.sort((a, b) => b.rating - a.rating);
            break;
          case "lowest":
            sortedReviews.sort((a, b) => a.rating - b.rating);
            break;
        }

        setReviews(sortedReviews);

        // 👇 fallback: nếu API stats fail thì vẫn truyền số review từ danh sách
        if (onReviewCountChange) {
          onReviewCountChange(reviewsResponse.result.data.length);
        }
      } else {
        setError(reviewsResponse.error?.message || "Failed to load reviews");

        if (onReviewCountChange) {
          onReviewCountChange(0);
        }
      }
    } catch (err) {
      setError("Failed to load reviews");

      if (onReviewCountChange) {
        onReviewCountChange(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyingTo || !replyText.trim()) return;

    try {
      setReplyLoading(true);
      const replyData: CreateReplyRequest = {
        comment: replyText.trim(),
        parentReplyId: replyingTo.parentReplyId
      };

      const response = await addReply(replyingTo.reviewId, replyData);

      if (response.success) {
        message.success('Reply added successfully!');
        setReplyText('');
        setReplyingTo(null);
        fetchReviews(); // Refresh reviews to show new reply
      } else {
        message.error(response.error?.message || 'Failed to add reply');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      message.error('Failed to add reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    try {
      const response = await deleteReply(replyId);

      if (response.success) {
        message.success('Reply deleted successfully!');
        setDeleteModalVisible(false);
        setReplyToDelete(null);
        fetchReviews(); // Refresh reviews
      } else {
        message.error(response.error?.message || 'Failed to delete reply');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      message.error('Failed to delete reply');
    }
  };

  const showDeleteConfirm = (replyId: number) => {
    setReplyToDelete(replyId);
    setDeleteModalVisible(true);
  };

  const calculateComprehensiveStats = () => {
    if (!reviews.length) return null;

    const approvedReviews = reviews.filter(review => review.isApproved);
    const pendingReviews = reviews.filter(review => !review.isApproved);

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(review => review.rating === rating).length
    }));

    return {
      averageRating,
      reviewCount: reviews.length,
      approvedCount: approvedReviews.length,
      pendingCount: pendingReviews.length,
      ratingDistribution
    };
  };

  const comprehensiveStats = calculateComprehensiveStats();

  if (loading) {
    return (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#666' }}>Loading reviews...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Alert
              type="warning"
              message="Could not load reviews"
              description={error}
              showIcon
              style={{ maxWidth: 500, margin: '0 auto' }}
          />
          <Button
              type="primary"
              style={{ marginTop: 16 }}
              onClick={() => fetchReviews()}
          >
            Retry
          </Button>
        </div>
    );
  }

  return (
      <div style={{
        padding: '16px 0',
        maxHeight: maxHeight,
        overflow: 'auto',
        // Tùy chỉnh scrollbar
        scrollbarWidth: 'thin',
        scrollbarColor: '#c1c1c1 #f1f1f1'
      }}>
        {/* Custom scrollbar styles for webkit browsers */}
        <style>
          {`
          .product-reviews-container::-webkit-scrollbar {
            width: 8px;
          }
          
          .product-reviews-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          
          .product-reviews-container::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
          }
          
          .product-reviews-container::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}
        </style>

        <div className="product-reviews-container">
          {/* Statistics Section - Static position */}
          {comprehensiveStats && (
              <>
                <Card
                    style={{
                      marginBottom: 24,
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      border: 'none',
                      borderRadius: 12,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                    }}
                >
                  <Row gutter={24} align="middle">
                    <Col xs={24} sm={8} style={{ textAlign: 'center', padding: '20px' }}>
                      <Rate
                          disabled
                          value={comprehensiveStats.averageRating}
                          allowHalf
                          style={{ fontSize: '18px', margin: '8px 0' }}
                      />
                      <div style={{ marginTop: 8, color: '#6c757d', fontWeight: 500, fontSize: '14px' }}>
                        {comprehensiveStats.reviewCount} total reviews
                      </div>
                    </Col>

                    <Col xs={24} sm={16}>
                      <div style={{ padding: '16px' }}>
                        <Title level={5} style={{ marginBottom: 16 }}>Rating Distribution</Title>
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const ratingData = comprehensiveStats.ratingDistribution.find(r => r.rating === rating);
                          const count = ratingData?.count || 0;
                          const percentage = comprehensiveStats.reviewCount > 0 ? (count / comprehensiveStats.reviewCount) * 100 : 0;

                          return (
                              <div key={rating} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ width: 60, display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <Text strong style={{ fontSize: '12px' }}>{rating}</Text>
                                  <StarFilled style={{ color: '#faad14', fontSize: '12px' }} />
                                </div>
                                <div style={{ flex: 1, margin: '0 16px' }}>
                                  <Progress
                                      percent={Math.round(percentage)}
                                      showInfo={false}
                                      strokeColor="#52c41a"
                                      size="small"
                                  />
                                </div>
                                <div style={{ width: 70, textAlign: 'right' }}>
                                  <Text strong style={{ fontSize: '12px' }}>{count}</Text>
                                  <Text type="secondary" style={{ marginLeft: 4, fontSize: '11px' }}>
                                    ({percentage.toFixed(1)}%)
                                  </Text>
                                </div>
                              </div>
                          );
                        })}
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* Divider */}
                <div style={{
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, #d9d9d9 20%, #d9d9d9 80%, transparent 100%)',
                  marginBottom: 24,
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    padding: '0 16px',
                    fontSize: '12px',
                    color: '#8c8c8c',
                    fontWeight: 500
                  }}>
                    CUSTOMER REVIEWS
                  </div>
                </div>
              </>
          )}

          {/* Reply Modal */}
          <Modal
              title={replyingTo?.parentReplyId ? "Reply to Comment" : "Add Reply to Review"}
              open={!!replyingTo}
              onOk={handleReplySubmit}
              onCancel={() => {
                setReplyingTo(null);
                setReplyText('');
              }}
              confirmLoading={replyLoading}
              okText="Submit Reply"
              cancelText="Cancel"
          >
            <Form layout="vertical">
              <Form.Item label="Your Reply">
                <TextArea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    maxLength={2000}
                    showCount
                />
              </Form.Item>
            </Form>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
              title="Confirm Delete"
              open={deleteModalVisible}
              onOk={() => replyToDelete && handleDeleteReply(replyToDelete)}
              onCancel={() => {
                setDeleteModalVisible(false);
                setReplyToDelete(null);
              }}
              okText="Delete"
              cancelText="Cancel"
              okType="danger"
          >
            <p>Are you sure you want to delete this reply? This action cannot be undone.</p>
          </Modal>

          {/* Reviews List */}
          {reviews.length === 0 ? (
              <Empty
                  description={
                    <div>
                      <Title level={4} style={{ color: '#bfbfbf' }}>
                        {activeTab === 'approved' ? 'No approved reviews yet' :
                            activeTab === 'pending' ? 'No pending reviews' : 'No reviews yet'}
                      </Title>
                      <Text type="secondary">
                        {activeTab === 'approved' ? 'Approved reviews will appear here once they are approved by admin.' :
                            activeTab === 'pending' ? 'Pending reviews are waiting for admin approval.' :
                                'Be the first to review this product!'}
                      </Text>
                    </div>
                  }
                  style={{
                    padding: '60px 20px',
                    background: '#fafafa',
                    borderRadius: 12,
                    margin: '20px 0'
                  }}
              />
          ) : (
              <List
                  itemLayout="vertical"
                  dataSource={reviews}
                  renderItem={(review) => (
                      <ReviewItem
                          review={review}
                          baseUrl={baseUrl}
                          onReply={(reviewId, parentReplyId) => setReplyingTo({ reviewId, parentReplyId })}
                          onDeleteReply={showDeleteConfirm}
                      />
                  )}
                  pagination={{
                    pageSize: 5, // Giảm về 5 items để phù hợp với scroll chung
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} reviews`,
                    style: {
                      marginTop: 24
                    }
                  }}
              />
          )}
        </div>
      </div>
  );
};
interface ReviewItemProps {
  review: ReviewResponse;
  baseUrl: string;
  onReply: (reviewId: number, parentReplyId?: number) => void;
  onDeleteReply: (replyId: number) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, baseUrl, onReply, onDeleteReply }) => {
  const reviewDate = new Date(review.reviewDate);
  const formattedDate = reviewDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('/')) {
      return `${baseUrl}${imagePath}`;
    }
    return imagePath;
  };

  const renderReplies = (replies: any[], level = 0) => {
    return replies.map((reply) => (
        <div key={reply.id} style={{
          marginLeft: level > 0 ? 30 : 0, // Giảm margin để tiết kiệm không gian
          marginTop: 10,
          padding: 10,
          background: level === 0 ? '#f8f9fa' : '#ffffff',
          border: '1px solid #e8e8e8',
          borderRadius: 6
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
              <Avatar
                  size="small"
                  icon={reply.isAdminReply ? <CrownOutlined /> : <UserOutlined />}
                  style={{
                    background: reply.isAdminReply ? '#ff4d4f' : '#1890ff',
                    fontSize: '10px',
                    flexShrink: 0
                  }}
              />
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Text strong style={{ fontSize: '13px' }}>
                    {reply.user?.fullName || 'Unknown User'}
                  </Text>
                  {reply.isAdminReply && (
                      <Tag color="red" style={{ fontSize: '9px', padding: '0 4px', lineHeight: 'normal' }}>
                        <CrownOutlined style={{ fontSize: '8px' }} /> Admin
                      </Tag>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: 2 }}>
                  <CalendarOutlined style={{ fontSize: '10px' }} /> {new Date(reply.replyDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Reply Actions */}
            <Space size={4}>
              <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined />}
                  onClick={() => onReply(review.id, reply.id)}
                  style={{ fontSize: '11px', height: '24px', padding: '0 6px' }}
              >
                Reply
              </Button>
              <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDeleteReply(reply.id)}
                  style={{ fontSize: '11px', height: '24px', padding: '0 6px' }}
              >
                Delete
              </Button>
            </Space>
          </div>

          {/* Reply Content */}
          <Paragraph style={{
            margin: 0,
            fontSize: '13px',
            lineHeight: 1.4,
            color: '#262626'
          }}>
            {reply.comment}
          </Paragraph>

          {/* Render child replies recursively */}
          {reply.childReplies && reply.childReplies.length > 0 && (
              <div style={{ marginTop: 10 }}>
                {renderReplies(reply.childReplies, level + 1)}
              </div>
          )}
        </div>
    ));
  };

  return (
      <Card
          style={{
            marginBottom: 16,
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            background: review.isApproved ? '#fff' : '#fafafa'
          }}
          bodyStyle={{ padding: 20 }}
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          {/* Avatar */}
          <Avatar
              icon={<UserOutlined />}
              size={48}
              style={{
                background: '#1890ff',
                border: '2px solid #f0f0f0',
                flexShrink: 0
              }}
          />

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 10,
              flexWrap: 'wrap',
              gap: 10
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <Text strong style={{ fontSize: '15px', display: 'block' }}>
                  {review.customer?.fullName || 'Anonymous Customer'}
                </Text>
                {review.customer?.email && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {review.customer.email}
                    </Text>
                )}
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>
                  <CalendarOutlined style={{ marginRight: 4 }} />
                  {formattedDate}
                </Text>
                <Space size={6} style={{ marginTop: 4 }}>
                  {review.isApproved ? (
                      <Tag color="success" style={{ fontSize: '9px', padding: '1px 4px' }}>
                        Approved
                      </Tag>
                  ) : (
                      <Tag color="orange" style={{ fontSize: '9px', padding: '1px 4px' }}>
                        Pending
                      </Tag>
                  )}
                  <Tag color="blue" style={{ fontSize: '9px', padding: '1px 4px' }}>
                    Order #{review.orderId}
                  </Tag>
                </Space>
              </div>
            </div>

            {/* Rating */}
            <div style={{ marginBottom: 12 }}>
              <Rate
                  disabled
                  defaultValue={review.rating}
                  style={{ fontSize: '14px' }}
              />
              <Text strong style={{ marginLeft: 6, color: '#faad14', fontSize: '14px' }}>
                {review.rating}.0
              </Text>
            </div>

            {/* Comment */}
            <Paragraph style={{
              marginBottom: 14,
              lineHeight: 1.5,
              fontSize: '13px',
              color: '#262626'
            }}>
              {review.comment || 'No comment provided.'}
            </Paragraph>

            {/* Review Images */}
            {review.reviewImages && review.reviewImages.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 10, fontSize: '13px' }}>
                    <PictureOutlined style={{ marginRight: 6 }} />
                    Customer Photos ({review.reviewImages.length})
                  </Text>

                  <Image.PreviewGroup>
                    <div style={{
                      display: 'flex',
                      gap: 6,
                      flexWrap: 'wrap',
                      maxHeight: '120px',
                      overflow: 'auto'
                    }}>
                      {review.reviewImages.map((image) => {
                        const fullImageUrl = getImageUrl(image.imageUrl);

                        return (
                            <div key={image.id} style={{ position: 'relative' }}>
                              <Image
                                  src={fullImageUrl}
                                  width={80}
                                  height={80}
                                  style={{
                                    objectFit: 'cover',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    border: '1px solid #f0f0f0'
                                  }}
                                  placeholder={
                                    <div style={{
                                      width: 80,
                                      height: 80,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: '#f5f5f5',
                                      borderRadius: 6
                                    }}>
                                      <PictureOutlined style={{ fontSize: 20, color: '#d9d9d9' }} />
                                    </div>
                                  }
                                  preview={{
                                    mask: (
                                        <div style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          height: '100%',
                                          background: 'rgba(0,0,0,0.4)',
                                          color: 'white',
                                          borderRadius: 6,
                                          fontSize: '10px'
                                        }}>
                                          <EyeOutlined /> View
                                        </div>
                                    )
                                  }}
                              />
                            </div>
                        );
                      })}
                    </div>
                  </Image.PreviewGroup>
                </div>
            )}

            {/* Reply Section */}
            <div style={{ marginTop: 16 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10
              }}>
                <Text strong style={{ fontSize: '13px' }}>
                  <MessageOutlined style={{ marginRight: 6 }} />
                  Replies ({review.reviewReplies.length})
                </Text>
                <Button
                    type="primary"
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={() => onReply(review.id)}
                    style={{ height: '28px', fontSize: '12px' }}
                >
                  Add Reply
                </Button>
              </div>

              {/* Replies List */}
              <div>
                {review.reviewReplies.length > 0 ? (
                    <div>
                      {renderReplies(review.reviewReplies)}
                    </div>
                ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '16px',
                      background: '#fafafa',
                      borderRadius: 6,
                      border: '1px dashed #d9d9d9'
                    }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        No replies yet. Be the first to reply!
                      </Text>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
  );
};

export default ProductReviews;