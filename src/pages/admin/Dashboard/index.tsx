// src/pages/admin/Dashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Space,
  Table,
  Tag,
  Spin,
  Alert,
  Typography,
  Divider,
  List,
  Badge,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { ColumnsType } from "antd/lib/table";
import { format } from "date-fns";
import {getProducts} from "../../../api/products.api";
import {getAllUsers} from "../../../api/user.api";

const { Title, Text } = Typography;

type ProductDto = {
  id: number;
  productCode?: string;
  productName: string;
  description?: string;
  author?: string;
  productType?: string;
  pages?: number | null;
  weight?: number | null;
  price?: number;
  stockQuantity: number;
  isActive?: boolean;
  createdDate?: string;
  category?: {
    id: number;
    categoryCode?: string;
    categoryName: string;
    productCount?: number;
    subCategories?: any[];
  } | null;
  manufacturer?: {
    id: number;
    manufacturerName?: string;
  } | null;
  photos?: Array<{ id: number; photoUrl: string }>;
};

type PagedResultProducts = {
  items: ProductDto[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
};

type UserDto = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: string;
  phoneNumber?: string;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  address?: string;
};

type PagedResultUsers = {
  items: UserDto[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
};

const currency = (v?: number) =>
    v !== undefined && v !== null ? `$${v.toFixed(2)}` : "-";

const shortDate = (s?: string) =>
    s ? format(new Date(s), "yyyy-MM-dd HH:mm") : "-";
const Dashboard: React.FC = () => {
  // API states
  const [productData, setProductData] = useState<PagedResultProducts | null>(
      null
  );
  const [userData, setUserData] = useState<PagedResultUsers | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setError(null);
      setLoadingProducts(true);
      setLoadingUsers(true);
      try {
        // get many products (tùy chỉnh pageSize nếu DB lớn)
        const pRes = await getProducts(1, 100);

        const pPayload: PagedResultProducts =
            (pRes?.data as any)?.items ? (pRes.data as any) : (pRes as any);

        const uRes = await getAllUsers(1, 1000);
        const uPayload: PagedResultUsers =
            (uRes?.data as any)?.items ? (uRes.data as any) : (uRes as any);

        if (!mounted) return;
        setProductData(pPayload);
        setUserData(uPayload);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(
            err?.response?.data?.message ||
            err?.message ||
            "Không thể tải dữ liệu thống kê"
        );
      } finally {
        if (mounted) {
          setLoadingProducts(false);
          setLoadingUsers(false);
        }
      }
    };

    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  const loading = loadingProducts || loadingUsers;

  /* -----------------------
     KPI values
     ----------------------- */
  const totalUsers = userData?.totalCount ?? 0;
  const totalProducts = productData?.totalCount ?? 0;

  const lowStockProducts = useMemo(() => {
    if (!productData?.items) return [];
    return productData.items.filter((p) => p.stockQuantity < 10);
  }, [productData]);

  const recentUsers = useMemo(() => {
    if (!userData?.items) return [];
    // assume list already sorted by created date; otherwise sort if createdDate exist
    return userData.items.slice(0, 6);
  }, [userData]);

  const recentProducts = useMemo(() => {
    if (!productData?.items) return [];
    const sorted = [...productData.items].sort((a, b) => {
      const da = new Date(a.createdDate || 0).getTime();
      const db = new Date(b.createdDate || 0).getTime();
      return db - da;
    });
    return sorted.slice(0, 6);
  }, [productData]);
  const usersByRoleData = useMemo(() => {
    const map: Record<string, number> = {};
    (userData?.items || []).forEach((u) => {
      const r = u.role || "User";
      map[r] = (map[r] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [userData]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00a3ff"];
  const productsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    (productData?.items || []).forEach((p) => {
      const cat = p.category?.categoryName || "Khác";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
  }, [productData]);
  const productCreationTrend = useMemo(() => {
    const dayMap: Record<string, number> = {};
    (productData?.items || []).forEach((p) => {
      const d = p.createdDate ? format(new Date(p.createdDate), "yyyy-MM-dd") : null;
      if (!d) return;
      dayMap[d] = (dayMap[d] || 0) + 1;
    });
    const entries = Object.entries(dayMap)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30); // recent 30 days
    return entries;
  }, [productData]);

  const userColumns: ColumnsType<UserDto> = [
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (_: any, record) => (
          <div>
            <div style={{ fontWeight: 600 }}>{record.fullName || `${record.firstName || ""} ${record.lastName || ""}`}</div>
            <div style={{ color: "#888" }}>{record.email}</div>
          </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (r) => <Tag color={r === "Admin" ? "red" : "blue"}>{r}</Tag>,
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
  ];

  const productColumns: ColumnsType<ProductDto> = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (_: any, record) => (
          <Space>
            {record.photos && record.photos.length > 0 && (
                <img
                    src={record.photos[0].photoUrl}
                    alt={record.productName}
                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4 }}
                />
            )}
            <div>
              <div style={{ fontWeight: 600 }}>{record.productName}</div>
              <div style={{ color: "#888" }}>{record.productCode}</div>
            </div>
          </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: ["category", "categoryName"],
      key: "category",
      render: (c) => <Tag>{c || "Khác"}</Tag>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (p) => <Text strong>{currency(p)}</Text>,
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      align: "right",
      render: (q) =>
          q < 10 ? <Badge status="error" text={`${q}`} /> : <Text>{q}</Text>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (d) => shortDate(d),
    },
  ];
  return (
      <div style={{ padding: 24 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 18 }}>
          <Col>
            <Title level={3} style={{ marginBottom: 0 }}>
              Admin Dashboard
            </Title>
            <Text type="secondary">Tổng quan hệ thống</Text>
          </Col>
        </Row>

        {error && (
            <Alert
                message="Lỗi khi tải dữ liệu"
                description={error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
            />
        )}

        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                    title="Tổng người dùng"
                    value={totalUsers}
                    valueStyle={{ color: "#3f8600" }}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Người dùng đăng ký trên hệ thống</Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic title="Tổng sản phẩm" value={totalProducts} />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Sản phẩm có trong kho</Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                    title="Tồn kho thấp"
                    value={lowStockProducts.length}
                    valueStyle={{ color: "#cf1322" }}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Sản phẩm có  10 units</Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                    title="Người dùng mới (hiển thị)"
                    value={recentUsers.length}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Người dùng mới (top hiển thị)</Text>
                </div>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Người dùng theo Role" style={{ height: 360 }}>
                {usersByRoleData.length === 0 ? (
                    <div style={{ textAlign: "center", paddingTop: 60 }}>
                      <Text type="secondary">Không có dữ liệu</Text>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                            dataKey="value"
                            data={usersByRoleData}
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            label
                        >
                          {usersByRoleData.map((entry, index) => (
                              <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                              />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Sản phẩm theo danh mục (Top 10)" style={{ height: 360 }}>
                {productsByCategory.length === 0 ? (
                    <div style={{ textAlign: "center", paddingTop: 60 }}>
                      <Text type="secondary">Không có dữ liệu</Text>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={productsByCategory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" hide={false} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                )}
              </Card>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Xu hướng tạo sản phẩm (30 ngày gần nhất)">
                {productCreationTrend.length === 0 ? (
                    <div style={{ textAlign: "center", paddingTop: 40 }}>
                      <Text type="secondary">Không có dữ liệu lịch sử</Text>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={productCreationTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                )}
              </Card>

              <Divider />

              <Card title="Danh sách sản phẩm mới nhất">
                <Table
                    rowKey={(r) => r.id}
                    dataSource={recentProducts}
                    columns={productColumns}
                    pagination={false}
                    locale={{ emptyText: "Không có sản phẩm" }}
                />
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="Người dùng mới nhất">
                <List
                    itemLayout="horizontal"
                    dataSource={recentUsers}
                    renderItem={(u) => (
                        <List.Item>
                          <List.Item.Meta
                              avatar={
                                u.avatarUrl ? (
                                    <img
                                        src={u.avatarUrl}
                                        alt={u.fullName}
                                        style={{
                                          width: 40,
                                          height: 40,
                                          borderRadius: 6,
                                          objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                          width: 40,
                                          height: 40,
                                          borderRadius: 6,
                                          background: "#f0f0f0",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          color: "#999",
                                          fontWeight: 600,
                                        }}
                                    >
                                      {u.fullName ? u.fullName[0] : "U"}
                                    </div>
                                )
                              }
                              title={<div style={{ fontWeight: 600 }}>{u.fullName}</div>}
                              description={
                                <>
                                  <div>{u.email}</div>
                                  <div style={{ color: "#888" }}>{u.role}</div>
                                </>
                              }
                          />
                        </List.Item>
                    )}
                />
                <Divider />
                <Card type="inner" title="Tồn kho thấp">
                  <List
                      dataSource={lowStockProducts.slice(0, 6)}
                      renderItem={(p) => (
                          <List.Item>
                            <List.Item.Meta
                                avatar={
                                  p.photos && p.photos.length > 0 ? (
                                      <img
                                          src={p.photos[0].photoUrl}
                                          alt={p.productName}
                                          style={{
                                            width: 48,
                                            height: 48,
                                            objectFit: "cover",
                                            borderRadius: 4,
                                          }}
                                      />
                                  ) : null
                                }
                                title={<div style={{ fontWeight: 600 }}>{p.productName}</div>}
                                description={
                                  <>
                                    <div>{p.category?.categoryName}</div>
                                    <div style={{ color: "#cf1322" }}>
                                      Tồn kho: {p.stockQuantity}
                                    </div>
                                  </>
                                }
                            />
                          </List.Item>
                      )}
                  />
                </Card>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
  );
};

export default Dashboard;
