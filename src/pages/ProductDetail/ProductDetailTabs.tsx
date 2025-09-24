
// export default ProductDetailTabs;
// src/pages/ProductDetail/ProductDetailTabs.tsx
import React, { useState } from 'react';
import {
  Tabs, Typography, Divider, Row, Col, Card,
  Tag, Space, Descriptions
} from 'antd';
import {
  BookOutlined, CalendarOutlined,
  ApartmentOutlined, ShopOutlined,
  EnvironmentOutlined, FileTextOutlined,
  UserOutlined, BarcodeOutlined,
  ClusterOutlined, SafetyCertificateOutlined,
  ColumnWidthOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { ProductsResponseDto } from "../../@type/productsResponse";
import ProductReviews from './ProductReviews';

const { TabPane } = Tabs;
const { Paragraph, Text, Title } = Typography;

interface ProductDetailTabsProps {
  product: ProductsResponseDto;

}

interface Publisher {
  id?: number;
  publisherName?: string;
  address?: string;
  // Thêm các trường khác nếu cần
}
interface ReviewsTabProps {
    productId: number;
    onReviewCountChange: (count: number) => void;
}
const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({ product   }) => {
  const [activeTab, setActiveTab] = useState('1');

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
    const [reviewCount, setReviewCount] = useState(0);


  return (
    <Tabs
      activeKey={activeTab}
      onChange={handleTabChange}
      style={{ marginTop: 24 }}
      tabBarStyle={{
        borderBottom: '2px solid #f0f0f0',
        marginBottom: 20
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

// Description Tab Component
const DescriptionTab: React.FC<{ product: ProductsResponseDto }> = ({ product }) => {
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

// Specifications Tab Component
const SpecificationsTab: React.FC<{ product: ProductsResponseDto }> = ({ product }) => {
  // Sửa lỗi: Type assertion cho publisher
  const publisher = product.publisher as Publisher | undefined;
  const publisherAddress = publisher?.address || '';

  return (
    <div style={{ padding: '8px 4px' }}>
      <Descriptions
        bordered
        column={1}
        size="middle"
        labelStyle={{
          fontWeight: 600,
          width: '200px',
          background: '#fafafa'
        }}
        contentStyle={{ background: '#fff' }}
      >
        {/* Basic Information */}
        <Descriptions.Item label={
          <Space>
            <BarcodeOutlined />
            <span>Product Code</span>
          </Space>
        }>
          <Tag color="blue" style={{ margin: 0, fontSize: 12 }}>
            {product.productCode}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Product Type">
          <Text strong>{product.productType || "Not specified"}</Text>
        </Descriptions.Item>

        <Descriptions.Item label={
          <Space>
            <UserOutlined />
            <span>Author</span>
          </Space>
        }>
          <Text strong>{product.author || "Not specified"}</Text>
        </Descriptions.Item>

        {/* Category Information */}
        <Descriptions.Item label={
          <Space>
            <ApartmentOutlined />
            <span>Category</span>
          </Space>
        }>
          {product.category ? (
            <Space>
              <Text strong>{product.category.categoryName}</Text>
              {product.category.categoryCode && (
                <Tag color="green" style={{ margin: 0, fontSize: 11 }}>
                  {product.category.categoryCode}
                </Tag>
              )}
            </Space>
          ) : (
            <Text type="secondary">Not categorized</Text>
          )}
        </Descriptions.Item>

        {/* Manufacturer Information */}
        <Descriptions.Item label={
          <Space>
            <ShopOutlined />
            <span>Manufacturer</span>
          </Space>
        }>
          {product.manufacturer ? (
            <Space direction="vertical" size={0}>
              <Text strong>{product.manufacturer.manufacturerName}</Text>
              {product.manufacturer.manufacturerCode && (
                <Tag color="orange" style={{ margin: 0, fontSize: 11 }}>
                  Code: {product.manufacturer.manufacturerCode}
                </Tag>
              )}
            </Space>
          ) : (
            <Text type="secondary">Not specified</Text>
          )}
        </Descriptions.Item>

        {/* Publisher Information */}
        <Descriptions.Item label={
          <Space>
            <EnvironmentOutlined />
            <span>Publisher</span>
          </Space>
        }>
          {product.publisher ? (
            <Space direction="vertical" size={0}>
              <Text strong>{product.publisher.publisherName}</Text>
              {publisherAddress && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {publisherAddress}
                </Text>
              )}
            </Space>
          ) : (
            <Text type="secondary">Not specified</Text>
          )}
        </Descriptions.Item>

        {/* Physical Specifications */}
        <Descriptions.Item label={
          <Space>
            <ColumnWidthOutlined />
            <span>Dimensions</span>
          </Space>
        }>
          <Text>
            {product.dimensionLength && product.dimensionWidth && product.dimensionHeight
              ? `${product.dimensionLength}cm × ${product.dimensionWidth}cm × ${product.dimensionHeight}cm`
              : "Not specified"}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item label={
          <Space>
            <ClusterOutlined />
            <span>Weight</span>
          </Space>
        }>
          <Text>{product.weight ? `${product.weight} kg` : "Not specified"}</Text>
        </Descriptions.Item>

        <Descriptions.Item label="Pages">
          <Text>{product.pages ? `${product.pages} pages` : "Not specified"}</Text>
        </Descriptions.Item>

        {/* Stock Information */}
        <Descriptions.Item label={
          <Space>
            <SafetyCertificateOutlined />
            <span>Stock Status</span>
          </Space>
        }>
          <Tag
            color={product.stockQuantity > 0 ? "green" : "red"}
            style={{ margin: 0 }}
          >
            {product.stockQuantity > 0
              ? `${product.stockQuantity} in stock`
              : "Out of stock"
            }
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Product Status">
          <Tag
            color={product.isActive ? "green" : "red"}
            style={{ margin: 0 }}
          >
            {product.isActive ? "Active" : "Inactive"}
          </Tag>
        </Descriptions.Item>

        {/* Dates */}
        <Descriptions.Item label="Date Added">
          <Text>
            {product.createdDate
              ? new Date(product.createdDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : "Not available"}
          </Text>
        </Descriptions.Item>
      </Descriptions>

      {/* Additional Notes */}
      <Card
        style={{
          marginTop: 16,
          background: '#fffbe6',
          border: '1px solid #ffe58f'
        }}
      >
        <Space direction="vertical" size={8}>
          <Text strong style={{ color: '#faad14' }}>Note:</Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            All specifications are provided by the manufacturer and may vary.
            Please contact us if you need more detailed information about this product.
          </Text>
        </Space>
      </Card>
    </div>
  );
};

// Reviews Tab Component
const ReviewsTab: React.FC<ReviewsTabProps> = ({ productId, onReviewCountChange }) => {
    return <ProductReviews productId={productId} onReviewCountChange={onReviewCountChange} />;
};
export default ProductDetailTabs;
