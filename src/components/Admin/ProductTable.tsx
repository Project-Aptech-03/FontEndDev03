import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Tag, Image, Typography, Input, Row, Col, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Products } from '../../@type/products';

const { Text } = Typography;
const { Search } = Input;

interface ProductTableProps {
    products: Products[];
    loading: boolean;
    onEdit: (product: Products) => void;
    onDelete: (id: number) => void;
    pageIndex?: number;
    pageSize?: number;
    keyword?: string;
    onPageChange?: (page: number, size: number) => void;
    onSearch?: (keyword: string) => void;
}
const ProductTable: React.FC<ProductTableProps> = ({
                                                       products,
                                                       loading,
                                                       onEdit,
                                                       onDelete,
                                                       pageIndex = 1,
                                                       pageSize = 10,
                                                       keyword = '',
                                                       onPageChange,
                                                       onSearch
                                                   }) => {
    const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg');
    useEffect(() => {
        const updateScreenSize = () => {
            const width = window.innerWidth;
            if (width < 576) setScreenSize('xs');
            else if (width < 768) setScreenSize('sm');
            else if (width < 992) setScreenSize('md');
            else if (width < 1200) setScreenSize('lg');
            else setScreenSize('xl');
        };

        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);
        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);

    const handleTableChange = (pagination: any) => {
        if (onPageChange) {
            onPageChange(pagination.current, pagination.pageSize);
        }
    };

    const getStockColor = (stock: number) => {
        if (stock > 10) return '#52c41a';
        if (stock > 0) return '#faad14';
        return '#ff4d4f';
    };

    const getTypeColor = (type: string) => {
        const colors = {
            book: '#1890ff',
            stationery: '#52c41a',
            default: '#fa8c16'
        };
        return colors[type as keyof typeof colors] || colors.default;
    };

    const isSmallScreen = ['xs', 'sm'].includes(screenSize);
    const [searchValue, setSearchValue] = useState(keyword);

    // Mobile columns (simplified for small screens)
    const mobileColumns = [
        {
            title: "Product",
            key: "product",
            render: (_: any, record: Products) => (
                <div style={{ padding: '8px 0' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ flexShrink: 0 }}>
                            {record.photos?.[0] ? (
                                <Image
                                    src={record.photos[0].photoUrl}
                                    width={60}
                                    height={75}
                                    style={{
                                        objectFit: 'cover',
                                        borderRadius: 6,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                    fallback="https://via.placeholder.com/60x75?text=No+Img"
                                />
                            ) : (
                                <div style={{
                                    width: 60,
                                    height: 75,
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 6,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text type="secondary" style={{ fontSize: 10 }}>No Img</Text>
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>
                                {record.productName}
                            </Text>
                            <Text code style={{ fontSize: 11, marginBottom: 4, display: 'block' }}>
                                {record.productCode}
                            </Text>
                            <div style={{ marginBottom: 6 }}>
                                <Tag
                                    color={getTypeColor(record.productType)}
                                    style={{ fontSize: 11, padding: '2px 6px', marginBottom: 2 }}
                                >
                                    {record.productType}
                                </Tag>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: '#52c41a', fontWeight: 600, fontSize: 14 }}>
                                    ${record.price?.toLocaleString() || 0}
                                </Text>
                                <Tag
                                    color={getStockColor(record.stockQuantity)}
                                    style={{ margin: 0, fontSize: 11 }}
                                >
                                    Stock: {record.stockQuantity}
                                </Tag>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                        <Space size="small">
                            <Button
                                size="small"
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => onEdit(record)}
                                style={{ height: 28, fontSize: 12 }}
                            />
                            <Popconfirm
                                title="Delete this product?"
                                onConfirm={() => onDelete(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    style={{ height: 28, fontSize: 12 }}
                                />
                            </Popconfirm>
                        </Space>
                    </div>
                </div>
            ),
        },
    ];

    // Desktop columns (full feature set)
    const desktopColumns = [
        {
            title: "Code",
            dataIndex: "productCode",
            key: "productCode",
            width: 120,
            render: (code: string) => (
                <Text code style={{ fontSize: 12, padding: '2px 6px' }}>{code}</Text>
            ),
        },
        {
            title: "Category",
            key: "category",
            width: 120,
            render: (_: any, record: Products) => (
                <Tag color="blue" style={{ borderRadius: 12, fontSize: 11 }}>
                    {record.category?.categoryName || "N/A"}
                </Tag>
            ),
        },
        {
            title: "Product",
            dataIndex: "photos",
            key: "product",
            width: 350,
            render: (_: any, record: Products) => (
                <div style={{ display: "flex", gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ flexShrink: 0 }}>
                        {record.photos?.[0] ? (
                            <Image
                                src={record.photos[0].photoUrl}
                                width={70}
                                height={88}
                                style={{
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    border: '1px solid #f0f0f0'
                                }}
                                fallback="https://via.placeholder.com/70x88?text=No+Img"
                            />
                        ) : (
                            <div style={{
                                width: 70,
                                height: 88,
                                backgroundColor: '#fafafa',
                                border: '2px dashed #d9d9d9',
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text type="secondary" style={{ fontSize: 10 }}>No Image</Text>
                            </div>
                        )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Tooltip title={record.productName}>
                            <Text strong style={{
                                fontSize: 15,
                                display: 'block',
                                marginBottom: 6,
                                lineHeight: 1.3
                            }}>
                                {record.productName}
                            </Text>
                        </Tooltip>
                        <div style={{
                            fontSize: 12,
                            color: '#666',
                            lineHeight: 1.4,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                            gap: '4px 12px'
                        }}>
                            <Text style={{ color: '#666' }}>Pages: {record.pages || 0}</Text>
                            <Text style={{ color: '#666' }}>Weight: {record.weight || 0}kg</Text>
                            <Text style={{ color: '#666' }}>
                                Size: {record.dimensionLength || record.dimensionWidth || record.dimensionHeight
                                ? `${record.dimensionLength || 0}×${record.dimensionWidth || 0}×${record.dimensionHeight || 0}cm`
                                : "N/A"}
                            </Text>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "productType",
            key: "productType",
            width: 100,
            render: (type: string) => (
                <Tag
                    color={getTypeColor(type)}
                    style={{
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 500,
                        textTransform: 'capitalize'
                    }}
                >
                    {type}
                </Tag>
            ),
        },
        {
            title: "Manufacturer",
            key: "manufacturer",
            width: 140,
            render: (_: any, record: Products) => (
                <Tag color="#722ed1" style={{ borderRadius: 12, fontSize: 11 }}>
                    {record.manufacturer?.manufacturerName || "N/A"}
                </Tag>
            ),
        },
        {
            title: "Publisher",
            key: "publisher",
            width: 130,
            render: (_: any, record: Products) => (
                <Tag color="#fa8c16" style={{ borderRadius: 12, fontSize: 11 }}>
                    {record.publisher?.publisherName || "N/A"}
                </Tag>
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            width: 100,
            align: 'right' as const,
            render: (price: number) => (
                <Text style={{
                    color: "#52c41a",
                    fontWeight: 600,
                    fontSize: 14
                }}>
                    ${price?.toLocaleString() || 0}
                </Text>
            ),
        },
        {
            title: "Stock",
            dataIndex: "stockQuantity",
            key: "stockQuantity",
            width: 80,
            align: 'center' as const,
            render: (stock: number) => (
                <Tag
                    color={getStockColor(stock)}
                    style={{
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 500,
                        minWidth: 45,
                        textAlign: 'center'
                    }}
                >
                    {stock}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "action",
            width: 100,
            align: 'center' as const,
            render: (_: any, record: Products) => (
                <Space size="small">
                    <Tooltip title="Edit product">
                        <Button
                            size="small"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                            style={{
                                borderRadius: 6,
                                height: 32,
                                boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)'
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete this product?"
                        description="This action cannot be undone."
                        onConfirm={() => onDelete(record.id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okType="danger"
                    >
                        <Tooltip title="Delete product">
                            <Button
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                style={{
                                    borderRadius: 6,
                                    height: 32,
                                    boxShadow: '0 2px 4px rgba(255, 77, 79, 0.2)'
                                }}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const columns = isSmallScreen ? mobileColumns : desktopColumns;

    return (
        <div style={{
            background: "#fafafa",
            borderRadius: 12,
            padding: isSmallScreen ? 8 : 16,
            border: "1px solid #f0f0f0"
        }}>
            {/* Search Section */}
            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
                <Col xs={24} sm={16} md={12} lg={8}>
                    <Search
                        placeholder="Search products..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)} // chỉ thay đổi state
                        onSearch={(value) => {
                            if (onSearch) {
                                onSearch(value);
                            }
                        }}
                        style={{ width: '100%' }}
                        size={isSmallScreen ? 'middle' : 'large'}
                    />
                </Col>
            </Row>

            <Table
                dataSource={products}
                columns={columns}
                rowKey="id"
                loading={loading}
                size={isSmallScreen ? "small" : "middle"}
                scroll={isSmallScreen ? undefined : { x: 1200 }}
                pagination={{
                    current: pageIndex,
                    pageSize,
                    showSizeChanger: !isSmallScreen,
                    pageSizeOptions: ['5', '10', '20', '50'],
                    showQuickJumper: !isSmallScreen,
                    showTotal: (total, range) => (
                        <Text style={{ fontSize: 13, color: '#666' }}>
                            {`${range[0]}-${range[1]} of ${total} items`}
                        </Text>
                    ),
                    style: {
                        marginTop: 16,
                        textAlign: isSmallScreen ? 'center' : 'right'
                    },
                    simple: isSmallScreen,
                    size: isSmallScreen ? 'small' : 'default'
                }}
                onChange={handleTableChange}
                style={{
                    background: "#fff",
                    borderRadius: 8,
                    overflow: 'hidden'
                }}
                rowClassName={(record, index) =>
                    index % 2 === 0 ? 'even-row' : 'odd-row'
                }
            />
        </div>
    );
};

export default ProductTable;