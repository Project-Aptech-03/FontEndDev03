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

  return (
    <AntFooter
      style={{
        backgroundColor: "#1a1a1a",
        color: "#fff",
        padding: "60px 40px 20px",
        marginTop: "auto",
      }}
    >
      <Row gutter={[32, 32]}>
        {/* Company Info */}
        <Col xs={24} sm={24} md={8} lg={6}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <img
                src="https://via.placeholder.com/40"
                alt="Logo"
                style={{ marginRight: 8 }}
              />
              <Title level={3} style={{ color: "#fff", margin: 0 }}>
                MOON.
              </Title>
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
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#666";
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
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {footerLinks.company.map((link, index) => (
              <Link
                key={index}
                onClick={() => navigate(link.path)}
                style={{
                  color: "#ccc",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.color = "#ccc";
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
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {footerLinks.support.map((link, index) => (
              <Link
                key={index}
                onClick={() => navigate(link.path)}
                style={{
                  color: "#ccc",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.color = "#ccc";
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
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {footerLinks.legal.map((link, index) => (
              <Link
                key={index}
                onClick={() => navigate(link.path)}
                style={{
                  color: "#ccc",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.color = "#ccc";
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
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MailOutlined style={{ color: "#ccc" }} />
              <Text style={{ color: "#ccc" }}>hello@moon.com</Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <PhoneOutlined style={{ color: "#ccc" }} />
              <Text style={{ color: "#ccc" }}>+1 (555) 123-4567</Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <EnvironmentOutlined style={{ color: "#ccc" }} />
              <Text style={{ color: "#ccc" }}>
                123 Fashion Street, Style City, SC 12345
              </Text>
            </div>
          </div>
        </Col>
      </Row>

      <Divider style={{ borderColor: "#333", margin: "40px 0 20px" }} />

      {/* Bottom Footer */}
      <Row justify="space-between" align="middle">
        <Col xs={24} sm={24} md={12}>
          <Text style={{ color: "#999" }}>
            © {currentYear} MOON. All rights reserved.
          </Text>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
            <img
              src="https://via.placeholder.com/40x25/333/fff?text=Visa"
              alt="Visa"
              style={{ height: 25 }}
            />
            <img
              src="https://via.placeholder.com/40x25/333/fff?text=MC"
              alt="Mastercard"
              style={{ height: 25 }}
            />
            <img
              src="https://via.placeholder.com/40x25/333/fff?text=PayPal"
              alt="PayPal"
              style={{ height: 25 }}
            />
          </div>
        </Col>
      </Row>
    </AntFooter>
  );
  
};

export default Footer;
