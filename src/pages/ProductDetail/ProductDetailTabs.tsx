import React, { useState } from 'react';
import { Tabs, Tag, Space } from 'antd';
import { BookOutlined, ApartmentOutlined, FileTextOutlined } from '@ant-design/icons';
import { ProductsResponseDto } from "../../@type/productsResponse";
import ProductReviews from './tabs/ProductReviews';
import DescriptionTab from './tabs/DescriptionTab';
import SpecificationsTab from './tabs/SpecificationsTab';

interface ProductDetailTabsProps {
    product: ProductsResponseDto;
}

interface ReviewsTabProps {
    productId: number;
    onReviewCountChange: (count: number) => void;
}

const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({ product }) => {
    const [activeTab, setActiveTab] = useState('1');
    const [reviewCount, setReviewCount] = useState(0);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    return (
        <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            style={{ marginTop: 1 }}
            tabBarStyle={{
                borderBottom: '2px solid #f0f0f0',
            }}
            items={[
                {
                    key: '1',
                    label: (
                        <Space>
                            <FileTextOutlined />
                            <span>Description</span>
                        </Space>
                    ),
                    children: <DescriptionTab product={product} />
                },
                {
                    key: '2',
                    label: (
                        <Space>
                            <ApartmentOutlined />
                            <span>Specifications</span>
                        </Space>
                    ),
                    children: <SpecificationsTab product={product} />
                },
                {
                    key: '3',
                    label: (
                        <Space>
                            <BookOutlined />
                            <span>Reviews</span>
                            <Tag color="blue" style={{ margin: 0 }}>
                                {reviewCount}
                            </Tag>
                        </Space>
                    ),
                    children: (
                        <ReviewsTab
                            productId={product.id}
                            onReviewCountChange={(count) => setReviewCount(count)}
                        />
                    )
                }
            ]}
        />
    );
};

// Reviews Tab Component Wrapper
const ReviewsTab: React.FC<ReviewsTabProps> = ({ productId, onReviewCountChange }) => {
    return <ProductReviews productId={productId} onReviewCountChange={onReviewCountChange} />;
};

export default ProductDetailTabs;