import React from 'react';
import { Row, Col } from 'antd';
import { TruckOutlined, ReloadOutlined, SafetyOutlined } from '@ant-design/icons';

const ProductServices: React.FC = () => (
    <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: 16,
        marginBottom: 24
    }}>
        <Row gutter={[16, 16]}>
            <Col span={8} style={{ textAlign: 'center' }}>
                <TruckOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
                <div style={{ fontSize: 12, color: '#666' }}>Free Shipping</div>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
                <ReloadOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
                <div style={{ fontSize: 12, color: '#666' }}>30-day Return</div>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
                <SafetyOutlined style={{ fontSize: 24, color: '#722ed1', marginBottom: 8 }} />
                <div style={{ fontSize: 12, color: '#666' }}>2-year Warranty</div>
            </Col>
        </Row>
    </div>
);

export default ProductServices;
