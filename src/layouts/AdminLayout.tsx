import React, {useEffect, useState} from "react";
import { Layout, Menu, theme, Avatar, Dropdown, Space } from "antd";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  ProductOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  FileTextOutlined

} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {UsersResponseDto} from "../@type/UserResponseDto";
import {getProfile} from "../api/profile.api";

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [userProfile, setUserProfile] = useState<UsersResponseDto | null>(null);

  // Lấy path hiện tại để highlight menu item
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "1";
    if (path.includes("/admin/users")) return "2";
    if (path.includes("/admin/products")) return "3";
    if (path.includes("/admin/product")) return "4";
    if (path.includes("/admin/orders")) return "5";
    if (path.includes("/admin/coupons")) return "6";
    if (path.includes("/admin/faqs")) return "7";
    if (path.includes("/admin/blog")) return "8";
    if (path.includes("/admin/reviews")) return "9";
    return "1";
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.success && res.data) {
          setUserProfile(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Manage Users</Link>,
    },
    {
      key: "3",
      icon: <ProductOutlined />,
      label: <Link to="/admin/products">Manage Products</Link>,
    },
    {
      key: "4",
      icon: <ShopOutlined />,
      label: <Link to="/admin/productAttributes">Product Attributes</Link>,
    },
    {
      key: "5",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/admin/orders">Manage Orders</Link>,
    },
    {
      key: "6",
      icon: <GiftOutlined />,
      label: <Link to="/admin/coupons">Manage Coupons</Link>,
    },
    {
      key: "7",
      icon: <QuestionCircleOutlined />,
      label: <Link to="/admin/faqs">Manage FAQs</Link>,
    },
    {
      key: "8",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/blog">Manage Blog</Link>,
    },

    {
      key: "9",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/reviews">Manage Reviews</Link>,
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Back to Home",
      onClick: () => navigate("/"),
    },
    {
      type: "divider",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Log out",
      danger: true,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider 
        theme="dark" 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
        width={250}
      >
        <div style={{ 
          height: 64, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          borderBottom: "1px solid #434343"
        }}>
          {collapsed ? (
            <QuestionCircleOutlined style={{ fontSize: 24, color: "#fff" }} />
          ) : (
            <h2 style={{ color: "#fff", margin: 0, fontSize: 18 }}>Shradha Book Store Admin</h2>
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{ borderRight: 0, marginTop: 16 }}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: colorBgContainer, 
          padding: "0 24px",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          zIndex: 1
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18, marginRight: 16 }
            })}
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
              Admin
            </h2>
          </div>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                  size="large"
                  src={userProfile?.avatarUrl || undefined} // nếu avatarUrl undefined/null thì icon sẽ hiển thị
                  icon={!userProfile?.avatarUrl && <UserOutlined />}
                  style={{ backgroundColor: !userProfile?.avatarUrl ? "#1890ff" : undefined }}
              />
              {!collapsed && (
                  <span style={{ fontWeight: 500 }}>
        {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "Admin User"}
      </span>
              )}
            </Space>
          </Dropdown>


        </Header>
        
        <Content
          style={{
            margin: "24px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: 8,
            overflow: "auto"
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;