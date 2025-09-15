import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Avatar,
  Divider,
  Space,
  Typography,
  Form,
  Input,
  Rate,
  BackTop,
  Affix,
  List,
  Spin,
  Alert,
  message
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  LeftOutlined,
  FacebookFilled,
  TwitterOutlined,
  LinkedinFilled,
  MessageOutlined,
} from "@ant-design/icons";
import { useBlog, useBlogComments, useBlogLikes, useAuthorFollows, useRecentBlogs } from "../../hooks/useBlogs";
import { blogApi } from "../../api/blog.api";
import { BlogResponseDto, CommentResponseDto } from "../../@type/blog";
import "./BlogDetail.css";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

// Custom Comment Component để thay thế Antd Comment
const CustomComment: React.FC<{
  author: string;
  avatar: string;
  content: React.ReactNode;
  datetime: React.ReactNode;
  className?: string;
}> = ({ author, avatar, content, datetime, className }) => {
  return (
    <div className={`custom-comment ${className || ''}`}>
      <div className="comment-inner">
        <div className="comment-avatar">
          <Avatar src={avatar} size={40} />
        </div>
        <div className="comment-content">
          <div className="comment-author">{author}</div>
          <div className="comment-datetime">{datetime}</div>
          <div className="comment-text">{content}</div>
        </div>
      </div>
    </div>
  );
};

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // API hooks
  const { blog, loading: blogLoading, error: blogError, refetch: refetchBlog } = useBlog(Number(id));
  const { 
    comments, 
    loading: commentsLoading, 
    error: commentsError,
    createComment,
    likeComment,
    unlikeComment
  } = useBlogComments(Number(id));
  const { likeBlog, unlikeBlog } = useBlogLikes();
  const { followAuthor, unfollowAuthor, loading: followLoading, error: followError } = useAuthorFollows();
  const { blogs: recentBlogs } = useRecentBlogs(3);

  // Local state
  const [isFollowing, setIsFollowing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Handle blog like
  const handleLike = async () => {
    if (!blog) return;
    
    if (blog.isLikedByCurrentUser) {
      await unlikeBlog(blog.id);
    } else {
      await likeBlog(blog.id);
    }
    // Refresh blog data to update like count
    refetchBlog();
  };

  // Handle comment like
  const handleCommentLike = async (commentId: number, isLiked: boolean) => {
    if (isLiked) {
      await unlikeComment(commentId);
    } else {
      await likeComment(commentId);
    }
  };

  // Handle comment submit
  const handleCommentSubmit = async (values: any) => {
    const result = await createComment({
      content: values.comment,
      parentCommentId: undefined
    });
    
    if (result) {
      form.resetFields();
      message.success('Comment posted successfully!');
    }
  };

  // Handle author follow
  const handleFollowAuthor = async () => {
    if (!blog) return;
    
    // Check if user is authenticated
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.warning('Vui lòng đăng nhập để theo dõi tác giả');
      navigate('/login');
      return;
    }
    
    // Test endpoint first (for debugging)
    console.log('Testing follow endpoint...');
    try {
      const testResult = await blogApi.testFollowEndpoint(blog.authorId);
      console.log('Testing generic follow approach...');
      const genericResult = await blogApi.tryGenericFollow(blog.authorId);
      
      setDebugInfo({
        authorId: blog.authorId,
        testResult: testResult,
        genericResult: genericResult,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.log('Endpoint test failed:', error);
      setDebugInfo({
        authorId: blog.authorId,
        testError: error,
        timestamp: new Date().toISOString()
      });
    }
    
    try {
      let success = false;
      if (isFollowing) {
        success = await unfollowAuthor(blog.authorId);
      } else {
        success = await followAuthor(blog.authorId);
      }
      
      if (success) {
        setIsFollowing(!isFollowing);
        message.success(isFollowing ? 'Đã bỏ theo dõi tác giả' : 'Đã theo dõi tác giả');
      } else {
        message.error(followError || 'Có lỗi xảy ra khi thực hiện thao tác');
      }
    } catch (error) {
      console.error('Follow author error:', error);
      message.error('Có lỗi xảy ra khi thực hiện thao tác');
    }
  };

  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || "";
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (blogLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (blogError) {
    return (
      <Alert
        message="Error loading blog"
        description={blogError}
        type="error"
        showIcon
        style={{ margin: '20px' }}
      />
    );
  }

  if (!blog) {
    return (
      <Alert
        message="Blog not found"
        description="The blog you're looking for doesn't exist."
        type="warning"
        showIcon
        style={{ margin: '20px' }}
      />
    );
  }

  return (
    <div className="blog-detail-container">
      <BackTop />
      
      {/* Header */}
      <div className="blog-detail-header">
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={() => navigate("/blog")}
          className="back-button"
        >
          Back to Blog
        </Button>
        
        <div className="blog-hero">
          <div className="blog-hero-image">
            <img 
              src={blog.featuredImageUrl || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop"} 
              alt={blog.title} 
            />
            <div className="blog-hero-overlay">
              <div className="blog-hero-content">
                <Tag color="blue" className="hero-category">{blog.categoryName}</Tag>
                <Title level={1} className="hero-title">{blog.title}</Title>
                <Paragraph className="hero-excerpt">{blog.summary}</Paragraph>
                
                <div className="hero-meta">
                  <Space size="large">
                    <Space>
                      <Avatar src={blog.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorName}`} />
                      <span>{blog.authorName}</span>
                    </Space>
                    <Space>
                      <CalendarOutlined />
                      <span>{new Date(blog.publishedDate || blog.createdDate).toLocaleDateString()}</span>
                    </Space>
                    <Space>
                      <ClockCircleOutlined />
                      <span>{calculateReadingTime(blog.content)} min read</span>
                    </Space>
                    <Space>
                      <EyeOutlined />
                      <span>{blog.viewCount} views</span>
                    </Space>
                  </Space>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Row gutter={[32, 32]} className="blog-detail-content">
        {/* Main Content */}
        <Col xs={24} lg={16}>
          <Card className="blog-content-card">
            {/* Article Actions */}
            <div className="article-actions">
              <Space size="large">
                <Button
                  type={blog.isLikedByCurrentUser ? "primary" : "default"}
                  icon={blog.isLikedByCurrentUser ? <HeartFilled /> : <HeartOutlined />}
                  onClick={handleLike}
                  className="like-button"
                >
                  {blog.likeCount}
                </Button>
                
                <Button icon={<ShareAltOutlined />} className="share-button">
                  Share
                </Button>
                
                <div className="social-share">
                  <Button 
                    type="text" 
                    icon={<FacebookFilled />} 
                    onClick={() => shareOnSocial("facebook")}
                    className="social-btn facebook"
                  />
                  <Button 
                    type="text" 
                    icon={<TwitterOutlined />} 
                    onClick={() => shareOnSocial("twitter")}
                    className="social-btn twitter"
                  />
                  <Button 
                    type="text" 
                    icon={<LinkedinFilled />} 
                    onClick={() => shareOnSocial("linkedin")}
                    className="social-btn linkedin"
                  />
                </div>
              </Space>
            </div>

            {/* Article Content */}
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            <Divider />
            <div className="article-tags">
              <Text strong style={{ marginRight: 16 }}>Category:</Text>
              <Tag className="article-tag">{blog.categoryName}</Tag>
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="comments-section" title={
            <Space>
              <MessageOutlined />
              <span>Comments ({comments.length})</span>
            </Space>
          }>
            {commentsError && (
              <Alert
                message="Error loading comments"
                description={commentsError}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            
            {/* Add Comment Form */}
            <div className="add-comment">
              <Title level={4}>Leave a Comment</Title>
              <Form form={form} onFinish={handleCommentSubmit} layout="vertical">
                <Form.Item 
                  name="comment" 
                  label="Comment"
                  rules={[{ required: true, message: "Please enter your comment" }]}
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Share your thoughts about this article..."
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" loading={commentsLoading}>
                    Post Comment
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <Divider />

            {/* Comments List */}
            <div className="comments-list">
              {commentsLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Spin />
                </div>
              ) : (
                comments.map(comment => (
                  <CustomComment
                    key={comment.id}
                    author={comment.userName}
                    avatar={comment.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userName}`}
                    content={
                      <div>
                        <Paragraph style={{ marginBottom: 8 }}>{comment.content}</Paragraph>
                        <div className="comment-actions">
                          <Button
                            type={comment.isLikedByCurrentUser ? "primary" : "default"}
                            icon={comment.isLikedByCurrentUser ? <HeartFilled /> : <HeartOutlined />}
                            onClick={() => handleCommentLike(comment.id, comment.isLikedByCurrentUser)}
                            size="small"
                          >
                            {comment.likeCount}
                          </Button>
                        </div>
                      </div>
                    }
                    datetime={
                      <Space>
                        <CalendarOutlined />
                        <span>{new Date(comment.createdDate).toLocaleDateString()}</span>
                      </Space>
                    }
                    className="comment-item"
                  />
                ))
              )}
            </div>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Affix offsetTop={20}>
            <div className="blog-sidebar">
              {/* Author Info */}
              <Card className="author-card">
                <div className="author-info">
                  <Avatar 
                    size={80} 
                    src={blog.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorName}`} 
                  />
                  <div className="author-details">
                    <Title level={4}>{blog.authorName}</Title>
                    <Paragraph>
                      Passionate writer and book enthusiast with over 10 years of experience 
                      in literary analysis and book reviews.
                    </Paragraph>
                    <Button 
                      type={isFollowing ? "default" : "primary"} 
                      block
                      onClick={handleFollowAuthor}
                    >
                      {isFollowing ? "Following" : "Follow Author"}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Related Articles */}
              <Card title="Related Articles" className="related-articles">
                {recentBlogs.slice(0, 3).map(relatedBlog => (
                  <div 
                    key={relatedBlog.id} 
                    className="related-article"
                    onClick={() => navigate(`/blog/${relatedBlog.id}`)}
                  >
                    <img 
                      src={relatedBlog.featuredImageUrl || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop"} 
                      alt={relatedBlog.title} 
                    />
                    <div className="related-content">
                      <Text strong className="related-title">{relatedBlog.title}</Text>
                      <Text type="secondary" className="related-date">
                        {new Date(relatedBlog.publishedDate || relatedBlog.createdDate).toLocaleDateString()}
                      </Text>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Newsletter */}
              <Card className="newsletter-sidebar">
                <Title level={4}>Stay Updated</Title>
                <Paragraph>
                  Subscribe to our newsletter for the latest book reviews and literary insights.
                </Paragraph>
                <Input.Group compact>
                  <Input
                    placeholder="Enter your email"
                    style={{ width: 'calc(100% - 80px)' }}
                  />
                  <Button type="primary">Subscribe</Button>
                </Input.Group>
              </Card>
            </div>
          </Affix>
        </Col>
      </Row>
      
      {/* Debug Panel - Remove in production */}
      {debugInfo && (
        <Card 
          title="Debug Information" 
          style={{ marginTop: '20px', backgroundColor: '#f5f5f5' }}
          size="small"
        >
          <pre style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          <Button 
            size="small" 
            onClick={() => setDebugInfo(null)}
            style={{ marginTop: '10px' }}
          >
            Clear Debug Info
          </Button>
        </Card>
      )}
    </div>
  );
};

export default BlogDetail;
