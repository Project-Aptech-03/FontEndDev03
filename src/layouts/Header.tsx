import React from "react";
import { Menu, Layout } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { key: "/", label: "Home" },
    { key: "/shop", label: "Shop" },
    { key: "/about", label: "About" },
    { key: "/contact", label: "Contact" },
  ];

  return (
    <AntHeader
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "0 40px",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <img
          src="https://via.placeholder.com/40"
          alt="Logo"
          style={{ marginRight: 8 }}
        />
        <span style={{ fontSize: 20, fontWeight: 700 }}>MOON.</span>
      </div>

      {/* Menu */}
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={(e) => navigate(e.key)}
        style={{ flex: 1, justifyContent: "center", borderBottom: "none" }}
      />

      {/* Icons */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <SearchOutlined style={{ fontSize: 20 }} />
        <UserOutlined style={{ fontSize: 20 }} />
        <HeartOutlined style={{ fontSize: 20 }} />
        <ShoppingCartOutlined
          style={{ fontSize: 20, cursor: "pointer" }}
          onClick={() => navigate("/cart")}
        />
      </div>
    </AntHeader>
  );
};

export default Header;
