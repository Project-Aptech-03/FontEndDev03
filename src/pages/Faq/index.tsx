import React, { useState, useEffect } from 'react';
import { Input, Spin, Empty, Card, Row, Col, Button, Tabs } from 'antd';
import { SearchOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { FAQ } from '../../services/faqService';
import faqService from '../../services/faqService';
import './FAQ.css';

const { TabPane } = Tabs;

const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('faq');

  useEffect(() => {
    loadFaqs();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [faqs, searchTerm]);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await faqService.getActiveFaqs();
      setFaqs(data);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFaqs = () => {
    let filtered = faqs;

    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFaqs(filtered);
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const renderFAQList = () => {
    if (loading) {
      return (
        <div className="faq-loading">
          <Spin size="large" />
          <p>"Loading FAQs..."</p>
        </div>
      );
    }

    if (filteredFaqs.length === 0) {
      return (
        <Empty
          description={
            searchTerm 
              ? `No FAQs found matching "${searchTerm}"`
              : 'No FAQs available'
          }
        />
      );
    }

    return (
      <div className="faq-list">
        {filteredFaqs.map((faq, index) => (
          <div key={faq.id} className="faq-item">
            <div 
              className="faq-question"
              onClick={() => toggleExpand(faq.id)}
            >
              <span className="faq-number">{index + 1}.</span>
              <h3>{faq.question}</h3>
              <span className="faq-toggle">
                {expandedId === faq.id ? '−' : '+'}
              </span>
            </div>
            {expandedId === faq.id && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'faq',
      label: '❓ Frequently Asked Questions (FAQ)',
      children: (
        <div className="faq-section">
          <div className="faq-search">
            <Input
              placeholder="🔍 Search FAQs..."
              value={searchTerm}
              onChange={handleSearch}
              prefix={<SearchOutlined />}
              size="large"
              className="search-input"
            />
          </div>

          {renderFAQList()}

          <div className="faq-support-info">
            <h3>No FAQs found?</h3>
            <p>Contact us for direct support</p>
            <Button
              type="primary"
              onClick={() => setActiveTab('contact')}
            >
              Go to Contact
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: '📧 Contact Support',
      children: (
        <div className="contact-section">
          <h2>Contact Information</h2>
          <Row gutter={[16, 16]} className="contact-info">
            <Col xs={24} md={8}>
              <Card className="contact-card">
                <MailOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <h4>Email</h4>
                <p>support@shradhabookstores.com</p>
                <small>Response within 24 hours</small>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="contact-card">
                <PhoneOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                <h4>Hotline</h4>
                <p>0989893831</p>
                <small>Monday - Friday: 8:00 AM - 5:00 PM</small>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="contact-card">
                <EnvironmentOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
                <h4>Address</h4>
                <p>21bis Hau Giang Street, Tan Binh, Ho Chi Minh City</p>
                <small>Opening hours: 8:00 AM - 8:00 PM daily</small>
              </Card>
            </Col>
          </Row>

          <div className="contact-notes">
            <h4>📋 Notes when contacting:</h4>
            <ul>
              <li>Prepare your order ID (if any)</li>
              <li>Clearly describe the issue you are facing</li>
              <li>We will respond as quickly as possible</li>
              <li>Screenshot will help better support</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="faq-page">
      <div className="faq-container">
        <div className="faq-header">
          <h1>Support Center</h1>
          <p>
            Search for answers to your questions about the Shradha online bookstore.
            We are always ready to assist you!
          </p>
        </div>

        <div className="faq-content">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="faq-tabs"
          />
        </div>
      </div>
    </div>
  );
};

export default FAQPage;