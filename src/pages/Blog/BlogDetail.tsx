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
  const [followStatusChecked, setFollowStatusChecked] = useState(false);
  const [commentValidation, setCommentValidation] = useState<{
    isValid: boolean;
    warnings: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    toxicityScore: number;
  } | null>(null);
  const [isValidatingComment, setIsValidatingComment] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Check if user is following the author
  const checkFollowStatus = async () => {
    if (!blog?.authorId || followStatusChecked) return;
    
    try {
      // Try to get the follow status by checking if the user is in the author's followers
      const followers = await blogApi.getAuthorFollowers(blog.authorId, 1, 100);
      // This is a simplified check - in a real implementation, you'd need a specific endpoint
      // to check if the current user is following a specific author
      setFollowStatusChecked(true);
    } catch (error) {
      console.log('Could not check follow status:', error);
      setFollowStatusChecked(true);
    }
  };

  // Check follow status when blog loads
  useEffect(() => {
    if (blog?.authorId && !followStatusChecked) {
      checkFollowStatus();
    }
  }, [blog?.authorId, followStatusChecked]);

  // AI Content Moderation - Simulate AI analysis
  const validateCommentWithAI = async (content: string) => {
    setIsValidatingComment(true);
    
    try {
      // Simulate AI API call for content moderation
      const response = await new Promise<{
        isValid: boolean;
        warnings: string[];
        sentiment: 'positive' | 'negative' | 'neutral';
        toxicityScore: number;
      }>((resolve) => {
        setTimeout(() => {
          // Simple AI-like validation rules
          const warnings: string[] = [];
          let toxicityScore = 0;
          let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
          
          // Check for spam patterns
          if (content.length < 10) {
            warnings.push('Comment is too short. Please provide more meaningful feedback.');
          }
          
          // Check for repeated characters (spam detection)
          if (/(.)\1{4,}/.test(content)) {
            warnings.push('Please avoid repetitive characters.');
            toxicityScore += 0.3;
          }
          
          // Check for excessive caps
          const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
          if (capsRatio > 0.7 && content.length > 20) {
            warnings.push('Please avoid excessive capitalization.');
            toxicityScore += 0.2;
          }
          
          // Check for toxic keywords (simplified)
          const toxicWords = ['hate', 'stupid', 'idiot', 'dumb', 'ugly', 'kill', 'die'];
          const foundToxicWords = toxicWords.filter(word => 
            content.toLowerCase().includes(word)
          );
          
          if (foundToxicWords.length > 0) {
            warnings.push('Please use respectful language.');
            toxicityScore += 0.5;
          }
          
          // Sentiment analysis (simplified)
          const positiveWords = ['good', 'great', 'awesome', 'amazing', 'love', 'like', 'excellent', 'wonderful'];
          const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'horrible', 'worst'];
          
          const positiveCount = positiveWords.filter(word => 
            content.toLowerCase().includes(word)
          ).length;
          const negativeCount = negativeWords.filter(word => 
            content.toLowerCase().includes(word)
          ).length;
          
          if (positiveCount > negativeCount) {
            sentiment = 'positive';
          } else if (negativeCount > positiveCount) {
            sentiment = 'negative';
          }
          
          // Check for URL spam
          if ((content.match(/https?:\/\/[^\s]+/g) || []).length > 2) {
            warnings.push('Please avoid excessive links.');
            toxicityScore += 0.4;
          }
          
          const isValid = warnings.length === 0 && toxicityScore < 0.7;
          
          resolve({
            isValid,
            warnings,
            sentiment,
            toxicityScore: Math.min(toxicityScore, 1)
          });
        }, 1000); // Simulate API delay
      });
      
      setCommentValidation(response);
      return response;
    } catch (error) {
      console.error('AI validation error:', error);
      message.error('Failed to validate comment. Please try again.');
      return null;
    } finally {
      setIsValidatingComment(false);
    }
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

  // Handle comment submit with AI validation and retry mechanism
  const handleCommentSubmit = async (values: any, retryAttempt = 0) => {
    const maxRetries = 3;
    
    try {
      // First validate with AI
      const validation = await validateCommentWithAI(values.comment);
      
      if (!validation) {
        message.error('Failed to validate comment. Please try again.');
        return;
      }
      
      if (!validation.isValid) {
        message.warning('Please review the following issues:');
        validation.warnings.forEach(warning => {
          message.warning(warning);
        });
        return;
      }
      
      // If validation passes, submit comment
      const result = await createComment({
        content: values.comment,
        parentCommentId: undefined
      });
      
      if (result) {
        form.resetFields();
        setCommentValidation(null);
        setRetryCount(0);
        message.success('Comment posted successfully!');
      } else {
        throw new Error('Comment creation failed');
      }
    } catch (error) {
      console.error('Comment submission error:', error);
      
      if (retryAttempt < maxRetries) {
        setIsRetrying(true);
        setRetryCount(retryAttempt + 1);
        
        message.warning(`Attempt ${retryAttempt + 1} failed. Retrying...`);
        
        // Exponential backoff: wait longer between retries
        const delay = Math.pow(2, retryAttempt) * 1000;
        setTimeout(async () => {
          await handleCommentSubmit(values, retryAttempt + 1);
          setIsRetrying(false);
        }, delay);
      } else {
        message.error(`Failed to post comment after ${maxRetries} attempts. Please try again later.`);
        setRetryCount(0);
        setIsRetrying(false);
      }
    }
  };

  // Handle author follow
  const handleFollowAuthor = async () => {
    if (!blog) return;
    
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
      
      {/* Blog Content Wrapper - Target for Affix */}
      <div className="blog-content-wrapper" id="blog-content-wrapper">
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
                    onChange={async (e) => {
                      const content = e.target.value;
                      if (content.length > 20) {
                        // Debounce AI validation
                        setTimeout(async () => {
                          await validateCommentWithAI(content);
                        }, 1000);
                      } else {
                        setCommentValidation(null);
                      }
                    }}
                  />
                </Form.Item>
                
                {/* AI Validation Results */}
                {commentValidation && (
                  <div className="ai-validation-results" style={{ marginBottom: 16 }}>
                    <Alert
                      message={
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span>AI Analysis:</span>
                            <Tag color={commentValidation.isValid ? 'green' : 'red'}>
                              {commentValidation.isValid ? 'Valid' : 'Issues Found'}
                            </Tag>
                            <Tag color={
                              commentValidation.sentiment === 'positive' ? 'green' : 
                              commentValidation.sentiment === 'negative' ? 'red' : 'blue'
                            }>
                              {commentValidation.sentiment} sentiment
                            </Tag>
                            <Tag color={commentValidation.toxicityScore > 0.5 ? 'red' : 'green'}>
                              Toxicity: {Math.round(commentValidation.toxicityScore * 100)}%
                            </Tag>
                          </div>
                          {commentValidation.warnings.length > 0 && (
                            <div>
                              <Text strong>Warnings:</Text>
                              <ul style={{ margin: '4px 0 0 20px' }}>
                                {commentValidation.warnings.map((warning, index) => (
                                  <li key={index} style={{ color: '#ff4d4f' }}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      }
                      type={commentValidation.isValid ? 'success' : 'warning'}
                      showIcon
                    />
                  </div>
                )}
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    loading={commentsLoading || isValidatingComment || isRetrying}
                    disabled={commentValidation ? !commentValidation.isValid : false}
                  >
                    {isValidatingComment ? 'Validating...' : 
                     isRetrying ? `Retrying... (${retryCount}/${3})` : 
                     'Post Comment'}
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
          <Affix offsetTop={20} target={() => document.getElementById('blog-content-wrapper')}>
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
                      loading={followLoading}
                      onClick={handleFollowAuthor}
                      disabled={!followStatusChecked}
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
            </div>
          </Affix>
        </Col>
      </Row>
      </div>
    </div>
  );
};

export default BlogDetail;
