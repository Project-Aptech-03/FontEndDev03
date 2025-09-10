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

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  views: number;
  tags: string[];
  likes: number;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  rating: number;
  avatar: string;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [form] = Form.useForm();

  // Mock blog data - trong thực tế sẽ fetch từ API
  const mockBlogData: BlogPost[] = [
    {
      id: 1,
      title: "The Future of Reading: Digital Books vs Traditional Books",
      excerpt: "Explore the evolving landscape of reading habits and discover whether digital books or traditional paperbacks offer the best reading experience.",
      content: `
        <h2>Introduction</h2>
        <p>In today's rapidly evolving digital landscape, the way we consume literature has undergone a dramatic transformation. The debate between digital books and traditional paperbacks has become more relevant than ever, as readers worldwide grapple with choosing between the convenience of e-readers and the tactile experience of physical books.</p>
        
        <h2>The Rise of Digital Reading</h2>
        <p>Digital books have revolutionized the reading experience in numerous ways. With e-readers like Kindle, Kobo, and tablet devices, readers can carry thousands of books in a single device. This convenience factor cannot be overstated - imagine having access to your entire library while traveling, without the weight and space constraints of physical books.</p>
        
        <p>Furthermore, digital books offer features that traditional books simply cannot match:</p>
        <ul>
          <li>Adjustable font sizes for better readability</li>
          <li>Built-in dictionaries for instant word definitions</li>
          <li>Search functionality to quickly find specific passages</li>
          <li>Highlighting and note-taking capabilities that sync across devices</li>
          <li>Instant access to new releases and a vast selection of titles</li>
        </ul>
        
        <h2>The Enduring Appeal of Traditional Books</h2>
        <p>Despite the digital revolution, traditional books continue to hold a special place in readers' hearts. There's something irreplaceable about the sensory experience of reading a physical book - the smell of paper, the weight of the book in your hands, and the satisfying feeling of turning pages.</p>
        
        <p>Research has shown that many readers retain information better when reading from physical books compared to digital screens. This might be due to the spatial memory associated with the physical location of text on a page, which helps in comprehension and recall.</p>
        
        <h2>Environmental Considerations</h2>
        <p>The environmental impact of our reading choices is another crucial factor to consider. While e-readers require energy to manufacture and electricity to operate, a single device can replace hundreds of physical books over its lifetime. Traditional books, on the other hand, require paper, ink, and transportation, but they don't require ongoing energy consumption.</p>
        
        <h2>The Future of Reading</h2>
        <p>As we look toward the future, it's becoming clear that the choice between digital and traditional books isn't necessarily an either-or decision. Many avid readers find themselves using both formats depending on the situation - digital for travel and convenience, physical for deep reading and collection purposes.</p>
        
        <p>The publishing industry continues to innovate, with enhanced e-books featuring interactive elements, audio integration, and multimedia content. Meanwhile, traditional books are seeing a resurgence in artisanal and collectible editions, emphasizing the book as both content and physical object.</p>
        
        <h2>Conclusion</h2>
        <p>Ultimately, the future of reading lies not in the dominance of one format over another, but in the coexistence and complementary nature of both digital and traditional books. Each format offers unique advantages, and the best reading experience often comes from embracing both according to your needs, preferences, and circumstances.</p>
        
        <p>Whether you're team digital, team traditional, or happily somewhere in between, what matters most is that we continue to read, learn, and grow through the incredible power of books in all their forms.</p>
      `,
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
      readTime: "8 min read",
      views: 1247,
      tags: ["Digital Books", "Reading", "Technology", "E-readers", "Literature"],
      likes: 89,
    },
    // Thêm các blog khác nếu cần...
  ];

  const mockComments: Comment[] = [
    {
      id: 1,
      author: "Alex Wilson",
      content: "Great article! I've been using both formats for years and completely agree with your balanced perspective. Digital for travel, physical for home reading.",
      date: "2024-01-16",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex Wilson",
    },
    {
      id: 2,
      author: "Maria Garcia",
      content: "I was skeptical about e-readers at first, but after trying one, I'm converted! The convenience factor is just incredible, especially for someone who reads 50+ books a year.",
      date: "2024-01-17",
      rating: 4,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria Garcia",
    },
    {
      id: 3,
      author: "David Chen",
      content: "Nothing beats the feel of a real book in your hands. While I appreciate the convenience of digital, I'll always prefer physical books for the experience.",
      date: "2024-01-18",
      rating: 4,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David Chen",
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch blog data
    const foundBlog = mockBlogData.find(b => b.id === parseInt(id || "1"));
    if (foundBlog) {
      setBlog(foundBlog);
      setComments(mockComments);
    } else {
      navigate("/blog");
    }
  }, [id, navigate]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (blog) {
      setBlog({
        ...blog,
        likes: isLiked ? blog.likes - 1 : blog.likes + 1,
      });
    }
  };

  const handleCommentSubmit = (values: any) => {
    const newCommentData: Comment = {
      id: comments.length + 1,
      author: values.author || "Anonymous",
      content: values.comment,
      date: new Date().toISOString().split('T')[0],
      rating: rating || 5,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.author || "Anonymous"}`,
    };
    
    setComments([newCommentData, ...comments]);
    form.resetFields();
    setRating(0);
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

  if (!blog) {
    return <div>Loading...</div>;
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
            <img src={blog.image} alt={blog.title} />
            <div className="blog-hero-overlay">
              <div className="blog-hero-content">
                <Tag color="blue" className="hero-category">{blog.category}</Tag>
                <Title level={1} className="hero-title">{blog.title}</Title>
                <Paragraph className="hero-excerpt">{blog.excerpt}</Paragraph>
                
                <div className="hero-meta">
                  <Space size="large">
                    <Space>
                      <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`} />
                      <span>{blog.author}</span>
                    </Space>
                    <Space>
                      <CalendarOutlined />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </Space>
                    <Space>
                      <ClockCircleOutlined />
                      <span>{blog.readTime}</span>
                    </Space>
                    <Space>
                      <EyeOutlined />
                      <span>{blog.views} views</span>
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
                  type={isLiked ? "primary" : "default"}
                  icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                  onClick={handleLike}
                  className="like-button"
                >
                  {blog.likes}
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
              <Text strong style={{ marginRight: 16 }}>Tags:</Text>
              {blog.tags.map(tag => (
                <Tag key={tag} className="article-tag">{tag}</Tag>
              ))}
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="comments-section" title={
            <Space>
              <MessageOutlined />
              <span>Comments ({comments.length})</span>
            </Space>
          }>
            {/* Add Comment Form */}
            <div className="add-comment">
              <Title level={4}>Leave a Comment</Title>
              <Form form={form} onFinish={handleCommentSubmit} layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      name="author" 
                      label="Name"
                      rules={[{ required: true, message: "Please enter your name" }]}
                    >
                      <Input placeholder="Your name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Rating">
                      <Rate value={rating} onChange={setRating} />
                    </Form.Item>
                  </Col>
                </Row>
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
                  <Button type="primary" htmlType="submit" size="large">
                    Post Comment
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <Divider />

            {/* Comments List */}
            <div className="comments-list">
              {comments.map(comment => (
                <CustomComment
                  key={comment.id}
                  author={comment.author}
                  avatar={comment.avatar}
                  content={
                    <div>
                      <Paragraph style={{ marginBottom: 8 }}>{comment.content}</Paragraph>
                      <Rate disabled value={comment.rating} style={{ fontSize: 14 }} />
                    </div>
                  }
                  datetime={
                    <Space>
                      <CalendarOutlined />
                      <span>{new Date(comment.date).toLocaleDateString()}</span>
                    </Space>
                  }
                  className="comment-item"
                />
              ))}
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
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`} 
                  />
                  <div className="author-details">
                    <Title level={4}>{blog.author}</Title>
                    <Paragraph>
                      Passionate writer and book enthusiast with over 10 years of experience 
                      in literary analysis and book reviews.
                    </Paragraph>
                    <Button type="primary" block>Follow Author</Button>
                  </div>
                </div>
              </Card>

              {/* Related Articles */}
              <Card title="Related Articles" className="related-articles">
                {mockBlogData.slice(0, 3).map(relatedBlog => (
                  <div 
                    key={relatedBlog.id} 
                    className="related-article"
                    onClick={() => navigate(`/blog/${relatedBlog.id}`)}
                  >
                    <img src={relatedBlog.image} alt={relatedBlog.title} />
                    <div className="related-content">
                      <Text strong className="related-title">{relatedBlog.title}</Text>
                      <Text type="secondary" className="related-date">
                        {new Date(relatedBlog.date).toLocaleDateString()}
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
    </div>
  );
};

export default BlogDetail;
