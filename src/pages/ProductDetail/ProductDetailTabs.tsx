import React, { useState } from 'react';
import { Tabs, Typography, Divider, Row, Col, Card } from 'antd';
import { BookOutlined, CalendarOutlined, StarFilled } from '@ant-design/icons';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import { ProductsResponseDto } from "../../@type/productsResponse";

const { TabPane } = Tabs;
const { Paragraph, Text } = Typography;

interface ProductDetailTabsProps {
    product: ProductsResponseDto;
}

const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({ product }) => (
    <Tabs
        defaultActiveKey="1"
        style={{ marginTop: 24 }}
        tabBarStyle={{
            borderBottom: '2px solid #f0f0f0',
            marginBottom: 20
        }}
    >
        <TabPane tab="Description" key="1">
            <DescriptionTab product={product} />
        </TabPane>
        <TabPane tab="Specifications" key="2">
            <SpecificationsTab product={product} />
        </TabPane>
        <TabPane tab="Reviews" key="3">
            <ReviewsTab />
        </TabPane>
    </Tabs>
);

// Description Tab Component
const DescriptionTab: React.FC<{ product: ProductsResponseDto }> = ({ product }) => {
    const [expanded, setExpanded] = useState(false);

    const maxLength = 250;
    const description = product.description || "No description available";
    const isLong = description.length > maxLength;
    const textToShow = expanded ? description : description.slice(0, maxLength);

    return (
        <>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.6, color: '#595959', marginBottom: 8 }}>
                {textToShow}
                {!expanded && isLong && "..."}
            </Paragraph>

            {isLong && (
                <span
                    onClick={() => setExpanded(!expanded)}
                    style={{ color: '#1890ff', cursor: 'pointer', fontWeight: 500 }}
                >
                    {expanded ? "Hide" : "See more..."}
                </span>
            )}

            <Divider />

            <Row gutter={[24, 16]}>
                <Col xs={12} sm={6}>
                    <div style={{ textAlign: 'center' }}>
                        <SquareFootIcon style={{ fontSize: 20, color: '#13c2c2', marginBottom: 8 }} />
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>Size</div>
                        <Text strong>
                            {product.dimensionLength && product.dimensionWidth && product.dimensionHeight
                                ? `${product.dimensionLength} × ${product.dimensionWidth} × ${product.dimensionHeight} cm`
                                : 'N/A cm'}
                        </Text>
                    </div>
                </Col>

                <Col xs={12} sm={6}>
                    <div style={{ textAlign: 'center' }}>
                        <BookOutlined style={{ fontSize: 20, color: '#52c41a', marginBottom: 8 }} />
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>Pages</div>
                        <Text strong>{product.pages}</Text>
                    </div>
                </Col>

                <Col xs={12} sm={6}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, color: '#eb2f96', marginBottom: 8 }}>⚖</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>Weight</div>
                        <Text strong>{product.weight} kg</Text>
                    </div>
                </Col>
            </Row>
        </>
    );
};

// Specifications Tab Component
const SpecificationsTab: React.FC<{ product: ProductsResponseDto }> = ({ product }) => (
    <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
            <Card size="small" style={{ background: '#fafafa' }}>
                <Text type="secondary">Manufacturer:</Text>
                <div><Text strong>{product.manufacturer?.manufacturerName || 'N/A'}</Text></div>
            </Card>
        </Col>
        <Col xs={24} sm={12}>
            <Card size="small" style={{ background: '#fafafa' }}>
                <Text type="secondary">Publisher :</Text>
                <div><Text strong>{product.publisher?.publisherName || 'N/A'}</Text></div>
            </Card>
        </Col>
        <Col xs={24}>
            <Card size="small" style={{ background: '#fafafa' }}>
                <Text type="secondary">Date of import:</Text>
                <div>
                    <Text strong>
                        {product.createdDate
                            ? new Date(product.createdDate).toLocaleDateString()
                            : 'N/A'}
                    </Text>
                </div>
            </Card>
        </Col>
    </Row>
);

// Reviews Tab Component
const ReviewsTab: React.FC = () => (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <StarFilled style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
        <div style={{ fontSize: 18, marginBottom: 8 }}>No reviews yet</div>
        <Text type="secondary">Be the first to review this product!</Text>
    </div>
);

export default ProductDetailTabs;
