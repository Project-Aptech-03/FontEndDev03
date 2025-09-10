import React, { useState } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Tag, 
  Input, 
  Select, 
  Button, 
  Avatar, 
  Divider, 
  Modal, 
  Form, 
  Upload, 
  message,
  DatePicker,
  Tabs,
  Image,
  Space,
  Typography,
  Switch,
  Tooltip,
  Rate
} from "antd";
import { 
  SearchOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  EyeOutlined, 
  PlusOutlined, 
  UploadOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PictureOutlined,
  CopyOutlined,
  CheckOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./BlogPage.css";

const { Search, TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

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
}

const Blog: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isWriteModalVisible, setIsWriteModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Mock blog data - chuyển thành state để có thể thêm blog mới
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "The Future of Reading: Digital Books vs Traditional Books",
      excerpt: "Explore the evolving landscape of reading habits and discover whether digital books or traditional paperbacks offer the best reading experience.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      readTime: "5 min read",
      views: 1247,
      tags: ["Digital Books", "Reading", "Technology"]
    },
    {
      id: 2,
      title: "Must-Read Books for 2024: Our Top Recommendations",
      excerpt: "Discover the most compelling books across fiction, non-fiction, and self-help genres that should be on your reading list this year.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      author: "Michael Chen",
      date: "2024-01-12",
      category: "Literature",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop",
      readTime: "8 min read",
      views: 892,
      tags: ["Book Reviews", "Recommendations", "2024"]
    },
    {
      id: 3,
      title: "Building Your Personal Library: A Complete Guide",
      excerpt: "Learn how to curate and organize your personal book collection, from choosing the right books to creating the perfect reading space.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      author: "Emily Rodriguez",
      date: "2024-01-10",
      category: "Lifestyle",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      readTime: "6 min read",
      views: 1563,
      tags: ["Library", "Organization", "Lifestyle"]
    },
    {
      id: 4,
      title: "The Art of Book Collecting: Tips for Beginners",
      excerpt: "Start your journey as a book collector with expert advice on finding rare editions, preserving books, and building a valuable collection.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      author: "David Kim",
      date: "2024-01-08",
      category: "Collecting",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=250&fit=crop",
      readTime: "7 min read",
      views: 1034,
      tags: ["Book Collecting", "Rare Books", "Preservation"]
    },
    {
      id: 5,
      title: "Children's Books That Inspire: Educational Reading for Kids",
      excerpt: "Discover the best children's books that combine entertainment with education, helping young minds grow and develop through reading.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      author: "Lisa Wang",
      date: "2024-01-05",
      category: "Children",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=250&fit=crop",
      readTime: "4 min read",
      views: 756,
      tags: ["Children's Books", "Education", "Reading"]
    },
    {
      id: 6,
      title: "Classic Literature: Timeless Books That Shaped History",
      excerpt: "Journey through the greatest works of literature that have stood the test of time and continue to influence readers across generations.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
      author: "Alex Thompson",
      date: "2024-01-03",
      category: "Literature",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      readTime: "9 min read",
      views: 2341,
      tags: ["Classics", "Literature", "History"]
    }
  ]);

  // Handle create new blog
  const handleCreateBlog = (values: any) => {
    const newBlog: BlogPost = {
      id: Math.max(...blogPosts.map(b => b.id)) + 1,
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      author: values.author || "Anonymous",
      date: new Date().toISOString().split('T')[0],
      category: values.category,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      readTime: calculateReadTime(values.content),
      views: 0,
      tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : []
    };

    setBlogPosts([newBlog, ...blogPosts]);
    setIsWriteModalVisible(false);
    form.resetFields();
    message.success('Blog created successfully!');
  };

  // Calculate reading time based on content length
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Handle write blog button
  const handleWriteBlog = () => {
    setIsWriteModalVisible(true);
    setActiveTab("edit");
    setPreviewImage("");
    setHasChanges(false);
    setLastSaved(null);
    setPreviewData({
      title: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      tags: "",
      featuredImage: "",
    });
  };

  // Monitor form changes
  const handleFormChange = () => {
    setHasChanges(true);
    updatePreviewData();
  };

  // Update preview data từ form values
  const updatePreviewData = () => {
    const values = form.getFieldsValue();
    setPreviewData({
      ...values,
      featuredImage: previewImage || values.featuredImage,
    });
  };

  // Handle image upload
  const handleImageUpload = (info: any) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    
    if (info.file.status === "done") {
      setUploading(false);
      const imageUrl = URL.createObjectURL(info.file.originFileObj);
      setPreviewImage(imageUrl);
      form.setFieldsValue({ featuredImage: imageUrl });
      message.success("Image uploaded successfully!");
    }
    
    if (info.file.status === "error") {
      setUploading(false);
      message.error("Image upload failed!");
    }
  };

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Generate excerpt from content
  const generateExcerpt = (content: string, maxLength = 150) => {
    if (!content) return "";
    return content.length > maxLength 
      ? content.substring(0, maxLength) + "..." 
      : content;
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    const values = form.getFieldsValue();
    values.status = "draft";
    await handleCreateBlog(values);
  };

  // Handle publish
  const handlePublish = async () => {
    const values = form.getFieldsValue();
    values.status = "published";
    await handleCreateBlog(values);
  };

  const categories = ["all", "Technology", "Literature", "Lifestyle", "Collecting", "Children"];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchText.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts[0];

  return (
    <div className="blog-container">
      {/* Header Section */}
      <div className="blog-header">
        <div className="blog-header-content">
          <div className="header-main">
            <div className="header-text">
              <h1 className="blog-title">Book Blog</h1>
              <p className="blog-subtitle">
                Discover the world of books through reviews, recommendations, and reading insights
              </p>
            </div>
            <div className="header-actions">
              <Button 
                type="primary" 
                size="large" 
                icon={<EditOutlined />}
                onClick={handleWriteBlog}
                className="write-blog-btn"
              >
                Write Blog
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search articles..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Select category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              size="large"
              style={{ width: "100%" }}
            >
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div className="filter-stats">
              <span>{filteredPosts.length} articles found</span>
            </div>
          </Col>
        </Row>
      </div>

      {/* Featured Article */}
      {filteredPosts.length > 0 && (
        <div className="featured-article">
          <Card className="featured-card">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <div className="featured-image">
                  <img src={featuredPost.image} alt={featuredPost.title} />
                  <div className="featured-badge">Featured</div>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="featured-content">
                  <div className="featured-meta">
                    <Tag color="blue">{featuredPost.category}</Tag>
                    <span className="featured-date">
                      <CalendarOutlined /> {new Date(featuredPost.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="featured-title">{featuredPost.title}</h2>
                  <p className="featured-excerpt">{featuredPost.excerpt}</p>
                  <div className="featured-author">
                    <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${featuredPost.author}`} />
                    <span>{featuredPost.author}</span>
                    <span className="read-time">{featuredPost.readTime}</span>
                  </div>
                  <Button 
                    type="primary" 
                    size="large" 
                    className="read-more-btn"
                    onClick={() => navigate(`/blog/${featuredPost.id}`)}
                  >
                    Read Full Article
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      )}

      {/* Articles Grid */}
      <div className="articles-section">
        <h2 className="section-title">Latest Book Reviews & Articles</h2>
        <Row gutter={[24, 24]}>
          {filteredPosts.slice(1).map(post => (
            <Col xs={24} sm={12} lg={8} key={post.id}>
              <Card
                hoverable
                className="article-card"
                cover={
                  <div 
                    className="article-image"
                    onClick={() => navigate(`/blog/${post.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={post.image} alt={post.title} />
                    <div className="article-overlay">
                      <Button type="primary" ghost>
                        Read More
                      </Button>
                    </div>
                  </div>
                }
              >
                <div className="article-meta">
                  <Tag color="blue">{post.category}</Tag>
                  <span className="article-date">
                    <CalendarOutlined /> {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 
                  className="article-title"
                  onClick={() => navigate(`/blog/${post.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {post.title}
                </h3>
                <p className="article-excerpt">{post.excerpt}</p>
                <div className="article-footer">
                  <div className="article-author">
                    <Avatar size="small" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
                    <span>{post.author}</span>
                  </div>
                  <div className="article-stats">
                    <span><EyeOutlined /> {post.views}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="article-tags">
                  {post.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <Card className="newsletter-card">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={16}>
              <h3>Stay Updated with Book News</h3>
              <p>Subscribe to our newsletter for the latest book reviews, reading recommendations, and literary insights delivered to your inbox.</p>
            </Col>
            <Col xs={24} md={8}>
              <div className="newsletter-form">
                <Input.Group compact>
                  <Input
                    placeholder="Enter your email"
                    size="large"
                    style={{ width: 'calc(100% - 100px)' }}
                  />
                  <Button type="primary" size="large">
                    Subscribe
                  </Button>
                </Input.Group>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Enhanced Write Blog Modal */}
      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>
              <FileTextOutlined style={{ marginRight: 8 }} />
              Write New Blog Post
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {lastSaved && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <CheckOutlined style={{ color: "#52c41a", marginRight: 4 }} />
                  Last saved: {lastSaved.toLocaleTimeString()}
                </Text>
              )}
              <Tooltip title="Auto save">
                <Switch
                  checked={autoSaveEnabled}
                  onChange={setAutoSaveEnabled}
                  size="small"
                />
              </Tooltip>
            </div>
          </div>
        }
        open={isWriteModalVisible}
        onCancel={() => {
          if (hasChanges) {
            Modal.confirm({
              title: "Do you want to exit?",
              content: "You have unsaved changes. Are you sure you want to exit?",
              onOk: () => setIsWriteModalVisible(false),
            });
          } else {
            setIsWriteModalVisible(false);
          }
        }}
        footer={null}
        width={1000}
        destroyOnClose
        className="write-blog-modal"
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: "edit",
              label: (
                <span>
                  <EditOutlined />
                  Edit
                  {hasChanges && <span style={{ color: "#ff4d4f" }}> *</span>}
                </span>
              ),
              children: (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleCreateBlog}
                  onValuesChange={handleFormChange}
                  initialValues={{
                    category: "Technology",
                  }}
                >
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        label="Blog Title"
                        name="title"
                        rules={[
                          { required: true, message: "Please enter blog title!" },
                          { min: 10, message: "Title must be at least 10 characters!" }
                        ]}
                      >
                        <Input 
                          placeholder="Enter an engaging title for your blog post..." 
                          showCount
                          maxLength={100}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Author Name"
                        name="author"
                        rules={[{ required: true, message: "Please enter your name!" }]}
                      >
                        <Input placeholder="Your name" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: "Please select a category!" }]}
                      >
                        <Select placeholder="Select category">
                          {categories.filter(cat => cat !== "all").map(category => (
                            <Option key={category} value={category}>
                              {category}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Tags" name="tags">
                    <Input 
                      placeholder="Enter tags separated by commas"
                      suffix={<Text type="secondary" style={{ fontSize: 12 }}>e.g., reading, books</Text>}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Excerpt"
                    name="excerpt"
                    rules={[{ required: true, message: "Please enter an excerpt!" }]}
                  >
                    <TextArea 
                      rows={3} 
                      placeholder="Write a brief excerpt that summarizes your blog post..."
                      showCount
                      maxLength={300}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Blog Content</span>
                        <Button
                          type="link"
                          size="small"
                          onClick={() => {
                            const content = form.getFieldValue("content");
                            if (content && !form.getFieldValue("excerpt")) {
                              form.setFieldsValue({ excerpt: generateExcerpt(content) });
                              message.success("Auto-generated excerpt!");
                            }
                          }}
                        >
                          Auto-generate excerpt
                        </Button>
                      </div>
                    }
                    name="content"
                    rules={[
                      { required: true, message: "Please enter blog content!" },
                      { min: 50, message: "Content must be at least 50 characters!" }
                    ]}
                  >
                    <TextArea 
                      rows={12} 
                      placeholder="Write your blog content here. Share your thoughts, insights, and experiences about books..."
                      showCount
                    />
                  </Form.Item>

                  <Form.Item label="Featured Image" name="featuredImage">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Upload
                          name="image"
                          listType="picture-card"
                          showUploadList={false}
                          beforeUpload={() => false}
                          onChange={handleImageUpload}
                        >
                          {previewImage ? (
                            <Image
                              src={previewImage}
                              alt="Preview"
                              style={{ width: "100%", height: 100, objectFit: "cover" }}
                              preview={false}
                            />
                          ) : (
                            <div>
                              {uploading ? <LoadingOutlined /> : <PictureOutlined />}
                              <div style={{ marginTop: 8 }}>
                                {uploading ? "Uploading..." : "Upload Image"}
                              </div>
                            </div>
                          )}
                        </Upload>
                      </Col>
                      <Col span={12}>
                        <div style={{ padding: 8, background: "#f5f5f5", borderRadius: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            • Recommended size: 800x600px<br/>
                            • Format: JPG, PNG<br/>
                            • Max size: 2MB
                          </Text>
                        </div>
                      </Col>
                    </Row>
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                    <Space>
                      <Button onClick={() => setIsWriteModalVisible(false)}>
                        <CloseOutlined /> Cancel
                      </Button>
                      <Button onClick={handleSaveDraft}>
                        <SaveOutlined /> Save Draft
                      </Button>
                      <Button type="primary" onClick={handlePublish}>
                        <CheckOutlined /> Publish
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              )
            },
            {
              key: "preview",
              label: (
                <span>
                  <CopyOutlined />
                  Preview
                </span>
              ),
              children: (
                <div style={{ padding: "20px 0" }}>
                  {(() => {
                    const values = previewData || form.getFieldsValue();
                    const readingTime = values.content ? calculateReadingTime(values.content) : 0;
                    
                    return (
                      <div className="blog-preview">
                        <div className="preview-header">
                          {(previewImage || values.featuredImage) && (
                            <Image
                              src={previewImage || values.featuredImage}
                              alt="Featured"
                              style={{ 
                                width: "100%", 
                                height: 200, 
                                objectFit: "cover",
                                borderRadius: 8,
                                marginBottom: 16
                              }}
                            />
                          )}
                          <Title level={2} style={{ marginBottom: 8 }}>
                            {values.title || "Blog Title"}
                          </Title>
                          <div style={{ marginBottom: 16 }}>
                            <Space split={<span style={{ color: "#d9d9d9" }}>|</span>}>
                              <Text type="secondary">
                                <UserOutlined /> {values.author || "Author"}
                              </Text>
                              <Text type="secondary">
                                <CalendarOutlined /> {new Date().toLocaleDateString()}
                              </Text>
                              <Text type="secondary">
                                <ClockCircleOutlined /> {readingTime} min read
                              </Text>
                              {values.category && (
                                <Tag color="blue">{values.category}</Tag>
                              )}
                            </Space>
                          </div>
                          {values.tags && (
                            <div style={{ marginBottom: 16 }}>
                              {(typeof values.tags === 'string' ? values.tags.split(",") : values.tags).map((tag: string, index: number) => 
                                tag.trim() && <Tag key={index}>{tag.trim()}</Tag>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="preview-content">
                          <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                            <Text strong>{values.excerpt || "Blog excerpt will appear here..."}</Text>
                          </Paragraph>
                          <div 
                            style={{ 
                              whiteSpace: "pre-wrap", 
                              lineHeight: 1.8,
                              fontSize: 16 
                            }}
                          >
                            {values.content || "Blog content will appear here..."}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )
            }
          ]}
        />
      </Modal>
    </div>
  );
};

export default Blog;
