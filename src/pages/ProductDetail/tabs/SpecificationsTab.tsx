// src/pages/ProductDetail/tabs/SpecificationsTab.tsx
import React from 'react';
import { Typography, Card, Tag, Space } from 'antd';
import {
    ApartmentOutlined, ShopOutlined,
    EnvironmentOutlined, FileTextOutlined,
    UserOutlined, BarcodeOutlined,
    ClusterOutlined, SafetyCertificateOutlined,
    ColumnWidthOutlined, InfoCircleOutlined,
    TagOutlined, BulbOutlined, CheckCircleOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { ProductsResponseDto } from "../../../@type/productsResponse";

const { Text, Title } = Typography;

interface Publisher {
    id?: number;
    publisherName?: string;
    address?: string;
}

interface SpecificationsTabProps {
    product: ProductsResponseDto;
}

const SpecificationsTab: React.FC<SpecificationsTabProps> = ({ product }) => {
    // Type assertion cho publisher
    const publisher = product.publisher as Publisher | undefined;
    const publisherAddress = publisher?.address || '';

    const specSections = [
        {
            title: 'Basic Information',
            icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
            color: '#e6f7ff',
            borderColor: '#91d5ff',
            items: [
                {
                    label: 'Product Code',
                    icon: <BarcodeOutlined />,
                    value: (
                        <Tag
                            color="blue"
                            style={{
                                margin: 0,
                                fontSize: 13,
                                fontWeight: 500,
                                padding: '4px 12px',
                                borderRadius: 16
                            }}
                        >
                            {product.productCode}
                        </Tag>
                    )
                },
                {
                    label: 'Product Type',
                    icon: <TagOutlined />,
                    value: <Text strong style={{ color: '#262626' }}>{product.productType || "Not specified"}</Text>
                },
                {
                    label: 'Author',
                    icon: <UserOutlined />,
                    value: <Text strong style={{ color: '#262626' }}>{product.author || "Not specified"}</Text>
                }
            ]
        },
        {
            title: 'Category & Publisher',
            icon: <ApartmentOutlined style={{ color: '#52c41a' }} />,
            color: '#f6ffed',
            borderColor: '#b7eb8f',
            items: [
                {
                    label: 'Category',
                    icon: <ApartmentOutlined />,
                    value: product.category ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text strong style={{ color: '#262626' }}>{product.category.categoryName}</Text>
                            {product.category.categoryCode && (
                                <Tag
                                    color="green"
                                    style={{
                                        margin: 0,
                                        fontSize: 11,
                                        borderRadius: 12,
                                        padding: '2px 8px'
                                    }}
                                >
                                    {product.category.categoryCode}
                                </Tag>
                            )}
                        </div>
                    ) : (
                        <Text type="secondary">Not categorized</Text>
                    )
                },
                {
                    label: 'Manufacturer',
                    icon: <ShopOutlined />,
                    value: product.manufacturer ? (
                        <div>
                            <Text strong style={{ color: '#262626', display: 'block' }}>{product.manufacturer.manufacturerName}</Text>
                            {product.manufacturer.manufacturerCode && (
                                <Tag
                                    color="orange"
                                    style={{
                                        margin: '4px 0 0 0',
                                        fontSize: 11,
                                        borderRadius: 12,
                                        padding: '2px 8px'
                                    }}
                                >
                                    Code: {product.manufacturer.manufacturerCode}
                                </Tag>
                            )}
                        </div>
                    ) : (
                        <Text type="secondary">Not specified</Text>
                    )
                },
                {
                    label: 'Publisher',
                    icon: <EnvironmentOutlined />,
                    value: product.publisher ? (
                        <div>
                            <Text strong style={{ color: '#262626', display: 'block' }}>{product.publisher.publisherName}</Text>
                            {publisherAddress && (
                                <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                                    📍 {publisherAddress}
                                </Text>
                            )}
                        </div>
                    ) : (
                        <Text type="secondary">Not specified</Text>
                    )
                }
            ]
        },
        {
            title: 'Physical Specifications',
            icon: <ColumnWidthOutlined style={{ color: '#722ed1' }} />,
            color: '#f9f0ff',
            borderColor: '#d3adf7',
            items: [
                {
                    label: 'Dimensions',
                    icon: <ColumnWidthOutlined />,
                    value: (
                        <Text style={{ color: '#262626' }}>
                            {product.dimensionLength && product.dimensionWidth && product.dimensionHeight
                                ? (
                                    <span style={{
                                        background: '#f0f0f0',
                                        padding: '4px 8px',
                                        borderRadius: 8,
                                        fontFamily: 'monospace',
                                        fontSize: 13
                                    }}>
                                        {product.dimensionLength}cm × {product.dimensionWidth}cm × {product.dimensionHeight}cm
                                    </span>
                                )
                                : "Not specified"}
                        </Text>
                    )
                },
                {
                    label: 'Weight',
                    icon: <ClusterOutlined />,
                    value: product.weight ? (
                        <span style={{
                            background: '#f0f0f0',
                            padding: '4px 8px',
                            borderRadius: 8,
                            fontFamily: 'monospace',
                            fontSize: 13,
                            color: '#262626'
                        }}>
                            {product.weight} kg
                        </span>
                    ) : (
                        <Text type="secondary">Not specified</Text>
                    )
                },
                {
                    label: 'Pages',
                    icon: <FileTextOutlined />,
                    value: product.pages ? (
                        <span style={{
                            background: '#f0f0f0',
                            padding: '4px 8px',
                            borderRadius: 8,
                            fontFamily: 'monospace',
                            fontSize: 13,
                            color: '#262626'
                        }}>
                            {product.pages} pages
                        </span>
                    ) : (
                        <Text type="secondary">Not specified</Text>
                    )
                }
            ]
        },
        {
            title: 'Stock & Status',
            icon: <SafetyCertificateOutlined style={{ color: '#fa8c16' }} />,
            color: '#fff7e6',
            borderColor: '#ffd591',
            items: [
                {
                    label: 'Stock Status',
                    icon: <SafetyCertificateOutlined />,
                    value: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Tag
                                color={product.stockQuantity > 0 ? "success" : "error"}
                                style={{
                                    margin: 0,
                                    padding: '4px 12px',
                                    borderRadius: 16,
                                    fontSize: 13,
                                    fontWeight: 500
                                }}
                            >
                                {product.stockQuantity > 0
                                    ? `${product.stockQuantity} in stock`
                                    : "Out of stock"
                                }
                            </Tag>
                            <div style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: product.stockQuantity > 0 ? '#52c41a' : '#ff4d4f',
                                animation: product.stockQuantity > 0 ? 'pulse 2s infinite' : 'none'
                            }} />
                        </div>
                    )
                },
                {
                    label: 'Product Status',
                    icon: <CheckCircleOutlined />,
                    value: (
                        <Tag
                            color={product.isActive ? "success" : "error"}
                            style={{
                                margin: 0,
                                padding: '4px 12px',
                                borderRadius: 16,
                                fontSize: 13,
                                fontWeight: 500
                            }}
                        >
                            {product.isActive ? "Active" : "Inactive"}
                        </Tag>
                    )
                },
                {
                    label: 'Date Added',
                    icon: <CalendarOutlined />,
                    value: (
                        <Text style={{ color: '#262626' }}>
                            {product.createdDate
                                ? new Date(product.createdDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : "Not available"}
                        </Text>
                    )
                }
            ]
        }
    ];

    return (
        <div
            style={{
                height: '800px',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '20px 24px 20px 0',
                paddingRight: '8px'
            }}
        >
            <style>
                {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          
          .spec-card {
            transition: all 0.3s ease;
          }
          
          .spec-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.12) !important;
          }
          
          .spec-item {
            transition: all 0.2s ease;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 8px;
          }
          
          .spec-item:hover {
            background: rgba(0,0,0,0.02);
          }

          /* Custom scrollbar styles */
          .spec-scroll-container::-webkit-scrollbar {
            width: 8px;
          }

          .spec-scroll-container::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 4px;
          }

          .spec-scroll-container::-webkit-scrollbar-thumb {
            background: #d9d9d9;
            border-radius: 4px;
            transition: background 0.2s ease;
          }

          .spec-scroll-container::-webkit-scrollbar-thumb:hover {
            background: #bfbfbf;
          }

          /* Firefox scrollbar */
          .spec-scroll-container {
            scrollbar-width: thin;
            scrollbar-color: #d9d9d9 #f0f0f0;
          }
        `}
            </style>

            <div className="spec-scroll-container" style={{ height: '100%', overflowY: 'auto', paddingRight: '16px' }}>
                <Space direction="vertical" size={20} style={{ width: '100%' }}>
                    {specSections.map((section, index) => (
                        <Card
                            key={index}
                            className="spec-card"
                            style={{
                                borderRadius: 16,
                                border: `2px solid ${section.borderColor}`,
                                background: section.color,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                overflow: 'hidden'
                            }}
                            bodyStyle={{ padding: 0 }}
                        >
                            {/* Section Header */}
                            <div style={{
                                background: 'white',
                                padding: '16px 24px',
                                borderBottom: `2px solid ${section.borderColor}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12
                            }}>
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    background: section.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `2px solid ${section.borderColor}`
                                }}>
                                    {section.icon}
                                </div>
                                <Title level={5} style={{ margin: 0, color: '#262626' }}>
                                    {section.title}
                                </Title>
                            </div>

                            {/* Section Content */}
                            <div style={{ padding: '20px 24px' }}>
                                <Space direction="vertical" size={0} style={{ width: '100%' }}>
                                    {section.items.map((item, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            className="spec-item"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 16
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                minWidth: 140,
                                                color: '#666'
                                            }}>
                                                {item.icon}
                                                <Text strong style={{ fontSize: 14, color: '#595959' }}>
                                                    {item.label}
                                                </Text>
                                            </div>
                                            <div style={{ flex: 1, minHeight: 24, display: 'flex', alignItems: 'center' }}>
                                                {item.value}
                                            </div>
                                        </div>
                                    ))}
                                </Space>
                            </div>
                        </Card>
                    ))}
                    <Card
                        style={{
                            background: 'linear-gradient(135deg, #fff1b8 0%, #fff9e6 100%)',
                            border: '2px solid #ffd666',
                            borderRadius: 16,
                            boxShadow: '0 4px 12px rgba(255, 193, 7, 0.2)'
                        }}
                        bodyStyle={{ padding: '20px 24px' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: 12,
                                background: '#fff7e6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #ffd591',
                                flexShrink: 0
                            }}>
                                <BulbOutlined style={{ color: '#fa8c16', fontSize: 16 }} />
                            </div>
                            <div>
                                <Title level={5} style={{ margin: '0 0 8px 0', color: '#d48806' }}>
                                    📋 Important Note
                                </Title>
                                <Text style={{ fontSize: 14, color: '#8c6e00', lineHeight: '1.6' }}>
                                    All specifications are provided by the manufacturer and may vary slightly.
                                    For critical applications or specific requirements, please contact our support team
                                    for detailed verification and additional technical documentation.
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Space>
            </div>
        </div>
    );
};

export default SpecificationsTab;