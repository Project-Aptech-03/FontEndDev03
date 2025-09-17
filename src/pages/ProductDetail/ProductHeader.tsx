import React from 'react';
import {Typography, Space, Tag, Rate, Row} from 'antd';

import {UserOutlined} from "@ant-design/icons";
import {ProductsResponseDto} from "../../@type/productsResponse";

const { Title, Text } = Typography;

interface ProductHeaderProps {
    product: ProductsResponseDto;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => (
    <div style={{ marginBottom: 24 }}>
        <Space size="small" wrap style={{ marginBottom: 12 }}>
            <Tag color="blue" style={{ borderRadius: 12, padding: '4px 12px' }}>
                {Array.isArray(product.category?.subCategories) && product.category.subCategories.length > 0
                    ? product.category.subCategories
                        .filter(sc => sc?.subCategoryName)
                        .map(sc => sc.subCategoryName)
                        .join(', ')
                    : 'General'}
            </Tag>


            {product.category && (
                <Tag color="purple" style={{ borderRadius: 12, padding: '4px 12px' }}>
                    {product.category.categoryName}
                </Tag>
            )}
            <Tag
                color={product.isActive ? "green" : "red"}
                style={{ borderRadius: 12, padding: '4px 12px' }}
            >
                {product.isActive ? "In Stock" : "Out of Stock"}
            </Tag>
        </Space>

        <Row style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Title
                level={1}
                style={{
                    margin: 0,
                    fontSize: '2.2em',
                    fontWeight: 700,
                    color: '#262626',
                    lineHeight: 1.2,
                }}
            >
                {product.productName}
            </Title>

            {product.author && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <UserOutlined style={{ fontSize: 18, color: '#1890ff' }} />
                    <Text strong>{product.author}</Text>
                </div>
            )}
        </Row>

        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
            <Rate disabled defaultValue={4.5} style={{ fontSize: 16 }} />
            <Text type="secondary">(4.5/5 from 128 reviews)</Text>
        </div>
    </div>
);

export default ProductHeader;