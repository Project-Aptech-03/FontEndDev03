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
    pageSize: 10,
    sortBy: "CreatedDate",
    sortOrder: "desc"
  });

  // Fetch blogs with current query
  const { blogs, loading: blogsLoading, error: blogsError, pagination, updateQuery } = useBlogs(blogQuery);

  // Debug categories
  useEffect(() => {
    console.log('Categories loaded:', categories);
    console.log('Categories loading:', categoriesLoading);
    console.log('Categories error:', categoriesError);
  }, [categories, categoriesLoading, categoriesError]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogListResponseDto | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("edit");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Update blog query when search changes
  useEffect(() => {
    const newQuery: BlogQueryDto = {
      ...blogQuery,
      search: searchText || undefined,
      page: 1 // Reset to first page when searching
    };
    setBlogQuery(newQuery);
    updateQuery(newQuery);
  }, [searchText]);

  // Auto-save function
  const handleAutoSave = React.useCallback(async () => {
    if (!editingBlog) return;
    
    try {
      const values = form.getFieldsValue();
      const updatedBlog = {
        ...editingBlog,
        ...values,
        tags: values.tags ? values.tags.split(",").map((tag: string) => tag.trim()) : [],
        publishDate: values.publishDate ? values.publishDate.format("YYYY-MM-DD") : "",
        updatedAt: new Date().toISOString(),
      };

      updateQuery(blogQuery);
      setLastSaved(new Date());
      setHasChanges(false);
      message.success("Đã tự động lưu bản nháp!", 2);
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, [editingBlog, form]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !hasChanges || !editingBlog) return;

    const autoSaveTimer = setTimeout(() => {
      handleAutoSave();
    }, 3000); // Auto-save after 3 seconds of no changes

    return () => clearTimeout(autoSaveTimer);
  }, [autoSaveEnabled, hasChanges, editingBlog, handleAutoSave]);

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
  const handleFormChange = () => {
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
        message.error('Chỉ được tải lên file ảnh!');
        return;
      }
      setUploading(true);
      
      try {
        const uploadResponse = await blogApi.uploadBlogImage(actualFile);
        
        if (uploadResponse && uploadResponse.url) {
          setPreviewImage(uploadResponse.url);
          form.setFieldsValue({ featuredImage: uploadResponse.url });
          message.success("Tải ảnh thành công!");
        } else {
          message.error("Không thể lưu ảnh lên server!");
        }
      } catch (error) {
        console.error('Upload error:', error);
        message.error("Tải ảnh thất bại!");
      } finally {
        setUploading(false);
      }
    }
  };
  const validateForm = () => {
    const values = form.getFieldsValue();
    const errors = [];

    if (!values.title?.trim()) errors.push("Tiêu đề không được để trống");
    if (!values.content?.trim()) errors.push("Nội dung không được để trống");
    if (!values.excerpt?.trim()) errors.push("Tóm tắt không được để trống");
    if (!values.categoryId) errors.push("Vui lòng chọn danh mục");

    if (values.title && values.title.length < 10) {
      errors.push("Tiêu đề phải có ít nhất 10 ký tự");
    }

    if (values.content && values.content.length < 50) {
      errors.push("Nội dung phải có ít nhất 50 ký tự");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "green";
      case "draft":
        return "orange";
      case "archived":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Đã xuất bản";
      case "draft":
        return "Bản nháp";
      case "archived":
        return "Đã lưu trữ";
      default:
        return status;
    }
  };

  const columns: ColumnsType<BlogListResponseDto> = [
    {
      title: "Ảnh",
      dataIndex: "featuredImageUrl",
      key: "featuredImageUrl",
      width: "10%",
      render: (image: string) => (
        <Image src={image} alt="Ảnh" width={100} height={80} style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #f0f0f0" }} />
      ),
    },
    {
      title: "Tiêu đề",
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
      title: "Tác giả",
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
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      width: "10%",
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isPublished",
      key: "isPublished",
      width: "10%",
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? "green" : "orange"}>
          {isPublished ? "Đã xuất bản" : "Bản nháp"}
        </Tag>
      ),
      filters: [
        { text: "Đã xuất bản", value: true },
        { text: "Bản nháp", value: false },
      ],
      onFilter: (value, record) => record.isPublished === value,
    },
    {
      title: "Ngày xuất bản",
      dataIndex: "publishedDate",
      key: "publishedDate",
      width: "12%",
      render: (date: string) => (
        <Space>
          <CalendarOutlined />
          {date ? new Date(date).toLocaleDateString() : "Chưa xuất bản"}
        </Space>
      ),
    },
    {
      title: "Lượt xem",
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
      title: "Thao tác",
      key: "action",
      width: "15%",
      render: (_, record: BlogListResponseDto) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            title="Xem chi tiết"
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              title="Xóa"
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
    setLastSaved(null);
    setPreviewData({
      status: "draft",
      title: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      tags: "",
      publishDate: "",
      featuredImage: "",
    });
    setIsModalVisible(true);
  };

  const handleEdit = async (blog: BlogListResponseDto) => {
    setEditingBlog(blog);
    
    // Reset states
    setActiveTab("edit");
    setPreviewImage(blog.featuredImageUrl || "");
    setHasChanges(false);
    setLastSaved(null);
    
    try {
      // Fetch full blog content
      const fullBlog = await blogApi.getBlogById(blog.id);
      
      // Prepare form data với format đúng
      const formData = {
        title: fullBlog.title,
        content: fullBlog.content || "",
        excerpt: fullBlog.summary || "",
        categoryId: fullBlog.categoryId,
        status: fullBlog.isPublished ? "published" : "draft",
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
        status: fullBlog.isPublished ? "published" : "draft",
        isFeatured: fullBlog.isFeatured,
        publishDate: fullBlog.publishedDate || "",
        featuredImage: fullBlog.featuredImageUrl || "",
        tags: (fullBlog as any).tags ? (fullBlog as any).tags.join(", ") : "",
      });
      
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching blog details:", error);
      message.error("Không thể tải chi tiết bài viết!");
    }
  };

  const handleView = (blog: BlogListResponseDto) => {
    Modal.info({
      title: blog.title,
      width: 800,
      content: (
        <div>
          <Paragraph>
            <Text strong>Tác giả:</Text> {blog.authorName}
          </Paragraph>
          <Paragraph>
            <Text strong>Danh mục:</Text> {blog.categoryName}
          </Paragraph>
          <Paragraph>
            <Text strong>Trạng thái:</Text>{" "}
            <Tag color={blog.isPublished ? "green" : "orange"}>
              {blog.isPublished ? "Đã xuất bản" : "Bản nháp"}
            </Tag>
          </Paragraph>
          <Paragraph>
            <Text strong>Lượt xem:</Text> {blog.viewCount}
          </Paragraph>
          <Paragraph>
            <Text strong>Lượt thích:</Text> {blog.likeCount}
          </Paragraph>
          <Paragraph>
            <Text strong>Bình luận:</Text> {blog.commentCount}
          </Paragraph>
          <Paragraph>
            <Text strong>Tóm tắt:</Text> {blog.summary}
          </Paragraph>
          <Paragraph>
            <Text strong>Ngày tạo:</Text> {new Date(blog.createdDate).toLocaleDateString()}
          </Paragraph>
          {blog.publishedDate && (
            <Paragraph>
              <Text strong>Ngày xuất bản:</Text> {new Date(blog.publishedDate).toLocaleDateString()}
            </Paragraph>
          )}
        </div>
      ),
    });
  };

  const handleDelete = async (id: number) => {
    const success = await deleteBlog(id);
    if (success) {
      message.success("Đã xóa bài viết thành công!");
      updateQuery(blogQuery);
    }
  };

  const handleSubmit = async (values: any) => {
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      Modal.error({
        title: "Lỗi validation",
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
          isPublished: values.status === "published",
          isFeatured: values.isFeatured || false,
          categoryId: values.categoryId
        };

        const result = await updateBlog(editingBlog.id, updateData);
        if (result) {
          message.success("Đã cập nhật bài viết thành công!");
          setIsModalVisible(false);
          setHasChanges(false);
          form.resetFields();
          updateQuery(blogQuery);
        }
      } else {
        // Create new blog
        const createData: CreateBlogDto = {
          title: values.title.trim(),
          content: values.content.trim(),
          summary: values.excerpt.trim() || generateExcerpt(values.content),
          featuredImageUrl: previewImage || values.featuredImage,
          isPublished: values.status === "published",
          isFeatured: values.isFeatured || false,
          categoryId: values.categoryId
        };

        const result = await createBlog(createData);
        if (result) {
          message.success("Đã thêm bài viết mới thành công!");
          setIsModalVisible(false);
          setHasChanges(false);
          form.resetFields();
          updateQuery(blogQuery);
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu bài viết!");
      console.error("Submit error:", error);
    }
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    const values = form.getFieldsValue();
    values.status = "draft";
    await handleSubmit(values);
  };

  // Handle publish
  const handlePublish = async () => {
    const values = form.getFieldsValue();
    values.status = "published";
    values.publishDate = values.publishDate || new Date();
    await handleSubmit(values);
  };

  const statsData = [
    {
      title: "Tổng bài viết",
      value: pagination.totalCount,
      icon: <FileTextOutlined style={{ color: "#1890ff" }} />,
    },
    {
      title: "Đã xuất bản",
      value: blogs.filter((blog) => blog.isPublished).length,
      icon: <FileTextOutlined style={{ color: "#52c41a" }} />,
    },
    {
      title: "Bản nháp",
      value: blogs.filter((blog) => !blog.isPublished).length,
      icon: <FileTextOutlined style={{ color: "#faad14" }} />,
    },
    {
      title: "Tổng lượt xem",
      value: blogs.reduce((total, blog) => total + blog.viewCount, 0),
      icon: <EyeOutlined style={{ color: "#722ed1" }} />,
    },
  ];

  return (
    <div className="blog-admin">
      <div className="blog-header">
        <Title level={2}>
          <FileTextOutlined /> Quản lý Blog
        </Title>
        <Paragraph>
          Quản lý các bài viết blog, tạo nội dung mới và theo dõi hiệu suất.
        </Paragraph>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statsData.map((stat, index) => (
          <Col xs={12} sm={12} md={6} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Action Bar */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Input
              placeholder="Tìm kiếm bài viết..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="large"
            >
              Thêm bài viết mới
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
          dataSource={blogs}
          rowKey="id"
          loading={blogsLoading}
          pagination={{
            current: pagination.pageNumber,
            pageSize: pagination.pageSize,
            total: pagination.totalCount,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bài viết`,
            onChange: (page, pageSize) => {
              const newQuery = { ...blogQuery, page, pageSize };
              setBlogQuery(newQuery);
              updateQuery(newQuery);
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
              {editingBlog ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {lastSaved && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <CheckOutlined style={{ color: "#52c41a", marginRight: 4 }} />
                  Lần cuối lưu: {lastSaved.toLocaleTimeString()}
                </Text>
              )}
              <Tooltip title="Tự động lưu">
                <Switch
                  checked={autoSaveEnabled}
                  onChange={setAutoSaveEnabled}
                  size="small"
                />
              </Tooltip>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          if (hasChanges) {
            Modal.confirm({
              title: "Bạn có muốn thoát?",
              content: "Có thay đổi chưa được lưu. Bạn có chắc chắn muốn thoát?",
              onOk: () => setIsModalVisible(false),
            });
          } else {
            setIsModalVisible(false);
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
          initialValues={editingBlog ? {
            title: editingBlog.title,
            content: "", // Content needs to be fetched separately
            excerpt: editingBlog.summary || "",
            author: editingBlog.authorName,
            category: editingBlog.categoryName,
            status: editingBlog.isPublished ? "published" : "draft",
            tags: "", // Tags are not available in BlogListResponseDto
            publishDate: editingBlog.publishedDate ? dayjs(editingBlog.publishedDate) : null,
            featuredImage: editingBlog.featuredImageUrl || "",
          } : {
            status: "draft",
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
                    Chỉnh sửa
                    {hasChanges && <span style={{ color: "#ff4d4f" }}> *</span>}
                  </span>
                ),
                children: (
                  <div>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[
                          { required: true, message: "Vui lòng nhập tiêu đề!" },
                          { min: 10, message: "Tiêu đề phải có ít nhất 10 ký tự!" }
                        ]}
                      >
                        <Input 
                          placeholder="Nhập tiêu đề bài viết" 
                          showCount
                          maxLength={100}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Danh mục"
                        name="categoryId"
                        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                        help={categoriesError ? `Lỗi tải danh mục: ${categoriesError}` : undefined}
                        validateStatus={categoriesError ? "error" : undefined}
                      >
                        <Select 
                          placeholder={categoriesError ? "Không thể tải danh mục" : "Chọn danh mục"} 
                          loading={categoriesLoading}
                          disabled={!!categoriesError}
                        >
                          {categories.map((category) => (
                            <Option key={category.id} value={category.id}>
                              {category.name}
                            </Option>
                          ))}
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
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                      >
                        <Select>
                          <Option value="draft">
                            <Tag color="orange">Bản nháp</Tag>
                          </Option>
                          <Option value="published">
                            <Tag color="green">Đã xuất bản</Tag>
                          </Option>
                          <Option value="archived">
                            <Tag color="red">Đã lưu trữ</Tag>
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Ngày xuất bản" name="publishDate">
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Tags" name="tags">
                    <Input 
                      placeholder="Nhập tags, phân cách bằng dấu phẩy"
                      suffix={<Text type="secondary" style={{ fontSize: 12 }}>VD: sách, giáo dục</Text>}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Tóm tắt"
                    name="excerpt"
                    rules={[{ required: true, message: "Vui lòng nhập tóm tắt!" }]}
                  >
                    <TextArea 
                      rows={3} 
                      placeholder="Nhập tóm tắt ngắn gọn về bài viết"
                      showCount
                      maxLength={300}
                    />
                  </Form.Item>

<Form.Item
  label={
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>Nội dung</span>
      <Button
        type="link"
        size="small"
        onClick={() => {
          const content = form.getFieldValue("content");
          if (content && !form.getFieldValue("excerpt")) {
            // Strip HTML tags for excerpt generation
            const textContent = content.replace(/<[^>]*>/g, '');
            form.setFieldsValue({ excerpt: generateExcerpt(textContent) });
            message.success("Đã tự động tạo tóm tắt!");
          }
        }}
      >
        Tự động tạo tóm tắt
      </Button>
    </div>
  }
  name="content"
  rules={[
    { required: true, message: "Vui lòng nhập nội dung!" },
    { 
      validator: (_, value) => {
        if (!value) return Promise.resolve();
        const textContent = value.replace(/<[^>]*>/g, '');
        if (textContent.length < 50) {
          return Promise.reject(new Error("Nội dung phải có ít nhất 50 ký tự!"));
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
      placeholder="Nhập nội dung chi tiết của bài viết..."
      style={{ height: '250px' }}
      value={form.getFieldValue("content") || ""}
      onChange={(content) => {
        form.setFieldsValue({ content });
        setHasChanges(true);
      }}
    />
  </div>
</Form.Item>

                  <Form.Item label="Ảnh đại diện" name="featuredImage">
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
                                {uploading ? "Đang tải..." : "Tải ảnh lên"}
                              </div>
                            </div>
                          )}
                        </Upload>
                      </Col>
                      <Col span={12}>
                        <div style={{ padding: 8, background: "#f5f5f5", borderRadius: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            • Định dạng: JPG, PNG, GIF, WEBP<br/>
                            • Không giới hạn kích thước file<br/>
                            • Không giới hạn kích thước ảnh
                          </Text>
                        </div>
                      </Col>
                    </Row>
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                    <Space>
                      <Button onClick={() => setIsModalVisible(false)}>
                        <CloseOutlined /> Hủy
                      </Button>
                      <Button onClick={handleSaveDraft}>
                        <SaveOutlined /> Lưu bản nháp
                      </Button>
                      <Button type="primary" onClick={handlePublish}>
                        <CheckOutlined /> Xuất bản
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
                  Xem trước
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
                       : "Chưa xuất bản";
                     
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
                             {values.title || "Tiêu đề bài viết"}
                           </Title>
                           <div style={{ marginBottom: 16 }}>
                             <Space split={<span style={{ color: "#d9d9d9" }}>|</span>}>
                               <Text type="secondary">
                                 <UserOutlined /> {values.author || "Tác giả"}
                               </Text>
                               <Text type="secondary">
                                 <CalendarOutlined /> {displayDate}
                               </Text>
                               <Text type="secondary">
                                 <ClockCircleOutlined /> {readingTime} phút đọc
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
                             <Text strong>{values.excerpt || "Tóm tắt bài viết..."}</Text>
                           </Paragraph>
                           <div 
                             style={{ 
                               whiteSpace: "pre-wrap", 
                               lineHeight: 1.8,
                               fontSize: 16 
                             }}
                           >
                             {values.content || "Nội dung bài viết sẽ hiển thị ở đây..."}
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

