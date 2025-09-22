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
            { label: "Our Story", path: "/about" },
            { label: "Blog", path: "/blog" },
            { label: "FAQs", path: "/faqs" },
        ],
        support: [
            { label: "Help Center", path: "/contact" },
            { label: "Contact Us", path: "/contact" },
            { label: "Returns", path: "/returns" },
            { label: "Size Guide", path: "/size-guide" },
        ],
        legal: [
            { label: "Privacy Policy", path: "/privacy" },
            { label: "Terms of Service", path: "/terms" },
            { label: "Cookie Policy", path: "/cookies" },
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
        {
            icon: <FacebookOutlined />,
            url: "https://facebook.com",
            color: "#1877f2",
            name: "Facebook"
        },
        {
            icon: <TwitterOutlined />,
            url: "https://twitter.com",
            color: "#1da1f2",
            name: "Twitter"
        },
        {
            icon: <InstagramOutlined />,
            url: "https://instagram.com",
            color: "#e4405f",
            name: "Instagram"
        },
        {
            icon: <LinkedinOutlined />,
            url: "https://linkedin.com",
            color: "#0077b5",
            name: "LinkedIn"
        },
    ];

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
        background: `
      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%),
      linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.02) 50%, transparent 51%)
    `,
        backgroundSize: "200px 200px, 200px 200px, 60px 60px",
    };

    const footerContentStyle: React.CSSProperties = {
        position: "relative",
        zIndex: 2,
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "80px 20px 0",
    };

    const logoStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        marginBottom: 14,
        cursor: "pointer",
    };


    const logoTextStyle: React.CSSProperties = {
        fontSize: '24px',
        fontWeight: 700,
        background: 'linear-gradient(45deg, #1890ff, #722ed1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginLeft: '8px',
        letterSpacing: '-0.5px',
    };

    const sectionTitleStyle: React.CSSProperties = {
        color: "#fff",
        fontSize: "18px",
        fontWeight: 600,
        position: "relative",
    };

    const linkStyle: React.CSSProperties = {
        color: "rgba(255, 255, 255, 0.8)",
        textDecoration: "none",
        transition: "all 0.3s ease",
        cursor: "pointer",
        fontSize: "14px",
        display: "block",
        padding: "8px 0",
        borderRadius: "4px",
        position: "relative",
    };

    const contactItemStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 0",
        borderRadius: "8px",
        transition: "all 0.3s ease",
    };

    const contactIconStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "10px",
        color: "#fff",
        fontSize: "18px",
        backdropFilter: "blur(10px)",
    };

    const paymentStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        padding: "0 16px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        color: "#fff",
        fontSize: "12px",
        fontWeight: "bold",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s ease",
    };

    return (
        <AntFooter style={footerStyle}>
            <div style={backgroundPattern} />

            {/* Back to top button */}
            <Button
                type="primary"
                shape="circle"
                icon={<ArrowUpOutlined />}
                size="large"
                onClick={scrollToTop}
                style={{
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                    zIndex: 1000,
                    background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(255, 107, 107, 0.4)",
                }}
            />

            <div style={footerContentStyle}>
                <Row gutter={[40, 40]}>
                    {/* Brand Section */}
                    <Col xs={24} sm={24} md={12} lg={8}>
                        <div
                            style={logoStyle}
                            onClick={() => navigate('/')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                }}
                            >
                                S
                            </div>
                            <span style={logoTextStyle}>SHRADHA</span>
                        </div>
                        <Text style={{
                            color: "rgba(255, 255, 255, 0.9)",
                            lineHeight: 1.8,
                            fontSize: "16px",
                            display: "block",
                            marginBottom: "15px"
                        }}>
                            Discover the latest trends in books and study supplies – we bring you quality products
                            that inspire and enhance your daily learning and creative experience.
                        </Text>

                        {/* Newsletter Signup */}
                        <div style={{
                            padding: "24px",
                            background: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}>
                            <Title level={5} style={{color: "#fff", marginBottom: 10}}>
                                📚 Stay Updated
                            </Title>
                            <Text style={{color: "rgba(255, 255, 255, 0.8)", fontSize: "14px"}}>
                                Subscribe to get special offers, free giveaways, and educational content.
                            </Text>
                        </div>
                    </Col>

                    {/* Links Sections */}
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Title level={5} style={sectionTitleStyle}>
                            Company
                        </Title>
                        <div>
                            {footerLinks.company.map((link, index) => (
                                <Link
                                    key={index}
                                    onClick={() => navigate(link.path)}
                                    style={linkStyle}
                                    onMouseEnter={(e) => {
                                        const target = e.target as HTMLElement;
                                        target.style.color = "#fff";
                                        target.style.paddingLeft = "8px";
                                        target.style.background = "rgba(255, 255, 255, 0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        const target = e.target as HTMLElement;
                                        target.style.color = "rgba(255, 255, 255, 0.8)";
                                        target.style.paddingLeft = "0";
                                        target.style.background = "transparent";
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </Col>

                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Title level={5} style={sectionTitleStyle}>
                            Categories
                        </Title>
                        <div>
                            {footerLinks.categories.map((link, index) => (
                                <Link
                                    key={index}
                                    onClick={() => navigate(link.path)}
                                    style={linkStyle}
                                    onMouseEnter={(e) => {
                                        const target = e.target as HTMLElement;
                                        target.style.color = "#fff";
                                        target.style.paddingLeft = "8px";
                                        target.style.background = "rgba(255, 255, 255, 0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        const target = e.target as HTMLElement;
                                        target.style.color = "rgba(255, 255, 255, 0.8)";
                                        target.style.paddingLeft = "0";
                                        target.style.background = "transparent";
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </Col>

                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Title level={5} style={sectionTitleStyle}>
                            Support
                        </Title>
                        <div>
                            {footerLinks.support.map((link, index) => (
                                <Link
                                    key={index}
                                    onClick={() => navigate(link.path)}
                                    style={linkStyle}
                                    onMouseEnter={(e) => {
                                        const target = e.target as HTMLElement;
                                        target.style.color = "#fff";
                                        target.style.paddingLeft = "8px";
                                        target.style.background = "rgba(255, 255, 255, 0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        const target = e.target as HTMLElement;
                                        target.style.color = "rgba(255, 255, 255, 0.8)";
                                        target.style.paddingLeft = "0";
                                        target.style.background = "transparent";
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={4}>
                        <Title level={5} style={sectionTitleStyle}>
                            Legal
                        </Title>
                        <div>
                            {footerLinks.legal.map((link, index) => (
                                <Link
                                    key={index}
                                    onClick={() => navigate(link.path)}
                                    style={linkStyle}
                                    onMouseEnter={(e) => {
                                        const target = e.target as HTMLElement;
                                        target.style.color = "#fff";
                                        target.style.paddingLeft = "8px";
                                        target.style.background = "rgba(255, 255, 255, 0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        const target = e.target as HTMLElement;
                                        target.style.color = "rgba(255, 255, 255, 0.8)";
                                        target.style.paddingLeft = "0";
                                        target.style.background = "transparent";
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </Col>
                </Row>
                <div style={{
                    marginTop: "20px",
                    padding: "40px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "16px",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                }}>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} sm={24} md={12}>
                            <Title level={4} style={{ color: "#fff", marginBottom: 10}}>
                                📞 Get in Touch
                            </Title>
                            <div>
                                <div style={contactItemStyle}>
                                    <div style={contactIconStyle}>
                                        <MailOutlined />
                                    </div>
                                    <div>
                                        <Text style={{ color: "#fff", fontWeight: 500, display: "block" }}>
                                            Email Us
                                        </Text>
                                        <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
                                            hello@shradha.com
                                        </Text>
                                    </div>
                                </div>

                                <div style={contactItemStyle}>
                                    <div style={contactIconStyle}>
                                        <PhoneOutlined />
                                    </div>
                                    <div>
                                        <Text style={{ color: "#fff", fontWeight: 500, display: "block" }}>
                                            Call Us
                                        </Text>
                                        <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
                                            +84 (028) 123-4567
                                        </Text>
                                    </div>
                                </div>

                                <div style={contactItemStyle}>
                                    <div style={contactIconStyle}>
                                        <EnvironmentOutlined />
                                    </div>
                                    <div>
                                        <Text style={{ color: "#fff", fontWeight: 500, display: "block" }}>
                                            Visit Store
                                        </Text>
                                        <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
                                            123 Nguyen Hue Street,<br />
                                            District 1, Ho Chi Minh City
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <Title level={4} style={{ color: "#fff", marginBottom: 18 }}>
                                🌟 Follow Our Journey
                            </Title>
                            <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={`Follow us on ${social.name}`}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 56,
                                            height: 56,
                                            background: "rgba(255, 255, 255, 0.1)",
                                            borderRadius: "12px",
                                            color: "#fff",
                                            textDecoration: "none",
                                            transition: "all 0.3s ease",
                                            fontSize: "24px",
                                            backdropFilter: "blur(10px)",
                                            border: "1px solid rgba(255, 255, 255, 0.1)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = social.color;
                                            e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
                                            e.currentTarget.style.boxShadow = `0 8px 25px ${social.color}40`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                                            e.currentTarget.style.transform = "translateY(0) scale(1)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>

                            <div>
                                <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", display: "block", marginBottom: 14}}>
                                    We accept secure payments
                                </Text>
                                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                    {["VISA", "MASTERCARD", "PAYPAL", "MOMO"].map((payment) => (
                                        <div
                                            key={payment}
                                            style={paymentStyle}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                                                e.currentTarget.style.transform = "translateY(0)";
                                            }}
                                        >
                                            {payment}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>

                <Divider style={{ borderColor: "rgba(255, 255, 255, 0.1)", margin: "10px 0 10px" }} />

                {/* Bottom Footer */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "20px",
                    paddingBottom: "40px",
                }}>
                    <Text style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        © {currentYear} Shradha Book Store. All rights reserved. Made with
                        <HeartFilled style={{ color: "#ff6b6b" }} /> in Vietnam
                    </Text>

                    <div style={{ display: "flex", gap: 24 }}>
                        <Link
                            onClick={() => navigate("/privacy")}
                            style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}
                        >
                            Privacy
                        </Link>
                        <Link
                            onClick={() => navigate("/terms")}
                            style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}
                        >
                            Terms
                        </Link>
                        <Link
                            onClick={() => navigate("/cookies")}
                            style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}
                        >
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </AntFooter>
    );
};

export default Footer;