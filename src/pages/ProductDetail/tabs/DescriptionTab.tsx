// src/pages/ProductDetail/DescriptionTab.tsx
import React, { useState } from 'react';
import { Typography, Divider, Row, Col, Card, Space } from 'antd';
import {
    BookOutlined, CalendarOutlined,
    ClusterOutlined, ColumnWidthOutlined
} from '@ant-design/icons';
import {ProductsResponseDto} from "../../../@type/productsResponse";

const { Paragraph, Text, Title } = Typography;

interface DescriptionTabProps {
    product: ProductsResponseDto;
}

const DescriptionTab: React.FC<DescriptionTabProps> = ({ product }) => {
    const [expanded, setExpanded] = useState(false);

    const maxLength = 300;
    const description = product.description || "No description available for this product.";
    const isLong = description.length > maxLength;
    const textToShow = expanded ? description : description.slice(0, maxLength);

    return (
        <div style={{ padding: '8px 4px' }}>
            {/* Description Text */}
            <Paragraph
                style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "#333",
                    marginBottom: 16,
                    textAlign: 'justify'
                }}
            >
                {textToShow}
                {!expanded && isLong && "..."}
            </Paragraph>

            {isLong && (
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span
              onClick={() => setExpanded(!expanded)}
              style={{
                  color: "#1890ff",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: 14
              }}
          >
            {expanded ? "Show Less" : "Read More"}
          </span>
                </div>
            )}

            <Divider />

            {/* Product Features */}
            <Title level={4} style={{ marginBottom: 16, color: '#262626' }}>
                Product Features
            </Title>

            <Row gutter={[24, 16]}>
                <Col xs={12} sm={6}>
                    <Card
                        size="small"
                        style={{
                            textAlign: "center",
                            border: '1px solid #e8e8e8',
                            borderRadius: 8,
                            height: '100%'
                        }}
                        bodyStyle={{ padding: '16px 8px' }}
                    >
                        <ColumnWidthOutlined style={{
                            fontSize: 24,
                            color: "#13c2c2",
                            marginBottom: 8
                        }} />
                        <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4 }}>Dimensions</div>
                        <Text strong style={{ fontSize: 13 }}>
                            {product.dimensionLength && product.dimensionWidth && product.dimensionHeight
                                ? `${product.dimensionLength} × ${product.dimensionWidth} × ${product.dimensionHeight} cm`
                                : "Not specified"}
                        </Text>
                    </Card>
                </Col>

                <Col xs={12} sm={6}>
                    <Card
                        size="small"
                        style={{
                            textAlign: "center",
                            border: '1px solid #e8e8e8',
                            borderRadius: 8,
                            height: '100%'
                        }}
                        bodyStyle={{ padding: '16px 8px' }}
                    >
                        <BookOutlined style={{
                            fontSize: 24,
                            color: "#52c41a",
                            marginBottom: 8
                        }} />
                        <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4 }}>Pages</div>
                        <Text strong style={{ fontSize: 13 }}>
                            {product.pages ? `${product.pages} pages` : "Not specified"}
                        </Text>
                    </Card>
                </Col>

                <Col xs={12} sm={6}>
                    <Card
                        size="small"
                        style={{
                            textAlign: "center",
                            border: '1px solid #e8e8e8',
                            borderRadius: 8,
                            height: '100%'
                        }}
                        bodyStyle={{ padding: '16px 8px' }}
                    >
                        <ClusterOutlined style={{
                            fontSize: 24,
                            color: "#eb2f96",
                            marginBottom: 8
                        }} />
                        <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4 }}>Weight</div>
                        <Text strong style={{ fontSize: 13 }}>
                            {product.weight ? `${product.weight} kg` : "Not specified"}
                        </Text>
                    </Card>
                </Col>

                <Col xs={12} sm={6}>
                    <Card
                        size="small"
                        style={{
                            textAlign: "center",
                            border: '1px solid #e8e8e8',
                            borderRadius: 8,
                            height: '100%'
                        }}
                        bodyStyle={{ padding: '16px 8px' }}
                    >
                        <CalendarOutlined style={{
                            fontSize: 24,
                            color: "#fa8c16",
                            marginBottom: 8
                        }} />
                        <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4 }}>Added</div>
                        <Text strong style={{ fontSize: 13 }}>
                            {product.createdDate
                                ? new Date(product.createdDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short'
                                })
                                : "Recently"}
                        </Text>
                    </Card>
                </Col>
            </Row>

            {/* Author Information */}
            {product.author && (
                <>
                    <Divider />
                    <Title level={4} style={{ marginBottom: 12, color: '#262626' }}>
                        About the Author
                    </Title>
                    <Card
                        style={{
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                            border: 'none',
                            borderRadius: 8
                        }}
                    >
                        <Space>
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: '#1890ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 16
                            }}>
                                {product.author.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <Text strong style={{ fontSize: 15 }}>{product.author}</Text>
                                <div style={{ color: '#666', fontSize: 13 }}>Author</div>
                            </div>
                        </Space>
                    </Card>
                </>
            )}
        </div>
    );
};

export default DescriptionTab;