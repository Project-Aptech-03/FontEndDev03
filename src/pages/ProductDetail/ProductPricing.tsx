// ===========================
import React from 'react';
import { Typography, Tag } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import {ProductsResponseDto} from "../../@type/productsResponse";


const { Title, Text } = Typography;

interface ProductPricingProps {
    product: ProductsResponseDto;
}

const ProductPricing: React.FC<ProductPricingProps> = ({ product }) => (
    <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
        borderRadius: 16,
        marginBottom: 24,
        color: 'white'
    }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <Title level={2} style={{
                color: 'white',
                margin: 0,
                fontSize: '2.5em',
                fontWeight: 700
            }}>
                ${product.price.toFixed(2)}
            </Title>
            <Text style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'line-through',
                fontSize: '1.2em'
            }}>
                ${(product.price * 1.2).toFixed(2)}
            </Text>
            <Tag color="red" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                -17%
            </Tag>
        </div>
        <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 8 }}>
            <SafetyOutlined /> Stock available: {product.stockQuantity} items
        </Text>
    </div>
);

export default ProductPricing;
