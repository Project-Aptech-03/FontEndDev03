import React from 'react';
import { Button, InputNumber, Row, Col, Typography } from 'antd';
import { ShoppingCartOutlined, ThunderboltOutlined } from '@ant-design/icons';
import {ProductsResponseDto} from "../../@type/productsResponse";


const { Text } = Typography;

interface ProductActionsProps {
    product: ProductsResponseDto;
    quantity: number;
    onQuantityChange: (value: number) => void;
    onBuyNow: () => void;
    onAddToCart: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
                                                           product,
                                                           quantity,
                                                           onQuantityChange,
                                                           onBuyNow,
                                                           onAddToCart
                                                       }) => (
    <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8, fontSize: '16px' }}>
                Quantity:
            </Text>
            <InputNumber
                min={1}
                max={product.stockQuantity || 100}
                value={quantity}
                onChange={value => onQuantityChange(Number(value) || 1)}
                style={{
                    width: 140,
                    height: 48,
                    borderRadius: 12,
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: 500,
                    border: '2px solid #667eea',
                }}
                size="large"
            />

        </div>

        <Row gutter={12}>
            <Col xs={24} sm={14}>
                <Button
                    type="primary"
                    icon={<ThunderboltOutlined />}
                    size="large"
                    onClick={onBuyNow}
                    style={{
                        width: '100%',
                        height: 56,
                        borderRadius: 16,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: 600
                    }}
                >
                    Buy Now
                </Button>
            </Col>
            <Col xs={24} sm={10}>
                <Button
                    icon={<ShoppingCartOutlined />}
                    size="large"
                    onClick={onAddToCart}
                    style={{
                        width: '100%',
                        height: 56,
                        borderRadius: 16,
                        fontSize: '16px',
                        fontWeight: 600,
                        borderColor: '#667eea',
                        color: '#667eea'
                    }}
                >
                    Add to Cart
                </Button>
            </Col>
        </Row>
    </div>
);

export default ProductActions;