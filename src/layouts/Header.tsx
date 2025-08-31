import {Menu, Layout, Dropdown} from "antd";
import {
    SearchOutlined,
    UserOutlined,
    HeartOutlined,
    ShoppingCartOutlined, LogoutOutlined, LoginOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../routes/AuthContext";
import React from "react";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems = [
        { key: "/", label: "Home" },
        { key: "/shop", label: "Shop" },
        { key: "/about", label: "About Us" },
        { key: "/contact", label: "Contact" },
        { key: "/blog", label: "Blog" },
    ];

    // Menu user với icon
    const userMenuItems = isLoggedIn
        ? [
            {
                key: "profile",
                icon: <UserOutlined />,
                label: "Profile",
                onClick: () => navigate("/profile"),
            },
            {
                key: "logout",
                icon: <LogoutOutlined style={{ color: "red" }} />,
                label: <span style={{ color: "red" }}>Đăng xuất</span>,
                onClick: handleLogout,
            },
        ]
        : [
            {
                key: "login",
                icon: <LoginOutlined />,
                label: "Login",
                onClick: () => navigate("/login"),
            },
            {
                key: "register",
                icon: <UserOutlined />,
                label: "Register",
                onClick: () => navigate("/register"),
            },
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

                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
                    <UserOutlined style={{ fontSize: 20, cursor: "pointer" }} />
                </Dropdown>

                <HeartOutlined
                    style={{ fontSize: 20, cursor: "pointer" }}
                    onClick={() => navigate("/wishlist")}
                />
                <ShoppingCartOutlined
                    style={{ fontSize: 20, cursor: "pointer" }}
                    onClick={() => navigate("/cart")}
                />
            </div>
        </AntHeader>
    );
};

export default Header;
