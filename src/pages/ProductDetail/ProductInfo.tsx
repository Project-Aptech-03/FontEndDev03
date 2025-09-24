// ===========================
import React, { useState } from 'react';
import { Card, message, Tabs, Space } from 'antd';
import { InfoCircleOutlined, FileTextOutlined, BookOutlined, ApartmentOutlined } from '@ant-design/icons';
import ProductHeader from './ProductHeader';
import ProductPricing from './ProductPricing';
import ProductActions from './ProductActions';
import ProductServices from './ProductServices';
import ProductDetailTabs from './ProductDetailTabs';
import { cartApi } from "../../api/cart.api";
import { useNavigate } from "react-router-dom";
import { ProductsResponseDto } from "../../@type/productsResponse";

const { TabPane } = Tabs;

interface ProductInfoProps {
    product: ProductsResponseDto;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>('overview');
    const navigate = useNavigate();

    const handleBuyNow = async () => {
        try {
            const res = await cartApi.addToCart(product.id, quantity);
            if (res.success) {
                navigate("/cart");
                window.dispatchEvent(new CustomEvent("cartUpdated"));
            } else {
                message.error(res.message || "Unable to add to cart, please try again!");
            }
        } catch (error) {
            console.error("Add to cart error:", error);
            message.error("Unable to add to cart, please try again!");
        }
    };

    const handleAddToCart = async () => {
        try {
            const res = await cartApi.addToCart(product.id, quantity);
            message.success(`Added ${quantity} item(s) to the cart !`);
            console.log("Cart API response:", res);
            window.dispatchEvent(new CustomEvent("cartUpdated"));
        } catch (error) {
            console.error("Add to cart error:", error);
            message.error("Unable to add to cart, please try again!");
        }
    };

    return (
        <Card
            style={{
                borderRadius: 20,
                border: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                height: 'fit-content'
            }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                style={{
                    marginTop: 0,
                    '& .ant-tabs-content-holder': {
                        padding: 0
                    }
                }}
                tabBarStyle={{
                    borderBottom: '2px solid #f0f0f0',
                    marginBottom: 1,
                    paddingLeft: 0,
                    paddingRight: 0
                }}
                items={[
                    {
                        key: 'overview',
                        label: (
                            <Space>
                                <InfoCircleOutlined />
                                <span>Product Overview</span>
                            </Space>
                        ),
                        children: (
                            <div style={{ padding: 0 }}>
                                <ProductHeader product={product} />
                                <ProductPricing product={product} />
                                <ProductActions
                                    product={product}
                                    quantity={quantity}
                                    onQuantityChange={setQuantity}
                                    onBuyNow={handleBuyNow}
                                    onAddToCart={handleAddToCart}
                                />
                                <ProductServices />
                            </div>
                        )
                    },
                    {
                        key: 'details',
                        label: (
                            <Space>
                                <FileTextOutlined />
                                <span>Product Details</span>
                            </Space>
                        ),
                        children: (
                            <div style={{ padding: '0 0px' }}>
                                <ProductDetailTabs product={product} />
                            </div>
                        )
                    }
                ]}
            />
        </Card>
    );
};

export default ProductInfo;