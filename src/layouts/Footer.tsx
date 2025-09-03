import React from "react";
import { Layout, Row, Col, Typography, Divider } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
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
      { label: "Careers", path: "/careers" },
      { label: "Press", path: "/press" },
    ],
    support: [
      { label: "Help Center", path: "/help" },
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
  };

  const socialLinks = [
    { icon: <FacebookOutlined />, url: "https://facebook.com" },
    { icon: <TwitterOutlined />, url: "https://twitter.com" },
    { icon: <InstagramOutlined />, url: "https://instagram.com" },
    { icon: <LinkedinOutlined />, url: "https://linkedin.com" },
  ];

  const footerStyle: React.CSSProperties = {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: "60px 20px 20px",
    marginTop: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  const footerContentStyle: React.CSSProperties = {
    width: "90%",
    maxWidth: "1400px",
  };

  const logoStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
    cursor: "pointer",
  };

  const logoTextStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: 700,
    background: "linear-gradient(45deg, #1890ff, #722ed1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginLeft: "8px",
    letterSpacing: "-0.5px",
  };

  return (
    <AntFooter style={footerStyle}>
      <div style={footerContentStyle}>
        <Row gutter={[32, 32]}>
          {/* Company Info */}
          <Col xs={24} sm={24} md={8} lg={6}>
            <div style={{ marginBottom: 24 }}>
              <div 
                style={logoStyle}
                onClick={() => navigate("/")}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    background: "linear-gradient(45deg, #1890ff, #722ed1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  M
                </div>
                <span style={logoTextStyle}>MOON.</span>
              </div>
              <Text style={{ color: "#ccc", lineHeight: 1.6 }}>
                Discover the latest trends in fashion and lifestyle. We bring you quality products
                that inspire and empower your daily life.
              </Text>
            </div>
            
            {/* Social Media */}
            <div>
              <Title level={5} style={{ color: "#fff", marginBottom: 16 }}>
                Follow Us
              </Title>
              <div style={{ display: "flex", gap: 12 }}>
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
                      width: 40,
                      height: 40,
                      backgroundColor: "#333",
                      borderRadius: "50%",
                      color: "#fff",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      fontSize: "18px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1890ff";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#333";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </Col>

          {/* Company Links */}
          <Col xs={12} sm={12} md={4} lg={4}>
            <Title level={5} style={{ color: "#fff", marginBottom: 16 }}>
              Company
            </Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {footerLinks.company.map((link, index) => (
                <Link
                  key={index}
                  onClick={() => navigate(link.path)}
                  style={{
                    color: "#ccc",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.color = "#1890ff";
                    target.style.paddingLeft = "4px";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.color = "#ccc";
                    target.style.paddingLeft = "0";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>

          {/* Support Links */}
          <Col xs={12} sm={12} md={4} lg={4}>
            <Title level={5} style={{ color: "#fff", marginBottom: 16 }}>
              Support
            </Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {footerLinks.support.map((link, index) => (
                <Link
                  key={index}
                  onClick={() => navigate(link.path)}
                  style={{
                    color: "#ccc",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.color = "#1890ff";
                    target.style.paddingLeft = "4px";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.color = "#ccc";
                    target.style.paddingLeft = "0";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>

          {/* Legal Links */}
          <Col xs={12} sm={12} md={4} lg={4}>
            <Title level={5} style={{ color: "#fff", marginBottom: 16 }}>
              Legal
            </Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={index}
                  onClick={() => navigate(link.path)}
                  style={{
                    color: "#ccc",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.color = "#1890ff";
                    target.style.paddingLeft = "4px";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.color = "#ccc";
                    target.style.paddingLeft = "0";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>

          {/* Contact Info */}
          <Col xs={12} sm={12} md={8} lg={6}>
            <Title level={5} style={{ color: "#fff", marginBottom: 16 }}>
              Contact Info
            </Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    backgroundColor: "#333",
                    borderRadius: "6px",
                    color: "#1890ff",
                  }}
                >
                  <MailOutlined />
                </div>
                <Text style={{ color: "#ccc", fontSize: "14px" }}>hello@moon.com</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    backgroundColor: "#333",
                    borderRadius: "6px",
                    color: "#1890ff",
                  }}
                >
                  <PhoneOutlined />
                </div>
                <Text style={{ color: "#ccc", fontSize: "14px" }}>+1 (555) 123-4567</Text>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    backgroundColor: "#333",
                    borderRadius: "6px",
                    color: "#1890ff",
                    marginTop: "2px",
                  }}
                >
                  <EnvironmentOutlined />
                </div>
                <Text style={{ color: "#ccc", fontSize: "14px", lineHeight: 1.5 }}>
                  123 Fashion Street,<br />
                  Style City, SC 12345
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: "#333", margin: "40px 0 20px" }} />

        {/* Bottom Footer */}
        <Row justify="space-between" align="middle" style={{ width: "100%" }}>
          <Col xs={24} sm={24} md={12}>
            <Text style={{ color: "#999", fontSize: "14px" }}>
              © {currentYear} MOON. All rights reserved. Made with ❤️ in Vietnam
            </Text>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <div style={{ 
              display: "flex", 
              justifyContent: { xs: "center", sm: "center", md: "flex-end" } as any,
              gap: 16,
              marginTop: { xs: 16, sm: 16, md: 0 } as any,
            }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 32,
                  padding: "0 12px",
                  backgroundColor: "#333",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                VISA
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 32,
                  padding: "0 12px",
                  backgroundColor: "#333",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                MASTERCARD
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 32,
                  padding: "0 12px",
                  backgroundColor: "#333",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                PAYPAL
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;