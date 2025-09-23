// import React from 'react';
// import {Typography, Space, Tag, Rate, Row} from 'antd';

// import {UserOutlined} from "@ant-design/icons";
// import {ProductsResponseDto} from "../../@type/productsResponse";

// const { Title, Text } = Typography;

// interface ProductHeaderProps {
//     product: ProductsResponseDto;
// }

// const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => (
//     <div style={{ marginBottom: 24 }}>
//         <Space size="small" wrap style={{ marginBottom: 12 }}>
//             <Tag color="blue" style={{ borderRadius: 12, padding: '4px 12px' }}>
//                 {Array.isArray(product.category?.subCategories) && product.category.subCategories.length > 0
//                     ? product.category.subCategories
//                         .filter(sc => sc?.subCategoryName)
//                         .map(sc => sc.subCategoryName)
//                         .join(', ')
//                     : 'General'}
//             </Tag>


//             {product.category && (
//                 <Tag color="purple" style={{ borderRadius: 12, padding: '4px 12px' }}>
//                     {product.category.categoryName}
//                 </Tag>
//             )}
//             <Tag
//                 color={product.isActive ? "green" : "red"}
//                 style={{ borderRadius: 12, padding: '4px 12px' }}
//             >
//                 {product.isActive ? "In Stock" : "Out of Stock"}
//             </Tag>
//         </Space>

//         <Row style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <Title
//                 level={1}
//                 style={{
//                     margin: 0,
//                     fontSize: '2.2em',
//                     fontWeight: 700,
//                     color: '#262626',
//                     lineHeight: 1.2,
//                 }}
//             >
//                 {product.productName}
//             </Title>

//             {product.author && (
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                     <UserOutlined style={{ fontSize: 18, color: '#1890ff' }} />
//                     <Text strong>{product.author}</Text>
//                 </div>
//             )}
//         </Row>

//         <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
//             <Rate disabled defaultValue={4.5} style={{ fontSize: 16 }} />
//             <Text type="secondary">(4.5/5 from 128 reviews)</Text>
//         </div>
//     </div>
// );

// export default ProductHeader;



// // //======================sinhnd============================



import React, { useState, useEffect } from 'react';
import { Typography, Space, Tag, Rate, Row, Spin, Alert } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import { ProductsResponseDto } from "../../@type/productsResponse";
import { getProductReviewStats } from "../../api/reviews.api";

const { Title, Text } = Typography;

interface ProductHeaderProps {
    product: ProductsResponseDto;
}

interface ReviewStats {
    averageRating: number;
    reviewCount: number;
    ratingDistribution: Array<{ rating: number; count: number }>;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => {
    const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviewStats = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log('🔄 Fetching review stats for product ID:', product.id);
                console.log('📦 Product object:', product);
                
                const response = await getProductReviewStats(product.id);
                console.log('📊 Full API response:', response);
                
                if (response.success && response.result) {
                    console.log('✅ Review stats data:', response.result.data);
                    setReviewStats(response.result.data);
                } else {
                    console.error('❌ API response error:', response.error);
                    setError(response.error?.message || 'Failed to load review statistics');
                }
            } catch (err) {
                console.error('❌ Error loading review stats:', err);
                setError('Failed to load review statistics');
            } finally {
                setLoading(false);
            }
        };

        if (product.id) {
            fetchReviewStats();
        } else {
            console.error('❌ Product ID is missing:', product);
            setLoading(false);
        }
    }, [product.id]);

    // Format rating display
    const formatRating = (rating: number) => {
        return rating > 0 ? rating.toFixed(1) : '0.0';
    };

    // Format review count display
    const formatReviewCount = (count: number) => {
        if (count === 0) return 'No reviews yet';
        if (count === 1) return '1 review';
        return `${count} reviews`;
    };

    // Hiển thị chi tiết debug
    const renderDebugInfo = () => {
        return (
            <Alert
                type="info"
                message="Debug Information"
                description={
                    <div>
                        <div>Product ID: {product.id}</div>
                        <div>Loading: {loading.toString()}</div>
                        <div>Error: {error || 'null'}</div>
                        <div>Review Stats: {reviewStats ? JSON.stringify(reviewStats) : 'null'}</div>
                        <div>Average Rating: {reviewStats?.averageRating || 'N/A'}</div>
                        <div>Review Count: {reviewStats?.reviewCount || '0'}</div>
                    </div>
                }
                style={{ marginTop: 16, fontSize: '12px' }}
            />
        );
    };

    return (
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

            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Spin size="small" />
                        <Text type="secondary">Loading reviews...</Text>
                    </div>
                ) : error ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Rate disabled defaultValue={0} style={{ fontSize: 16 }} />
                        <Text type="secondary" style={{ color: 'red' }}>
                            (Error: {error})
                        </Text>
                    </div>
                ) : reviewStats && reviewStats.reviewCount > 0 ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Rate 
                                disabled 
                                value={reviewStats.averageRating} 
                                allowHalf 
                                style={{ fontSize: 16 }} 
                            />
                            <Text strong style={{ color: '#faad14', fontSize: '16px' }}>
                                {formatRating(reviewStats.averageRating)}
                            </Text>
                        </div>
                        <Text type="secondary">
                            ({formatReviewCount(reviewStats.reviewCount)})
                        </Text>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Rate disabled defaultValue={0} style={{ fontSize: 16 }} />
                        <Text type="secondary">(No reviews yet)</Text>
                    </div>
                )}
            </div>

            {/* Hiển thị thông tin debug để tìm lỗi */}
            {renderDebugInfo()}

            {/* Thêm nút reload để test */}
            <button 
                onClick={() => window.location.reload()}
                style={{ 
                    marginTop: 8, 
                    padding: '4px 8px', 
                    fontSize: '12px',
                    background: '#1890ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Reload Data
            </button>
        </div>
    );
};

export default ProductHeader;