import React from "react";
import { Layout, Row, Col, Typography, Divider, Button } from "antd";
import {
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
    LinkedinOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    HeartFilled,
    ArrowUpOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: "About Us", path: "/about" },
            { label: "Blog", path: "/blog" },
            { label: "FAQs", path: "/faqs" },
        ],
        support: [
            { label: "Help Center", path: "/contact" },
            { label: "Returns", path: "/returns" },
            { label: "Size Guide", path: "/size-guide" },
        ],
        legal: [
            { label: "Privacy Policy", path: "/privacy" },
            { label: "Terms of Service", path: "/terms" },
            { label: "Shipping Policy", path: "/shipping" },
        ],
        categories: [
            { label: "Books", path: "/shop?category=BOOKS" },
            { label: "Stationery", path: "/shop?category=STATIONERY" },
            { label: "DVD", path: "/shop?category=DVD" },
            { label: "Magazine", path: "/shop?category=MAGAZINE" },
        ],
    };

    const socialLinks = [
        { icon: <FacebookOutlined />, url: "https://facebook.com", color: "#1877f2" },
        { icon: <TwitterOutlined />, url: "https://twitter.com", color: "#1da1f2" },
        { icon: <InstagramOutlined />, url: "https://instagram.com", color: "#e4405f" },
        { icon: <LinkedinOutlined />, url: "https://linkedin.com", color: "#0077b5" },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerStyle: React.CSSProperties = {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        padding: "0",
        marginTop: "auto",
        position: "relative",
        overflow: "hidden",
    };

    const backgroundPattern: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.03) 0%, transparent 50%)`,
        backgroundSize: "200px 200px",
    };

    const linkStyle: React.CSSProperties = {
        color: "rgba(255, 255, 255, 0.8)",
        textDecoration: "none",
        transition: "all 0.2s ease",
        cursor: "pointer",
        fontSize: "13px",
        display: "block",
        padding: "4px 0",
    };

    return (
        <AntFooter style={footerStyle}>
            <div style={backgroundPattern} />

            {/* Back to top button */}
            <Button
                type="primary"
                shape="circle"
                icon={<ArrowUpOutlined />}
                onClick={scrollToTop}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    zIndex: 1000,
                    background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(255, 107, 107, 0.4)",
                }}
            />

            <div style={{
                position: "relative",
                zIndex: 2,
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "40px 20px 0",
            }}>
                <Row gutter={[32, 24]}>
                    {/* Brand Section */}
                    <Col xs={24} sm={24} md={8}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 16,
                                cursor: "pointer",
                                transition: "transform 0.2s ease",
                            }}
                            onClick={() => navigate('/')}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                }}
                            >
                                S
                            </div>
                            <span style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginLeft: '8px',
                                letterSpacing: '-0.5px',
                            }}>
                                SHRADHA
                            </span>
                        </div>

                        <Text style={{
                            color: "rgba(255, 255, 255, 0.85)",
                            lineHeight: 1.6,
                            fontSize: "14px",
                            display: "block",
                            marginBottom: "16px"
                        }}>
                            Quality books and study supplies that inspire learning and creativity.
                        </Text>

                        {/* Contact Info */}
                        <div style={{ marginBottom: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <MailOutlined style={{ color: "#1890ff" }} />
                                <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "13px" }}>
                                    hello@shradha.com
                                </Text>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <PhoneOutlined style={{ color: "#1890ff" }} />
                                <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "13px" }}>
                                    +84 (028) 123-4567
                                </Text>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <EnvironmentOutlined style={{ color: "#1890ff" }} />
                                <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "13px" }}>
                                    District 1, Ho Chi Minh City
                                </Text>
                            </div>
                        </div>
                    </Col>

                    {/* Links Sections */}
                    <Col xs={12} sm={6} md={4}>
                        <Title level={5} style={{ color: "#fff", fontSize: "16px", fontWeight: 600, marginBottom: 12 }}>
                            Company
                        </Title>
                        <div>
                            {footerLinks.company.map((link, index) => (
                                <Link
                                    key={index}
                                    onClick={() => navigate(link.path)}
                                    style={linkStyle}
                                    onMouseEnter={(e) => {
                                        (e.target as HTMLElement).style.color = "#fff";
                                        (e.target as HTMLElement).style.paddingLeft = "4px";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.target as HTMLElement).style.color = "rgba(255, 255, 255, 0.8)";
                                        (e.target as HTMLElement).style.paddingLeft = "0";
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </Col>

                    <Col xs={12} sm={6} md={4}>
                        <Title level={5} style={{ color: "#fff", fontSize: "16px", fontWeight: 600, marginBottom: 12 }}>
                            Categories
                        </Title>
                        <div>
                            {footerLinks.categories.map((link, index) => (
                                <Link
                                    key={index}
                                    onClick={() => navigate(link.path)}
                                    style={linkStyle}
                                    onMouseEnter={(e) => {
                                        (e.target as HTMLElement).style.color = "#fff";
                                        (e.target as HTMLElement).style.paddingLeft = "4px";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.target as HTMLElement).style.color = "rgba(255, 255, 255, 0.8)";
                                        (e.target as HTMLElement).style.paddingLeft = "0";
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </Col>

                    <Col xs={12} sm={6} md={4}>
                        <Title level={5} style={{ color: "#fff", fontSize: "16px", fontWeight: 600, marginBottom: 12 }}>
                            Support
                        </Title>
                        <div>
                            {footerLinks.support.map((link, index) => (
                                <Link
                                    key={index}
                                    onClick={() => navigate(link.path)}
                                    style={linkStyle}
                                    onMouseEnter={(e) => {
                                        (e.target as HTMLElement).style.color = "#fff";
                                        (e.target as HTMLElement).style.paddingLeft = "4px";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.target as HTMLElement).style.color = "rgba(255, 255, 255, 0.8)";
                                        (e.target as HTMLElement).style.paddingLeft = "0";
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </Col>

                    <Col xs={12} sm={6} md={4}>
                        <Title level={5} style={{ color: "#fff", fontSize: "16px", fontWeight: 600, marginBottom: 12 }}>
                            Follow Us
                        </Title>
                        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 36,
                                        height: 36,
                                        background: "rgba(255, 255, 255, 0.1)",
                                        borderRadius: "8px",
                                        color: "#fff",
                                        textDecoration: "none",
                                        transition: "all 0.2s ease",
                                        fontSize: "16px",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = social.color;
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>

                        <Title level={5} style={{ color: "#fff", fontSize: "16px", fontWeight: 600, marginBottom: 12 }}>
                            Legal
                        </Title>
                        <div>
                            {footerLinks.legal.map((link, index) => (
                                <Link
                                    key={index}
                                    onClick={() => navigate(link.path)}
                                    style={linkStyle}
                                    onMouseEnter={(e) => {
                                        (e.target as HTMLElement).style.color = "#fff";
                                        (e.target as HTMLElement).style.paddingLeft = "4px";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.target as HTMLElement).style.color = "rgba(255, 255, 255, 0.8)";
                                        (e.target as HTMLElement).style.paddingLeft = "0";
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </Col>
                </Row>

                <Divider style={{ borderColor: "rgba(255, 255, 255, 0.15)", margin: "24px 0 16px" }} />

                {/* Bottom Footer */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                    paddingBottom: "24px",
                }}>
                    <Text style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                    }}>
                        © {currentYear} Shradha Book Store. Made with
                        <HeartFilled style={{ color: "#ff6b6b" }} /> in Vietnam
                    </Text>

                    <div style={{ display: "flex", gap: 16 }}>
                        {["VISA", "MASTERCARD", "PAYPAL"].map((payment) => (
                            <div
                                key={payment}
                                style={{
                                    padding: "4px 8px",
                                    background: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "4px",
                                    color: "#fff",
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                }}
                            >
                                {payment}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AntFooter>
    );
};

export default Footer;