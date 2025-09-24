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
  Line,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { ColumnsType } from "antd/lib/table";
import { format, subDays, } from "date-fns";
import {getProducts} from "../../../api/products.api";
import {getAllUsers} from "../../../api/user.api";
import {getAllOrders} from "../../../api/orders.api";
import {useNavigate} from "react-router-dom"; // Import orders API

const { Title, Text } = Typography;

const currency = (v?: number) =>
    v !== undefined && v !== null ? `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-";

const shortDate = (s?: string) =>
    s ? format(new Date(s), "yyyy-MM-dd HH:mm") : "-";

const Dashboard: React.FC = () => {
  // API states
  const [productData, setProductData] = useState<PagedResultProducts | null>(null);
  const [userData, setUserData] = useState<PagedResultUsers | null>(null);
  const [orderData, setOrderData] = useState<ApiOrder[] | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setError(null);
      setLoadingProducts(true);
      setLoadingUsers(true);
      setLoadingOrders(true);

      try {
        // Fetch products
        const pRes = await getProducts(1, 100);
        const pPayload: PagedResultProducts =
            (pRes?.data as any)?.items ? (pRes.data as any) : (pRes as any);

        // Fetch users
        const uRes = await getAllUsers(1, 1000);
        const uPayload: PagedResultUsers =
            (uRes?.data as any)?.items ? (uRes.data as any) : (uRes as any);

        // Fetch orders
        const oRes = await getAllOrders();
        let oPayload: ApiOrder[] = [];
        if (oRes.success && oRes.result) {
          oPayload = oRes.result.data || oRes.result || [];
        }

        if (!mounted) return;
        setProductData(pPayload);
        setUserData(uPayload);
        setOrderData(oPayload);
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
          setLoadingOrders(false);
        }
      }
    };

    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  const loading = loadingProducts || loadingUsers || loadingOrders;

  /* -----------------------
     KPI values
     ----------------------- */
  const totalUsers = userData?.totalCount ?? 0;
  const totalProducts = productData?.totalCount ?? 0;
  const totalOrders = orderData?.length ?? 0;

  // Revenue calculations
  const totalRevenue = useMemo(() => {
    if (!orderData) return 0;
    return orderData
        .filter(order => order.orderStatus === 'Completed' || order.orderStatus === 'Delivered')
        .reduce((sum, order) => sum + order.totalAmount, 0);
  }, [orderData]);

  const pendingOrders = useMemo(() => {
    if (!orderData) return 0;
    return orderData.filter(order => order.orderStatus === 'Pending').length;
  }, [orderData]);

  const todayRevenue = useMemo(() => {
    if (!orderData) return 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    return orderData
        .filter(order => {
          const orderDate = format(new Date(order.orderDate), 'yyyy-MM-dd');
          return orderDate === today && (order.orderStatus === 'Completed' || order.orderStatus === 'Delivered');
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);
  }, [orderData]);

  const lowStockProducts = useMemo(() => {
    if (!productData?.items) return [];
    return productData.items.filter((p) => p.stockQuantity < 10);
  }, [productData]);

  const recentUsers = useMemo(() => {
    if (!userData?.items) return [];
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

  const recentOrders = useMemo(() => {
    if (!orderData) return [];
    const sorted = [...orderData].sort((a, b) => {
      const da = new Date(a.orderDate).getTime();
      const db = new Date(b.orderDate).getTime();
      return db - da;
    });
    return sorted.slice(0, 6);
  }, [orderData]);

  // Revenue by day (last 30 days)
  const dailyRevenue = useMemo(() => {
    if (!orderData) return [];

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        revenue: 0,
        orders: 0
      };
    });

    orderData
        .filter(order => order.orderStatus === 'Completed' || order.orderStatus === 'Delivered')
        .forEach(order => {
          const orderDate = format(new Date(order.orderDate), 'yyyy-MM-dd');
          const dayData = last30Days.find(d => d.date === orderDate);
          if (dayData) {
            dayData.revenue += order.totalAmount;
            dayData.orders += 1;
          }
        });

    return last30Days;
  }, [orderData]);
  const orderStatusData = useMemo(() => {
    if (!orderData) return [];
    const statusCount: Record<string, number> = {};
    orderData.forEach(order => {
      statusCount[order.orderStatus] = (statusCount[order.orderStatus] || 0) + 1;
    });
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  }, [orderData]);

  const categoryRevenue = useMemo(() => {
    if (!orderData) return [];

    const categoryMap: Record<string, number> = {};

    orderData
        .filter(order => order.orderStatus === 'Completed' || order.orderStatus === 'Delivered')
        .forEach(order => {
          (order.orderItems || []).forEach(item => {
            const category = item.product?.category?.categoryName ?? 'Other';
            const price = Number(item.totalPrice) || 0;
            categoryMap[category] = (categoryMap[category] || 0) + price;
          });
        });

    return Object.entries(categoryMap)
        .map(([category, revenue]) => ({ category, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);
  }, [orderData]);


  const usersByRoleData = useMemo(() => {
    const map: Record<string, number> = {};
    (userData?.items || []).forEach((u) => {
      const r = u.role || "User";
      map[r] = (map[r] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [userData]);
  const COLORSS = [
    "#00a3ff",
    "#ff7f50",
    "#ff4500",
    "#1e90ff",
    "#ff1493"
  ];


  const COLORS = ["#1e90ff","#ffc658", "#ff7f50", "#00a3ff"];

  const productColumns: ColumnsType<ProductDto> = [
    {
      title: "Product",
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
      render: (c) => <Tag>{c || "Other"}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (p) => <Text strong>{currency(p)}</Text>,
    },
    {
      title: "Stock",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      align: "right",
      render: (q) =>
          q < 10 ? <Badge status="error" text={`${q}`} /> : <Text>{q}</Text>,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (d) => shortDate(d),
    },
  ];

  const orderColumns: ColumnsType<ApiOrder> = [
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (orderNumber) => (
          <Text strong style={{ color: "#1890ff" }}>{orderNumber}</Text>
      ),
    },
    {
      title: "Customer",
      dataIndex: ["customer", "fullName"],
      key: "customer",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      render: (amount) => <Text strong>{currency(amount)}</Text>,
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        let color = "default";
        switch (status) {
          case "Completed":
          case "Delivered":
            color = "green";
            break;
          case "Pending":
            color = "orange";
            break;
          case "Cancelled":
            color = "red";
            break;
          default:
            color = "blue";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => shortDate(date),
    },
  ];


  return (
      <div style={{ padding: 24 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 18 }}>
          <Col>
            <Title level={3} style={{ marginBottom: 0 }}>
              Admin Dashboard
            </Title>
            <Text type="secondary">System Overview & Revenue</Text>
          </Col>
        </Row>

        {error && (
            <Alert
                message="Error loading data"
                description={error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
            />
        )}

        <Spin spinning={loading}>
          {/* KPI Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card
                  hoverable
                  onClick={() => navigate("/admin/orders")}
                  style={{ cursor: "pointer" }}
              >
                <Statistic
                    title="Total Revenue"
                    value={totalRevenue}
                    valueStyle={{ color: "#3f8600" }}
                    formatter={(value) => currency(Number(value))}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card
                  hoverable
                  onClick={() => navigate("/admin/orders")}
                  style={{ cursor: "pointer" }}
              >
                <Statistic
                    title="Today's Revenue"
                    value={todayRevenue}
                    valueStyle={{ color: "#1890ff" }}
                    formatter={(value) => currency(Number(value))}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card  hoverable
                     onClick={() => navigate("/admin/orders")}
                     style={{ cursor: "pointer" }}
              >
                <Statistic
                    title="Total Orders"
                    value={totalOrders}
                    valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card
                  hoverable
                  onClick={() => navigate("/admin/orders")}
                  style={{ cursor: "pointer" }}>
                <Statistic
                    title="Pending Orders"
                    value={pendingOrders}
                    valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card
                  hoverable
                  onClick={() => navigate("/admin/users")}
                  style={{ cursor: "pointer" }}
              >
                <Statistic
                    title="Total Users"
                    value={totalUsers}
                    valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card
                  hoverable
                  onClick={() => navigate("/admin/products")}
                  style={{ cursor: "pointer" }}
              >
                <Statistic title="Total Products" value={totalProducts} />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card
                  hoverable
                  onClick={() => navigate("/admin/products")}
                  style={{ cursor: "pointer" }}
              >
                <Statistic
                    title="Low Stock"
                    value={lowStockProducts.length}
                    valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
          </Row>
          {/* Revenue Charts */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={16}>
              <Card title="Revenue Chart (Last 30 Days)" style={{ height: 400 }}>
                {dailyRevenue.length === 0 ? (
                    <div style={{ textAlign: "center", paddingTop: 60 }}>
                      <Text type="secondary">No revenue data available</Text>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={dailyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => format(new Date(date), "MM/dd")}
                        />
                        <YAxis
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                        />
                        <Tooltip
                            formatter={(value, name) => [
                              name === "revenue" ? currency(Number(value)) : value,
                              name === "revenue" ? "Revenue" : "Orders",
                            ]}
                            labelFormatter={(date) =>
                                format(new Date(date), "MM/dd/yyyy")
                            }
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#1890ff"
                            fill="#1890ff"
                            fillOpacity={0.6}
                            name="Revenue"
                        />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#52c41a"
                            name="Orders"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="Order Status" style={{ height: 400 }}>
                {orderStatusData.length === 0 ? (
                    <div style={{ textAlign: "center", paddingTop: 60 }}>
                      <Text type="secondary">No order data available</Text>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                            dataKey="value"
                            data={orderStatusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, value }) => `${name}: ${value}`}
                        >
                          {orderStatusData.map((entry, index) => (
                              <Cell
                                  key={`cell-${index}`}
                                  fill={COLORSS[index % COLORS.length]}
                              />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                )}
              </Card>
            </Col>
          </Row>

          {/* Category Revenue */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card title="Revenue by Category" style={{ height: 360 }}>
                {categoryRevenue.length === 0 ? (
                    <div style={{ textAlign: "center", paddingTop: 60 }}>
                      <Text type="secondary">No revenue data available</Text>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryRevenue} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                        />
                        <YAxis dataKey="category" type="category" width={150} />
                        <Tooltip formatter={(value) => [currency(Number(value)), "Revenue"]} />
                        <Bar dataKey="revenue" fill="#52c41a" />
                      </BarChart>
                    </ResponsiveContainer>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Users by Role" style={{ height: 360 }}>
                {usersByRoleData.length === 0 ? (
                    <div style={{ textAlign: "center", paddingTop: 60 }}>
                      <Text type="secondary">No data available</Text>
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
          </Row>

          {/* Data Tables */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Recent Orders" style={{ marginBottom: 16 }}>
                <Table
                    rowKey={(r) => r.id}
                    dataSource={recentOrders}
                    columns={orderColumns}
                    pagination={false}
                    locale={{ emptyText: "No orders" }}
                />
              </Card>

              <Card title="Latest Products">
                <Table
                    rowKey={(r) => r.id}
                    dataSource={recentProducts}
                    columns={productColumns}
                    pagination={false}
                    locale={{ emptyText: "No products" }}
                />
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="Latest Users" style={{ marginBottom: 16 }}>
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
              </Card>

              <Card title="Low Stock">
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
                                    Stock: {p.stockQuantity}
                                  </div>
                                </>
                              }
                          />
                        </List.Item>
                    )}
                />
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
  );
};

export default Dashboard;