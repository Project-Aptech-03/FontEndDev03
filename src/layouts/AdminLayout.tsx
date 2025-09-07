import React, { useState } from "react";
import { Layout, Menu, theme, Avatar, Dropdown, Space } from "antd";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  ProductOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  ShopOutlined,
  TeamOutlined,
  StockOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Lấy path hiện tại để highlight menu item
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "1";
    if (path.includes("/admin/users")) return "2";
    if (path.includes("/admin/products")) return "3";
    if (path.includes("/admin/manufacturers")) return "4";
    if (path.includes("/admin/stocks")) return "5";
    if (path.includes("/admin/faqs")) return "6";
    if (path.includes("/admin/blog")) return "7";
    return "1";
  };

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Quản lý Users</Link>,
    },
    {
      key: "3",
      icon: <ProductOutlined />,
      label: <Link to="/admin/products">Quản lý Products</Link>,
    },
    {
      key: "4",
      icon: <ShopOutlined />,
      label: <Link to="/admin/manufacturers">Quản lý Manufacturers</Link>,
    },
    {
      key: "5",
      icon: <StockOutlined />,
      label: <Link to="/admin/stocks">Quản lý Stocks</Link>,
    },
    {
      key: "6",
      icon: <QuestionCircleOutlined />,
      label: <Link to="/admin/faqs">Quản lý FAQs</Link>,
    },
    {
      key: "7",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/blog">Quản lý Blog</Link>,
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
    {
      type: "divider",
    },
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Về trang chủ",
      onClick: () => navigate("/"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
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
            <h2 style={{ color: "#fff", margin: 0, fontSize: 18 }}>ADMIN PANEL</h2>
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
              Trang Quản Trị
            </h2>
          </div>
          
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar 
                size="large" 
                icon={<UserOutlined />} 
                style={{ backgroundColor: "#1890ff" }}
              />
              {!collapsed && (
                <span style={{ fontWeight: 500 }}>Admin User</span>
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