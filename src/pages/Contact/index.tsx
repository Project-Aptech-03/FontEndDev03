

import React, { useState } from 'react';
import { 
  MailOutlined, PhoneOutlined, EnvironmentOutlined, ClockCircleOutlined,
  SendOutlined, FacebookOutlined, InstagramOutlined, TwitterOutlined, YoutubeOutlined
} from '@ant-design/icons';
import { Form, Input, Button, Card, Row, Col, message, Divider, Typography } from 'antd';
import emailjs from 'emailjs-com';
import './ContactPage.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: ContactFormValues) => {
    setLoading(true);
    try {
      // ID từ EmailJS
      const serviceID = 'service_5jndhll';
      const adminTemplateID = 'template_5oga9gf';
      const customerTemplateID = 'template_wc1gq0b'; // Template mới cho khách hàng
      const userID = 'BPSenmEqRQS7riyHF';

      const adminParams = {
        from_name: values.name,
        from_email: values.email,
        phone: values.phone,
        subject: values.subject,
        message: values.message,
        to_email: 'sinhndhcmr@gmail.com'
      };

      await emailjs.send(serviceID, adminTemplateID, adminParams, userID);

      const customerParams = {
        to_name: values.name,
        to_email: values.email,
        subject: "Thank you for contacting Shradha Bookstores",
        message: values.message, // Truyền nội dung tin nhắn gốc
        company_name: "Shradha Bookstores",
        reply_time: "within 24 hours"
      };

      await emailjs.send(serviceID, customerTemplateID, customerParams, userID);

      message.success("✅ Your message has been sent. A confirmation email has also been sent to your email.");
      form.resetFields();
    } catch (error) {
      console.error("Email sending error:", error);
      message.error("❌ An error occurred while sending the message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <Title level={1} className="hero-title">
            Contact Shradha Bookstores
          </Title>
          <Paragraph className="hero-description">
            We are always ready to listen and assist you. Please contact the Shradha team
            for book inquiries, orders, or any questions you may have.
          </Paragraph>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <Row gutter={[32, 32]} className="contact-container">
          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <Card className="contact-form-card">
              <Title level={2} className="form-title">Send Us a Message</Title>
              <Paragraph>Please fill in the information below and we will get back to you as soon as possible.</Paragraph>

              <Form form={form} layout="vertical" onFinish={onFinish} className="contact-form">
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="name"
                      label="Full Name"
                      rules={[{ required: true, message: "Please enter your full name" }]}
                    >
                      <Input placeholder="Your Name" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[{ required: true, type: "email", message: "Invalid email address" }]}
                    >
                      <Input placeholder="example@email.com" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      rules={[{ required: true, message: "Please enter your phone number" }]}
                    >
                      <Input placeholder="0989893831" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="subject"
                      label="Subject"
                      rules={[{ required: true, message: "Please enter the subject" }]}
                    >
                      <Input placeholder="Contact Subject" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="message"
                  label="Message Content"
                  rules={[{ required: true, message: "Please enter the message content" }]}
                >
                  <TextArea placeholder="Let us know how we can help you..." rows={6} size="large" />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    loading={loading}
                    icon={<SendOutlined />}
                    className="submit-button"
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col xs={24} lg={10}>
            <div className="contact-info">
              <Title level={3} className="info-title">Contact Information</Title>
              <Divider />
              <div className="info-item">
                <div className="info-icon"><EnvironmentOutlined /></div>
                <div className="info-content">
                  <Text strong>Store Address</Text>
                  <Paragraph>21 Bis Hau Giang Street, Ward 4, Tan Binh District, Ho Chi Minh City, Vietnam</Paragraph>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><PhoneOutlined /></div>
                <div className="info-content">
                  <Text strong>Phone Number</Text>
                  <Paragraph>Hotline: 0989893831<br />Support: 0989893831</Paragraph>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><MailOutlined /></div>
                <div className="info-content">
                  <Text strong>Email</Text>
                  <Paragraph>info@shradhabookstores.com<br />support@shradhabookstores.com</Paragraph>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><ClockCircleOutlined /></div>
                <div className="info-content">
                  <Text strong>Working Hours</Text>
                  <Paragraph>Mon - Fri: 8:00 AM - 8:00 PM<br />Sat - Sun: 8:00 AM - 6:00 PM</Paragraph>
                </div>
              </div>

              <Divider />
              <div className="social-section">
                <Text strong>Follow Us</Text>
                <div className="social-links">
                  <a href="https://www.facebook.com/shraddhabookstores"><FacebookOutlined /> Facebook</a>
                  <a href="https://www.instagram.com/shraddhabookstores"><InstagramOutlined /> Instagram</a>
                  <a href="https://twitter.com/shraddhabooks"><TwitterOutlined /> Twitter</a>
                  <a href="https://www.youtube.com/shraddhabookstores"><YoutubeOutlined /> YouTube</a>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <Card title="Directions Map" className="map-card">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d673.0736369013636!2d106.66305078550839!3d10.807710829885943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175293ca6cabe9b%3A0xfe7e5f0c4d1672c3!2zMjFCaXMgSOG6rXUgR2lhbmcsIFBoxrDhu51uZyA0LCBUw6JuIELDrG5oLCBI4buTIENow60gTWluaCwgVmnhu4d0 IE5hbQ!5e0!3m2!1svi!2s!4v1756592402026!5m2!1svi!2s"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - Shradha Bookstores"
            />
          </div>
          <div className="map-info">
            <Paragraph>
              <EnvironmentOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              📍 21 Bis Hau Giang Street, Ward 4, Tan Binh District, Ho Chi Minh City, Vietnam
            </Paragraph>
            <Button 
              type="primary" 
              href="https://maps.google.com/?q=10.807710829885943,106.66305078550839"
              target="_blank"
              rel="noopener noreferrer"
              icon={<EnvironmentOutlined />}
            >
              Open in Google Maps
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default ContactPage;