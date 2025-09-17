import React, { useState, useEffect } from "react";
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
  Rate,
  Spin,
  Alert
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
  FileTextOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useBlogs, useFeaturedBlogs, useRecentBlogs, useBlogCrud, useBlogLikes } from "../../hooks/useBlogs";
import { useCategories } from "../../hooks/useFilters";
import { BlogQueryDto, CreateBlogDto, BlogListResponseDto } from "../../@type/blog";
import { blogApi } from "../../api/blog.api";
import "./BlogPage.css";

const { Search, TextArea } = Input;
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

const Blog: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
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

  // API hooks
  const { categories, loading: categoriesLoading } = useCategories();
  const { likeBlog, unlikeBlog } = useBlogLikes();
  const { createBlog, loading: createLoading } = useBlogCrud();

  // Blog query state
  const [blogQuery, setBlogQuery] = useState<BlogQueryDto>({
    page: 1,
    pageSize: 10,
    isPublished: true,
    sortBy: "CreatedDate",
    sortOrder: "desc"
  });

  // Fetch blogs with current query
  const { blogs, loading: blogsLoading, error: blogsError, pagination, updateQuery } = useBlogs(blogQuery);
  const { blogs: featuredBlogs, loading: featuredLoading } = useFeaturedBlogs(5);
  const { blogs: recentBlogs, loading: recentLoading } = useRecentBlogs(5);

  // Update blog query when search or category changes
  useEffect(() => {
    const newQuery: BlogQueryDto = {
      ...blogQuery,
      search: searchText || undefined,
      categoryId: selectedCategory,
      page: 1 // Reset to first page when filtering
    };
    setBlogQuery(newQuery);
    updateQuery(newQuery);
  }, [searchText, selectedCategory]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // Handle category change
  const handleCategoryChange = (value: number | undefined) => {
    setSelectedCategory(value);
  };

  // Handle create new blog
  const handleCreateBlog = async (values: any) => {
    const blogData: CreateBlogDto = {
      title: values.title,
      content: values.content,
      summary: values.excerpt,
      featuredImageUrl: previewImage || values.featuredImage,
      isPublished: values.status === "published",
      isFeatured: false,
      categoryId: values.categoryId
    };

    const result = await createBlog(blogData);
    if (result) {
      setIsWriteModalVisible(false);
      form.resetFields();
      setPreviewImage("");
      message.success('Blog created successfully!');
      // Refresh the blog list
      updateQuery(blogQuery);
    }
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
  const handleImageUpload = async (info: any) => {
    const { file, fileList } = info;
    
    // Only process if there are files and we're not in uploading state
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[fileList.length - 1];
      const actualFile = selectedFile.originFileObj || selectedFile;
      
      // Check if it's an image file
      const isImage = actualFile.type?.startsWith('image/');
      if (!isImage) {
        message.error('Only image files are allowed!');
        return;
      }
      
      // Set uploading state
      setUploading(true);
      
      try {
        // Upload image to server
        const uploadResponse = await blogApi.uploadBlogImage(actualFile);
        
        if (uploadResponse && uploadResponse.url) {
          setPreviewImage(uploadResponse.url);
          form.setFieldsValue({ featuredImage: uploadResponse.url });
          message.success("Image uploaded successfully!");
        } else {
          message.error("Could not save image to server!");
        }
      } catch (error) {
        console.error('Upload error:', error);
        message.error("Image upload failed!");
      } finally {
        setUploading(false);
      }
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

  // Handle blog like
  const handleLikeBlog = async (blogId: number, isLiked: boolean) => {
    if (isLiked) {
      await unlikeBlog(blogId);
    } else {
      await likeBlog(blogId);
    }
    // Refresh the blog list to update like counts
    updateQuery(blogQuery);
  };

  // Get featured post (first featured blog or first blog)
  const featuredPost = featuredBlogs[0] || blogs[0];

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
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Select category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              size="large"
              style={{ width: "100%" }}
              loading={categoriesLoading}
              allowClear
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div className="filter-stats">
              <span>{pagination.totalCount} articles found</span>
            </div>
          </Col>
        </Row>
      </div>
      {featuredPost && (
        <div className="featured-article">
          <Card className="featured-card">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <div className="featured-image">
                  <img 
                    src={featuredPost.featuredImageUrl || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop"} 
                    alt={featuredPost.title} 
                  />
                  {featuredPost.isFeatured && <div className="featured-badge">Featured</div>}
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="featured-content">
                  <div className="featured-meta">
                    <Tag color="blue">{featuredPost.categoryName}</Tag>
                    <span className="featured-date">
                      <CalendarOutlined /> {new Date(featuredPost.publishedDate || featuredPost.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="featured-title">{featuredPost.title}</h2>
                  <p className="featured-excerpt">{featuredPost.summary}</p>
                  <div className="featured-author">
                    <Avatar src={featuredPost.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${featuredPost.authorName}`} />
                    <span>{featuredPost.authorName}</span>
                    <span className="read-time">{calculateReadTime(featuredPost.summary || '')}</span>
                  </div>
                  <div className="featured-actions">
                    <Button 
                      type="primary" 
                      size="large" 
                      className="read-more-btn"
                      onClick={() => navigate(`/blog/${featuredPost.id}`)}
                    >
                      Read Full Article
                    </Button>
                    <Button
                      type={featuredPost.isLikedByCurrentUser ? "primary" : "default"}
                      icon={featuredPost.isLikedByCurrentUser ? <HeartFilled /> : <HeartOutlined />}
                      onClick={() => handleLikeBlog(featuredPost.id, featuredPost.isLikedByCurrentUser)}
                    >
                      {featuredPost.likeCount}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      )}

      {/* Articles Grid */}
      <div className="articles-section">
        <h2 className="section-title">Latest Book Reviews & Articles</h2>
        {blogsError && (
          <Alert
            message="Error loading blogs"
            description={blogsError}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        {blogsLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {blogs.map(blog => (
              <Col xs={24} sm={12} lg={8} key={blog.id}>
                <Card
                  hoverable
                  className="article-card"
                  cover={
                    <div 
                      className="article-image"
                      onClick={() => navigate(`/blog/${blog.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img 
                        src={blog.featuredImageUrl || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop"} 
                        alt={blog.title} 
                      />
                      <div className="article-overlay">
                        <Button type="primary" ghost>
                          Read More
                        </Button>
                      </div>
                    </div>
                  }
                >
                  <div className="article-meta">
                    <Tag color="blue">{blog.categoryName}</Tag>
                    <span className="article-date">
                      <CalendarOutlined /> {new Date(blog.publishedDate || blog.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 
                    className="article-title"
                    onClick={() => navigate(`/blog/${blog.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {blog.title}
                  </h3>
                  <p className="article-excerpt">{blog.summary}</p>
                  <div className="article-footer">
                    <div className="article-author">
                      <Avatar size="small" src={blog.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorName}`} />
                      <span>{blog.authorName}</span>
                    </div>
                    <div className="article-stats">
                      <span><EyeOutlined /> {blog.viewCount}</span>
                      <span>{calculateReadTime(blog.summary || '')}</span>
                    </div>
                  </div>
                  <div className="article-actions">
                    <Button
                      type={blog.isLikedByCurrentUser ? "primary" : "default"}
                      icon={blog.isLikedByCurrentUser ? <HeartFilled /> : <HeartOutlined />}
                      onClick={() => handleLikeBlog(blog.id, blog.isLikedByCurrentUser)}
                      size="small"
                    >
                      {blog.likeCount}
                    </Button>
                    <span style={{ marginLeft: 8 }}>
                      <MessageOutlined /> {blog.commentCount}
                    </span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
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
        destroyOnHidden
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
                        name="categoryId"
                        rules={[{ required: true, message: "Please select a category!" }]}
                      >
                        <Select placeholder="Select category" loading={categoriesLoading}>
                          {categories.map(category => (
                            <Option key={category.id} value={category.id}>
                              {category.name}
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
                          showUploadList={true}
                          customRequest={({ file, onSuccess, onError }) => {
                            // We handle the upload manually in handleImageUpload
                            if (onSuccess) onSuccess("ok");
                          }}
                          onChange={handleImageUpload}
                          accept="image/*"
                          maxCount={1}
                        >
                          {!previewImage && (
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
                            • Format: JPG, PNG, GIF, WEBP<br/>
                            • No file size limit<br/>
                            • No image size limit
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
