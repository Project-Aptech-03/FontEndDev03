import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
  Upload,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Statistic,
  Tabs,
  Image,
  Switch,
  Tooltip,
  Alert,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  SaveOutlined,
  CloseOutlined,
  PictureOutlined,
  CopyOutlined,
  CheckOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useBlogs, useBlogCrud } from "../../../hooks/useBlogs";
import { useCategories } from "../../../hooks/useFilters";
import { BlogQueryDto, CreateBlogDto, UpdateBlogDto, BlogListResponseDto } from "../../../@type/blog";
import { blogApi } from "../../../api/blog.api";
import "./Blog.css";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

// ReactQuill configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean']
  ],
};

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'indent',
  'align', 'link', 'image', 'video', 'blockquote', 'code-block'
];

const BlogAdmin: React.FC = () => {
  // API hooks
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { createBlog, updateBlog, deleteBlog, loading: crudLoading } = useBlogCrud();

  // Blog query state
  const [blogQuery, setBlogQuery] = useState<BlogQueryDto>({
    page: 1,
    pageSize: 6, // Set page size to 6 blogs per page
    sortBy: "CreatedDate",
    sortOrder: "desc",
    // Don't filter by isPublished to get all blogs
    isPublished: undefined
  });

  // Fetch blogs with current query
  const { blogs, loading: blogsLoading, error: blogsError, pagination, updateQuery, fetchAllBlogs } = useBlogs(blogQuery);

  // Load all blogs including drafts on component mount
  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  // Debug blogs data for status
  useEffect(() => {
    // Count published vs draft
    const publishedCount = blogs.filter(blog => blog.isPublished).length;
    const draftCount = blogs.filter(blog => !blog.isPublished).length;
  }, [blogs]);


  // Debug categories
  useEffect(() => {
    // Categories loaded
  }, [categories, categoriesLoading, categoriesError]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogListResponseDto | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("edit");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Update blog query when search changes
  useEffect(() => {
    const newQuery: BlogQueryDto = {
      ...blogQuery,
      search: searchText || undefined,
      page: 1, // Reset to first page when searching
      // Don't filter by isPublished to get all blogs
      isPublished: undefined
    };
    setBlogQuery(newQuery);
    updateQuery(newQuery);
  }, [searchText]);



  // Update form khi editingBlog thay đổi
  useEffect(() => {
    if (editingBlog && isModalVisible) {
      // Form data will be set in handleEdit function after fetching full blog details
      // This useEffect is mainly for handling modal visibility changes
      setPreviewImage(editingBlog.featuredImageUrl || "");
    }
  }, [editingBlog, isModalVisible]);

  // Update preview data từ form values
  const updatePreviewData = React.useCallback(() => {
    const values = form.getFieldsValue();
    setPreviewData({
      ...values,
      featuredImage: previewImage || values.featuredImage,
    });
  }, [form, previewImage]);

  // Update preview khi switch tab
  useEffect(() => {
    if (activeTab === "preview" && isModalVisible) {
      updatePreviewData();
    }
  }, [activeTab, isModalVisible, updatePreviewData]);

  // Monitor form changes
  const handleFormChange = (changedValues: any, allValues: any) => {
    setHasChanges(true);
    // Update preview data khi form thay đổi
    updatePreviewData();
  };

  // Handle image upload
  const handleImageUpload = async (info: any) => {
    const { file, fileList } = info;
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[fileList.length - 1];
      const actualFile = selectedFile.originFileObj || selectedFile;
      const isImage = actualFile.type?.startsWith('image/');
      if (!isImage) {
        message.error('Only image files are allowed!');
        return;
      }
      setUploading(true);

      try {
        const uploadResponse = await blogApi.uploadBlogImage(actualFile);

        if (uploadResponse && uploadResponse.url) {
          setPreviewImage(uploadResponse.url);
          form.setFieldsValue({ featuredImage: uploadResponse.url });
          message.success("Upload image successfully!");
        } else {
          message.error("Cannot save image to server!");
        }
      } catch (error) {
        console.error('Upload error:', error);
        message.error("Upload image failed!");
      } finally {
        setUploading(false);
      }
    }
  };
  const validateForm = () => {
    const values = form.getFieldsValue();
    const errors = [];

    if (!values.title?.trim()) errors.push("Title cannot be empty");
    if (!values.content?.trim()) errors.push("Content cannot be empty");
    if (!values.excerpt?.trim()) errors.push("Summary cannot be empty");
    if (!values.categoryId) errors.push("Please select a category");

    if (values.title && values.title.length < 10) {
      errors.push("Title must be at least 10 characters");
    }

    if (values.content && values.content.length < 50) {
      errors.push("Content must be at least 50 characters");
    }

    return errors;
  };
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


  const columns: ColumnsType<BlogListResponseDto> = [
    {
      title: "Image",
      dataIndex: "featuredImageUrl",
      key: "featuredImageUrl",
      width: "10%",
      render: (image: string) => (
          <Image src={image} alt="Image" width={100} height={80} style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #f0f0f0" }} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "25%",
      render: (text: string, record: BlogListResponseDto) => (
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.summary}
            </Text>
          </div>
      ),
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
      width: "12%",
      render: (text: string) => (
          <Space>
            <UserOutlined />
            {text}
          </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      width: "10%",
      render: (category: string) => (
          <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "isPublished",
      width: "10%",
      render: (isPublished: boolean) => (
          <Tag color={isPublished ? "green" : "orange"}>
            {isPublished ? "Published" : "Draft"}
          </Tag>
      ),
    },
    {
      title: "Published Date",
      dataIndex: "publishedDate",
      key: "publishedDate",
      width: "12%",
      render: (date: string) => (
          <Space>
            <CalendarOutlined />
            {date ? new Date(date).toLocaleDateString() : "Not published"}
          </Space>
      ),
    },
    {
      title: "View Count",
      dataIndex: "viewCount",
      key: "viewCount",
      width: "8%",
      render: (views: number) => (
          <Statistic
              value={views}
              valueStyle={{ fontSize: 14 }}
          />
      ),
      sorter: (a, b) => a.viewCount - b.viewCount,
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (_, record: BlogListResponseDto) => (
          <Space size="small">
            <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleView(record)}
                title="View Details"
            />
            <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                title="Edit"
            />
            <Popconfirm
                title="Are you sure you want to delete this blog?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
            >
              <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  title="Delete"
              />
            </Popconfirm>
          </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingBlog(null);
    form.resetFields();
    setActiveTab("edit");
    setPreviewImage("");
    setHasChanges(false);
    setPreviewData({
      isPublished: false,
      title: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      tags: "",
      publishDate: "",
      featuredImage: "",
    });
    // Set default form values for new blog
    form.setFieldsValue({
      isPublished: false,
      isFeatured: false,
    });
    setIsModalVisible(true);
  };

  const handleEdit = async (blog: BlogListResponseDto) => {
    setEditingBlog(blog);

    // Reset states
    setActiveTab("edit");
    setPreviewImage(blog.featuredImageUrl || "");
    setHasChanges(false);

    try {
      // Fetch full blog content
      const fullBlog = await blogApi.getBlogById(blog.id);

      // Prepare form data với format đúng
      const formData = {
        title: fullBlog.title,
        content: fullBlog.content || "",
        excerpt: fullBlog.summary || "",
        categoryId: fullBlog.categoryId,
        isPublished: fullBlog.isPublished,
        isFeatured: fullBlog.isFeatured,
        publishDate: fullBlog.publishedDate ? dayjs(fullBlog.publishedDate) : null,
        featuredImage: fullBlog.featuredImageUrl,
        tags: (fullBlog as any).tags ? (fullBlog as any).tags.join(", ") : "",
      };

      form.setFieldsValue(formData);

      setPreviewData({
        title: fullBlog.title,
        content: fullBlog.content || "",
        excerpt: fullBlog.summary || "",
        categoryId: fullBlog.categoryId,
        isPublished: fullBlog.isPublished,
        isFeatured: fullBlog.isFeatured,
        publishDate: fullBlog.publishedDate || "",
        featuredImage: fullBlog.featuredImageUrl || "",
        tags: (fullBlog as any).tags ? (fullBlog as any).tags.join(", ") : "",
      });

      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching blog details:", error);
      message.error("Cannot fetch blog details!");
    }
  };

  const handleView = (blog: BlogListResponseDto) => {
    Modal.info({
      title: blog.title,
      width: 800,
      content: (
          <div>
            <Paragraph>
              <Text strong>Author:</Text> {blog.authorName}
            </Paragraph>
            <Paragraph>
              <Text strong>Category:</Text> {blog.categoryName}
            </Paragraph>
            <Paragraph>
              <Text strong>Status:</Text>{" "}
              <Tag color={blog.isPublished ? "green" : "orange"}>
                {blog.isPublished ? "Published" : "Draft"}
              </Tag>
            </Paragraph>
            <Paragraph>
              <Text strong>View Count:</Text> {blog.viewCount}
            </Paragraph>
            <Paragraph>
              <Text strong>Like Count:</Text> {blog.likeCount}
            </Paragraph>
            <Paragraph>
              <Text strong>Comment Count:</Text> {blog.commentCount}
            </Paragraph>
            <Paragraph>
              <Text strong>Summary:</Text> {blog.summary}
            </Paragraph>
            <Paragraph>
              <Text strong>Created Date:</Text> {new Date(blog.createdDate).toLocaleDateString()}
            </Paragraph>
            {blog.publishedDate && (
                <Paragraph>
                  <Text strong>Published Date:</Text> {new Date(blog.publishedDate).toLocaleDateString()}
                </Paragraph>
            )}
          </div>
      ),
    });
  };

  const handleDelete = async (id: number) => {
    const success = await deleteBlog(id);
    if (success) {
      message.success("Blog deleted successfully!");

      if (isShowingAllBlogs) {
        // Refresh all blogs data
        const result = await blogApi.getAllBlogs();
        setAllBlogsData(result.items);

        // Recalculate pagination
        const pageSize = allBlogsPagination.pageSize;
        const totalPages = Math.ceil(result.items.length / pageSize);
        setAllBlogsPagination(prev => ({
          ...prev,
          totalCount: result.items.length,
          totalPages: totalPages,
          hasNextPage: totalPages > prev.pageNumber
        }));
      } else {
        updateQuery(blogQuery);
      }

      // Refresh statistics
      fetchAllBlogStats();
    }
  };

  const handleSubmit = async (values: any) => {
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      Modal.error({
        title: "Validation error",
        content: (
            <ul>
              {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
              ))}
            </ul>
        ),
      });
      return;
    }

    try {
      if (editingBlog) {
        // Update existing blog
        const updateData: UpdateBlogDto = {
          title: values.title.trim(),
          content: values.content.trim(),
          summary: values.excerpt.trim() || generateExcerpt(values.content),
          featuredImageUrl: previewImage || values.featuredImage,
          isPublished: values.isPublished,
          isFeatured: values.isFeatured || false,
          categoryId: values.categoryId,
          // Add publishedDate when publishing - format as ISO string
          ...(values.isPublished && values.publishDate && {
            publishedDate: values.publishDate instanceof Date
                ? values.publishDate.toISOString()
                : values.publishDate
          }),
          // Add current date if publishing and no publishDate
          ...(values.isPublished && !values.publishDate && {
            publishedDate: new Date().toISOString()
          })
        };

        const result = await updateBlog(editingBlog.id, updateData);

        if (result) {
          message.success("Blog updated successfully!");
          setIsModalVisible(false);
          setHasChanges(false);
          form.resetFields();
          // Force refresh the blogs list with all blogs including drafts
          if (isShowingAllBlogs) {
            // Refresh all blogs data
            const result = await blogApi.getAllBlogs();
            setAllBlogsData(result.items);

            // Recalculate pagination
            const pageSize = allBlogsPagination.pageSize;
            const totalPages = Math.ceil(result.items.length / pageSize);
            setAllBlogsPagination(prev => ({
              ...prev,
              totalCount: result.items.length,
              totalPages: totalPages,
              hasNextPage: totalPages > prev.pageNumber
            }));
          } else {
            fetchAllBlogs();
          }
          // Refresh statistics
          fetchAllBlogStats();
        } else {
          message.error("Blog update failed");
        }
      } else {
        // Create new blog
        const createData: CreateBlogDto = {
          title: values.title.trim(),
          content: values.content.trim(),
          summary: values.excerpt.trim() || generateExcerpt(values.content),
          featuredImageUrl: previewImage || values.featuredImage,
          isPublished: values.isPublished,
          isFeatured: values.isFeatured || false,
          categoryId: values.categoryId
        };

        const result = await createBlog(createData);
        if (result) {
          message.success("Blog created successfully!");
          setIsModalVisible(false);
          setHasChanges(false);
          form.resetFields();
          if (isShowingAllBlogs) {
            // Refresh all blogs data
            const result = await blogApi.getAllBlogs();
            setAllBlogsData(result.items);

            // Recalculate pagination
            const pageSize = allBlogsPagination.pageSize;
            const totalPages = Math.ceil(result.items.length / pageSize);
            setAllBlogsPagination(prev => ({
              ...prev,
              totalCount: result.items.length,
              totalPages: totalPages,
              hasNextPage: totalPages > prev.pageNumber
            }));
          } else {
            updateQuery(blogQuery);
          }
          // Refresh statistics
          fetchAllBlogStats();
        }
      }
    } catch (error: any) {
      message.error("Error saving blog!");
    }
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    const values = form.getFieldsValue();
    values.isPublished = false;
    await handleSubmit(values);
  };

  // Handle publish
  const handlePublish = async () => {
    const values = form.getFieldsValue();
    values.isPublished = true;
    values.publishDate = values.publishDate || new Date();
    await handleSubmit(values);
  };

  // State for managing all blogs display
  const [isShowingAllBlogs, setIsShowingAllBlogs] = useState(false);
  const [allBlogsData, setAllBlogsData] = useState<BlogListResponseDto[]>([]);
  const [allBlogsPagination, setAllBlogsPagination] = useState({
    totalCount: 0,
    pageNumber: 1,
    pageSize: 6,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  });

  // Handle filter by status
  const handleFilterByStatus = async (status: 'all' | 'Published' | 'Draft') => {
    if (status === 'all') {
      // Fetch all blogs using fetchAllBlogs and handle pagination manually
      setIsShowingAllBlogs(true);
      try {
        const result = await blogApi.getAllBlogs();
        setAllBlogsData(result.items);

        // Calculate pagination for all blogs
        const pageSize = 6;
        const totalPages = Math.ceil(result.items.length / pageSize);

        setAllBlogsPagination({
          totalCount: result.items.length,
          pageNumber: 1,
          pageSize: pageSize,
          totalPages: totalPages,
          hasPreviousPage: false,
          hasNextPage: totalPages > 1
        });

        // Update query state for consistency
        setBlogQuery({
          page: 1,
          pageSize: pageSize,
          sortBy: "CreatedDate",
          sortOrder: "desc",
          isPublished: undefined
        });
      } catch (error) {
        console.error('Error fetching all blogs:', error);
        message.error('Failed to fetch all blogs');
      }
    } else {
      // Use regular query for published/draft
      setIsShowingAllBlogs(false);
      const newQuery: BlogQueryDto = {
        ...blogQuery,
        page: 1, // Reset to first page
        isPublished: status === 'Published'
      };
      setBlogQuery(newQuery);
      updateQuery(newQuery);
    }
  };

  // State for storing all blog statistics
  const [allBlogStats, setAllBlogStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalViews: 0
  });

  // Function to fetch all blog statistics
  const fetchAllBlogStats = async () => {
    try {
      // Fetch published blogs count
      const publishedQuery = { page: 1, pageSize: 1000, isPublished: true };
      const publishedResult = await blogApi.getBlogs(publishedQuery);

      // Fetch draft blogs count
      const draftQuery = { page: 1, pageSize: 1000, isPublished: false };
      const draftResult = await blogApi.getBlogs(draftQuery);

      const publishedCount = publishedResult.totalCount;
      const draftCount = draftResult.totalCount;
      const totalCount = publishedCount + draftCount;

      // Calculate total views from all blogs
      const allPublishedBlogs = publishedResult.items || [];
      const allDraftBlogs = draftResult.items || [];
      const totalViews = [...allPublishedBlogs, ...allDraftBlogs]
          .reduce((total, blog) => total + blog.viewCount, 0);

      setAllBlogStats({
        totalBlogs: totalCount,
        publishedBlogs: publishedCount,
        draftBlogs: draftCount,
        totalViews
      });
    } catch (error) {
      console.error('Error fetching blog statistics:', error);
    }
  };

  // Fetch all blog statistics on component mount
  useEffect(() => {
    fetchAllBlogStats();
  }, []);

  // Calculate statistics for current filtered data
  const getCurrentStats = () => {
    const currentBlogs = isShowingAllBlogs ? allBlogsData : blogs; // Use appropriate data source
    const publishedCount = currentBlogs.filter(blog => blog.isPublished).length;
    const draftCount = currentBlogs.filter(blog => !blog.isPublished).length;
    const totalCount = currentBlogs.length;

    return {
      publishedCount,
      draftCount,
      totalCount
    };
  };

  const currentStats = getCurrentStats();

  // Get current pagination data
  const getCurrentPagination = () => {
    return isShowingAllBlogs ? allBlogsPagination : pagination;
  };

  // Get current blogs data for table
  const getCurrentBlogs = () => {
    if (isShowingAllBlogs) {
      // For all blogs, slice the data based on current page
      const startIndex = (allBlogsPagination.pageNumber - 1) * allBlogsPagination.pageSize;
      const endIndex = startIndex + allBlogsPagination.pageSize;
      return allBlogsData.slice(startIndex, endIndex);
    }
    return blogs;
  };

  const currentBlogs = getCurrentBlogs();
  const currentPagination = getCurrentPagination();

  const statsData = [
    {
      title: "Total blogs",
      value: allBlogStats.totalBlogs,
      icon: <FileTextOutlined style={{ color: "#1890ff" }} />,
      onClick: () => handleFilterByStatus('all'),
      style: {
        cursor: 'pointer',
        border: blogQuery.isPublished === undefined ? '2px solid #1890ff' : '1px solid #d9d9d9',
        backgroundColor: blogQuery.isPublished === undefined ? '#f6ffed' : 'white'
      },
      description: blogQuery.isPublished === undefined
          ? `Showing all ${currentStats.totalCount} blogs (${allBlogStats.publishedBlogs} published, ${allBlogStats.draftBlogs} draft)`
          : `Click to show all ${allBlogStats.totalBlogs} blogs (${allBlogStats.publishedBlogs} published + ${allBlogStats.draftBlogs} draft)`
    },
    {
      title: "Published",
      value: allBlogStats.publishedBlogs,
      icon: <FileTextOutlined style={{ color: "#52c41a" }} />,
      onClick: () => handleFilterByStatus('published'),
      style: {
        cursor: 'pointer',
        border: blogQuery.isPublished === true ? '2px solid #52c41a' : '1px solid #d9d9d9',
        backgroundColor: blogQuery.isPublished === true ? '#f6ffed' : 'white'
      },
      description: blogQuery.isPublished === true
          ? `Showing ${currentStats.totalCount} published blogs (page ${blogQuery.page})`
          : `Click to show all ${allBlogStats.publishedBlogs} published blogs`
    },
    {
      title: "Draft",
      value: allBlogStats.draftBlogs,
      icon: <FileTextOutlined style={{ color: "#faad14" }} />,
      onClick: () => handleFilterByStatus('draft'),
      style: {
        cursor: 'pointer',
        border: blogQuery.isPublished === false ? '2px solid #faad14' : '1px solid #d9d9d9',
        backgroundColor: blogQuery.isPublished === false ? '#fffbe6' : 'white'
      },
      description: blogQuery.isPublished === false
          ? `Showing ${currentStats.totalCount} draft blogs (page ${blogQuery.page})`
          : `Click to show all ${allBlogStats.draftBlogs} draft blogs`
    },
    {
      title: "Total views",
      value: allBlogStats.totalViews,
      icon: <EyeOutlined style={{ color: "#722ed1" }} />,
      style: { border: '1px solid #d9d9d9' },
      description: "Total views across all blogs"
    },
  ];

  return (
      <div className="blog-admin">
        <div className="blog-header">
          <Title level={2}>
            <FileTextOutlined /> Blog Management
          </Title>
          <Paragraph>
            Manage blog posts, create new content and track performance.
          </Paragraph>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statsData.map((stat, index) => (
              <Col xs={12} sm={12} md={6} lg={6} key={index}>
                <Tooltip title={stat.description} placement="top">
                  <Card
                      hoverable={!!stat.onClick}
                      onClick={stat.onClick}
                      style={{
                        ...stat.style,
                        transition: 'all 0.3s ease',
                        transform: 'scale(1)'
                      }}
                      bodyStyle={{
                        padding: '16px',
                        textAlign: 'center'
                      }}
                  >
                    <Statistic
                        title={
                          <div style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '8px'
                          }}>
                            {stat.title}
                          </div>
                        }
                        value={stat.value}
                        prefix={stat.icon}
                        valueStyle={{
                          color: stat.title === 'Total blogs' ? "#1890ff" :
                              stat.title === 'Published' ? "#52c41a" :
                                  stat.title === 'Draft' ? "#faad14" : "#722ed1",
                          fontSize: '24px',
                          fontWeight: 'bold'
                        }}
                    />
                    {stat.description && (
                        <div style={{
                          fontSize: '12px',
                          color: '#666',
                          marginTop: '8px',
                          textAlign: 'center'
                        }}>
                          {stat.description}
                        </div>
                    )}
                  </Card>
                </Tooltip>
              </Col>
          ))}
        </Row>

        {/* Action Bar */}
        <Card style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Input
                    placeholder="Search blog..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
                {/* Filter Status Indicator */}
                {isShowingAllBlogs ? (
                    <Tag
                        color="blue"
                        style={{ fontSize: '14px', padding: '4px 12px' }}
                    >
                      All blogs ({currentPagination.totalCount} total, showing {currentBlogs.length} on page {currentPagination.pageNumber})
                    </Tag>
                ) : blogQuery.isPublished !== undefined ? (
                    <Tag
                        closable
                        onClose={() => handleFilterByStatus('all')}
                        color={blogQuery.isPublished ? "green" : "orange"}
                        style={{ fontSize: '14px', padding: '4px 12px' }}
                    >
                      {blogQuery.isPublished ? "Published" : "Draft"} blogs ({currentPagination.totalCount} total, showing {currentBlogs.length} on page {currentPagination.pageNumber})
                    </Tag>
                ) : null}
              </Space>
            </Col>
            <Col>
              <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  size="large"
              >
                Add new blog
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Blog Table */}
        <Card>
          {blogsError && (
              <Alert
                  message="Error loading blogs"
                  description={blogsError}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
              />
          )}
          <Table
              columns={columns}
              dataSource={currentBlogs}
              rowKey="id"
              loading={blogsLoading}
              pagination={{
                current: currentPagination.pageNumber,
                pageSize: currentPagination.pageSize,
                total: currentPagination.totalCount,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} blogs`,
                onChange: (page, pageSize) => {
                  if (isShowingAllBlogs) {
                    // Handle pagination for all blogs manually
                    setAllBlogsPagination(prev => ({
                      ...prev,
                      pageNumber: page,
                      pageSize: pageSize || prev.pageSize,
                      hasPreviousPage: page > 1,
                      hasNextPage: page < Math.ceil(allBlogsData.length / (pageSize || prev.pageSize))
                    }));
                  } else {
                    // Handle pagination for filtered blogs
                    const newQuery = { ...blogQuery, page, pageSize };
                    setBlogQuery(newQuery);
                    updateQuery(newQuery);
                  }
                },
              }}
              scroll={{ x: 1200 }}
          />
        </Card>

        {/* Enhanced Add/Edit Modal */}
        <Modal
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>
              <FileTextOutlined style={{ marginRight: 8 }} />
              {editingBlog ? "Edit blog" : "Add new blog"}
            </span>
              </div>
            }
            open={isModalVisible}
            onCancel={() => {
              if (hasChanges) {
                Modal.confirm({
                  title: "Are you sure you want to exit?",
                  content: "There are changes that have not been saved. Are you sure you want to exit?",
                  onOk: () => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setEditingBlog(null);
                    setHasChanges(false);
                    setPreviewImage("");
                  },
                });
              } else {
                setIsModalVisible(false);
                form.resetFields();
                setEditingBlog(null);
                setHasChanges(false);
                setPreviewImage("");
              }
            }}
            footer={null}
            width={1000}
            destroyOnHidden
        >
          <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onValuesChange={handleFormChange}
              initialValues={{
                isPublished: false,
              }}
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
                        <div>
                          <Row gutter={16}>
                            <Col span={24}>
                              <Form.Item
                                  label="Title"
                                  name="title"
                                  rules={[
                                    { required: true, message: "Please enter title!" },
                                    { min: 10, message: "Title must be at least 10 characters!" }
                                  ]}
                              >
                                <Input
                                    placeholder="Enter title"
                                    showCount
                                    maxLength={100}
                                />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                  label="Category"
                                  name="categoryId"
                                  rules={[{ required: true, message: "Please select a category!" }]}
                                  help={categoriesError ? `Error loading category: ${categoriesError}` : undefined}
                                  validateStatus={categoriesError ? "error" : undefined}
                              >
                                <Select
                                    placeholder={categoriesError ? "Cannot load category" : "Select category"}
                                    loading={categoriesLoading}
                                    disabled={!!categoriesError}
                                >
                                  {categories.map((category) => {
                                    return (
                                        <Option key={category.id} value={category.id}>
                                          {category.name}
                                        </Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                  label="Featured"
                                  name="isFeatured"
                                  valuePropName="checked"
                              >
                                <Switch />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                  label="Status"
                                  name="isPublished"
                                  valuePropName="checked"
                                  extra="Turn on to publish the blog, turn off to save as draft"
                              >
                                <Switch
                                    checkedChildren="Published"
                                    unCheckedChildren="Draft"
                                    style={{ backgroundColor: '#52c41a' }}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item label="Published Date" name="publishDate">
                                <DatePicker style={{ width: "100%" }} />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item label="Tags" name="tags">
                            <Input
                                placeholder="Enter tags, separated by commas"
                                suffix={<Text type="secondary" style={{ fontSize: 12 }}>VD: sách, giáo dục</Text>}
                            />
                          </Form.Item>

                          <Form.Item
                              label="Summary"
                              name="excerpt"
                              rules={[{ required: true, message: "Please enter summary!" }]}
                          >
                            <TextArea
                                rows={3}
                                placeholder="Enter summary"
                                showCount
                                maxLength={300}
                            />
                          </Form.Item>

                          <Form.Item
                              label={
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                  <span>Content</span>
                                  <Button
                                      type="link"
                                      size="small"
                                      onClick={() => {
                                        const content = form.getFieldValue("content");
                                        if (content && !form.getFieldValue("excerpt")) {
                                          // Strip HTML tags for excerpt generation
                                          const textContent = content.replace(/<[^>]*>/g, '');
                                          form.setFieldsValue({ excerpt: generateExcerpt(textContent) });
                                          message.success("Auto-generated summary!");
                                        }
                                      }}
                                  >
                                    Auto-generate summary
                                  </Button>
                                </div>
                              }
                              name="content"
                              rules={[
                                { required: true, message: "Please enter content!" },
                                {
                                  validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    const textContent = value.replace(/<[^>]*>/g, '');
                                    if (textContent.length < 50) {
                                      return Promise.reject(new Error("Content must be at least 50 characters!"));
                                    }
                                    return Promise.resolve();
                                  }
                                }
                              ]}
                          >
                            <div style={{ height: '300px', marginBottom: '24px' }}>
                              <ReactQuill
                                  theme="snow"
                                  modules={quillModules}
                                  formats={quillFormats}
                                  placeholder="Enter detailed content of the blog..."
                                  style={{ height: '250px' }}
                                  value={form.getFieldValue("content") || ""}
                                  onChange={(content) => {
                                    form.setFieldsValue({ content });
                                    setHasChanges(true);
                                  }}
                              />
                            </div>
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
                                          {uploading ? "Uploading..." : "Upload image"}
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
                              <Button onClick={() => setIsModalVisible(false)}>
                                <CloseOutlined /> Cancel
                              </Button>
                              <Button onClick={handleSaveDraft}>
                                <SaveOutlined /> Save draft
                              </Button>
                              <Button type="primary" onClick={handlePublish}>
                                <CheckOutlined /> Publish
                              </Button>
                            </Space>
                          </Form.Item>
                        </div>
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
                            // Sử dụng previewData hoặc fallback to form values
                            const values = previewData || form.getFieldsValue();
                            const readingTime = values.content ? calculateReadingTime(values.content) : 0;
                            const displayDate = values.publishDate ?
                                (typeof values.publishDate === 'string' ? values.publishDate : values.publishDate.format?.('YYYY-MM-DD'))
                                : "Not published";
                            const statusText = values.isPublished ? "Published" : "Draft";
                            const statusColor = values.isPublished ? "green" : "orange";

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
                                      {values.title || "Blog title"}
                                    </Title>
                                    <div style={{ marginBottom: 16 }}>
                                      <Space split={<span style={{ color: "#d9d9d9" }}>|</span>}>
                                        <Text type="secondary">
                                          <UserOutlined /> {values.author || "Author"}
                                        </Text>
                                        <Text type="secondary">
                                          <CalendarOutlined /> {displayDate}
                                        </Text>
                                        <Text type="secondary">
                                          <ClockCircleOutlined /> {readingTime} min read
                                        </Text>
                                        <Tag color={statusColor}>{statusText}</Tag>
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
                                      <Text strong>{values.excerpt || "Summary..."}</Text>
                                    </Paragraph>
                                    <div
                                        style={{
                                          whiteSpace: "pre-wrap",
                                          lineHeight: 1.8,
                                          fontSize: 16
                                        }}
                                    >
                                      {values.content || "The content of the blog will be displayed here..."}
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
          </Form>
        </Modal>
      </div>
  );
};

export default BlogAdmin;

