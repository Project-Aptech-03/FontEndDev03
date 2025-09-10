import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
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
  Progress,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  UploadOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  SaveOutlined,
  CloseOutlined,
  PictureOutlined,
  CopyOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "./Blog.css";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  status: "draft" | "published" | "archived";
  tags: string[];
  featuredImage: string;
  publishDate: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

const BlogAdmin: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([
    {
      id: "1",
      title: "Hướng dẫn chọn sách hay cho trẻ em",
      content: "Nội dung bài viết chi tiết về cách chọn sách phù hợp cho trẻ em...",
      excerpt: "Những tiêu chí quan trọng khi chọn sách cho trẻ em",
      author: "Nguyễn Văn A",
      category: "Giáo dục",
      status: "published",
      tags: ["trẻ em", "giáo dục", "sách"],
      featuredImage: "/images/blog1.jpg",
      publishDate: "2024-01-15",
      views: 1250,
      createdAt: "2024-01-15 10:00:00",
      updatedAt: "2024-01-15 10:00:00",
    },
    {
      id: "2",
      title: "Top 10 cuốn sách kinh doanh nên đọc",
      content: "Danh sách những cuốn sách kinh doanh hay nhất...",
      excerpt: "Khám phá những cuốn sách kinh doanh được đánh giá cao",
      author: "Trần Thị B",
      category: "Kinh doanh",
      status: "published",
      tags: ["kinh doanh", "top 10", "bestseller"],
      featuredImage: "/images/blog2.jpg",
      publishDate: "2024-01-20",
      views: 980,
      createdAt: "2024-01-20 14:30:00",
      updatedAt: "2024-01-20 14:30:00",
    },
    {
      id: "3",
      title: "Xu hướng đọc sách trong thời đại số",
      content: "Phân tích xu hướng đọc sách hiện đại...",
      excerpt: "Sự thay đổi trong thói quen đọc sách của người Việt",
      author: "Lê Văn C",
      category: "Xu hướng",
      status: "draft",
      tags: ["xu hướng", "công nghệ", "đọc sách"],
      featuredImage: "/images/blog3.jpg",
      publishDate: "",
      views: 0,
      createdAt: "2024-01-25 09:15:00",
      updatedAt: "2024-01-25 09:15:00",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("edit");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const categories = ["Giáo dục", "Kinh doanh", "Xu hướng", "Văn học", "Khoa học", "Kỹ năng"];

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
      
      setBlogs(prevBlogs => prevBlogs.map((blog) => (blog.id === editingBlog.id ? updatedBlog : blog)));
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
      const formData = {
        title: editingBlog.title,
        content: editingBlog.content,
        excerpt: editingBlog.excerpt,
        author: editingBlog.author,
        category: editingBlog.category,
        status: editingBlog.status,
        tags: editingBlog.tags.join(", "),
        publishDate: editingBlog.publishDate ? dayjs(editingBlog.publishDate) : null,
        featuredImage: editingBlog.featuredImage,
      };
      
      // Sử dụng setTimeout để đảm bảo form đã render
      setTimeout(() => {
        form.setFieldsValue(formData);
        setPreviewImage(editingBlog.featuredImage || "");
        // Update preview data also
        setPreviewData({
          title: editingBlog.title,
          content: editingBlog.content,
          excerpt: editingBlog.excerpt,
          author: editingBlog.author,
          category: editingBlog.category,
          status: editingBlog.status,
          tags: editingBlog.tags.join(", "),
          publishDate: editingBlog.publishDate || "",
          featuredImage: editingBlog.featuredImage || "",
        });
      }, 100);
    }
  }, [editingBlog, isModalVisible, form]);

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
  const handleImageUpload = (info: any) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    
    if (info.file.status === "done") {
      setUploading(false);
      // Giả lập URL ảnh đã upload
      const imageUrl = URL.createObjectURL(info.file.originFileObj);
      setPreviewImage(imageUrl);
      form.setFieldsValue({ featuredImage: imageUrl });
      message.success("Tải ảnh thành công!");
    }
    
    if (info.file.status === "error") {
      setUploading(false);
      message.error("Tải ảnh thất bại!");
    }
  };

  // Validate form before submit
  const validateForm = () => {
    const values = form.getFieldsValue();
    const errors = [];

    if (!values.title?.trim()) errors.push("Tiêu đề không được để trống");
    if (!values.content?.trim()) errors.push("Nội dung không được để trống");
    if (!values.excerpt?.trim()) errors.push("Tóm tắt không được để trống");
    if (!values.author?.trim()) errors.push("Tác giả không được để trống");
    if (!values.category) errors.push("Vui lòng chọn danh mục");

    if (values.title && values.title.length < 10) {
      errors.push("Tiêu đề phải có ít nhất 10 ký tự");
    }

    if (values.content && values.content.length < 50) {
      errors.push("Nội dung phải có ít nhất 50 ký tự");
    }

    return errors;
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

  const columns: ColumnsType<BlogPost> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: "25%",
      render: (text: string, record: BlogPost) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.excerpt}
          </Text>
        </div>
      ),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.title.toLowerCase().includes(value.toString().toLowerCase()) ||
        record.content.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
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
      dataIndex: "category",
      key: "category",
      width: "10%",
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: "Đã xuất bản", value: "published" },
        { text: "Bản nháp", value: "draft" },
        { text: "Đã lưu trữ", value: "archived" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ngày xuất bản",
      dataIndex: "publishDate",
      key: "publishDate",
      width: "12%",
      render: (date: string) => (
        <Space>
          <CalendarOutlined />
          {date || "Chưa xuất bản"}
        </Space>
      ),
    },
    {
      title: "Lượt xem",
      dataIndex: "views",
      key: "views",
      width: "8%",
      render: (views: number) => (
        <Statistic
          value={views}
          valueStyle={{ fontSize: 14 }}
        />
      ),
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: "Thao tác",
      key: "action",
      width: "15%",
      render: (_, record: BlogPost) => (
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

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    
    // Prepare form data với format đúng
    const formData = {
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      author: blog.author,
      category: blog.category,
      status: blog.status,
      tags: blog.tags.join(", "),
      publishDate: blog.publishDate ? dayjs(blog.publishDate) : null,
      featuredImage: blog.featuredImage,
    };
    
    // Set form values
    form.setFieldsValue(formData);
    
    // Reset states
    setActiveTab("edit");
    setPreviewImage(blog.featuredImage || "");
    setHasChanges(false);
    setLastSaved(null);
    
    // Set preview data từ blog đang edit
    setPreviewData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      author: blog.author,
      category: blog.category,
      status: blog.status,
      tags: blog.tags.join(", "),
      publishDate: blog.publishDate || "",
      featuredImage: blog.featuredImage || "",
    });
    
    setIsModalVisible(true);
    
    console.log("Editing blog:", blog);
    console.log("Form data:", formData);
  };

  const handleView = (blog: BlogPost) => {
    Modal.info({
      title: blog.title,
      width: 800,
      content: (
        <div>
          <Paragraph>
            <Text strong>Tác giả:</Text> {blog.author}
          </Paragraph>
          <Paragraph>
            <Text strong>Danh mục:</Text> {blog.category}
          </Paragraph>
          <Paragraph>
            <Text strong>Trạng thái:</Text>{" "}
            <Tag color={getStatusColor(blog.status)}>
              {getStatusText(blog.status)}
            </Tag>
          </Paragraph>
          <Paragraph>
            <Text strong>Tags:</Text> {blog.tags.join(", ")}
          </Paragraph>
          <Paragraph>
            <Text strong>Tóm tắt:</Text> {blog.excerpt}
          </Paragraph>
          <Paragraph>
            <Text strong>Nội dung:</Text>
          </Paragraph>
          <Paragraph>{blog.content}</Paragraph>
        </div>
      ),
    });
  };

  const handleDelete = (id: string) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
    message.success("Đã xóa bài viết thành công!");
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
      const newBlog: BlogPost = {
        id: editingBlog ? editingBlog.id : Date.now().toString(),
        title: values.title.trim(),
        content: values.content.trim(),
        excerpt: values.excerpt.trim() || generateExcerpt(values.content),
        author: values.author.trim(),
        category: values.category,
        status: values.status,
        tags: values.tags ? values.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean) : [],
        featuredImage: previewImage || values.featuredImage || "",
        publishDate: values.publishDate ? values.publishDate.format("YYYY-MM-DD") : "",
        views: editingBlog ? editingBlog.views : 0,
        createdAt: editingBlog ? editingBlog.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingBlog) {
        setBlogs(blogs.map((blog) => (blog.id === editingBlog.id ? newBlog : blog)));
        message.success("Đã cập nhật bài viết thành công!");
      } else {
        setBlogs([...blogs, newBlog]);
        message.success("Đã thêm bài viết mới thành công!");
      }

      setIsModalVisible(false);
      setHasChanges(false);
      form.resetFields();
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

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchText.toLowerCase())
  );

  const statsData = [
    {
      title: "Tổng bài viết",
      value: blogs.length,
      icon: <FileTextOutlined style={{ color: "#1890ff" }} />,
    },
    {
      title: "Đã xuất bản",
      value: blogs.filter((blog) => blog.status === "published").length,
      icon: <FileTextOutlined style={{ color: "#52c41a" }} />,
    },
    {
      title: "Bản nháp",
      value: blogs.filter((blog) => blog.status === "draft").length,
      icon: <FileTextOutlined style={{ color: "#faad14" }} />,
    },
    {
      title: "Tổng lượt xem",
      value: blogs.reduce((total, blog) => total + blog.views, 0),
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
        <Table
          columns={columns}
          dataSource={filteredBlogs}
          rowKey="id"
          pagination={{
            total: filteredBlogs.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bài viết`,
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
        destroyOnClose
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
                 <Form
                   form={form}
                   layout="vertical"
                   onFinish={handleSubmit}
                   onValuesChange={handleFormChange}
                   initialValues={editingBlog ? {
                     title: editingBlog.title,
                     content: editingBlog.content,
                     excerpt: editingBlog.excerpt,
                     author: editingBlog.author,
                     category: editingBlog.category,
                     status: editingBlog.status,
                     tags: editingBlog.tags.join(", "),
                     publishDate: editingBlog.publishDate ? dayjs(editingBlog.publishDate) : null,
                     featuredImage: editingBlog.featuredImage,
                   } : {
                     status: "draft",
                   }}
                 >
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
                        label="Tác giả"
                        name="author"
                        rules={[{ required: true, message: "Vui lòng nhập tên tác giả!" }]}
                      >
                        <Input placeholder="Nhập tên tác giả" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Danh mục"
                        name="category"
                        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                      >
                        <Select placeholder="Chọn danh mục">
                          {categories.map((category) => (
                            <Option key={category} value={category}>
                              {category}
                            </Option>
                          ))}
                        </Select>
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
                              form.setFieldsValue({ excerpt: generateExcerpt(content) });
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
                      { min: 50, message: "Nội dung phải có ít nhất 50 ký tự!" }
                    ]}
                  >
                    <TextArea 
                      rows={12} 
                      placeholder="Nhập nội dung chi tiết của bài viết"
                      showCount
                    />
                  </Form.Item>

                  <Form.Item label="Ảnh đại diện" name="featuredImage">
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
                                {uploading ? "Đang tải..." : "Tải ảnh lên"}
                              </div>
                            </div>
                          )}
                        </Upload>
                      </Col>
                      <Col span={12}>
                        <div style={{ padding: 8, background: "#f5f5f5", borderRadius: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            • Kích thước đề xuất: 800x600px<br/>
                            • Định dạng: JPG, PNG<br/>
                            • Dung lượng tối đa: 2MB
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
                </Form>
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
      </Modal>
    </div>
  );
};

export default BlogAdmin;
