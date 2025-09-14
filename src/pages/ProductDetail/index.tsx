// ProductDetail.tsx - Main component
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Breadcrumb, Row, Col, Skeleton, Alert, Button } from 'antd';
import { BookOutlined } from "@ant-design/icons";
import { ProductsResponseDto } from '../../@type/productsResponse';
import { getProductById } from "../../api/products.api";
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductsResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          setError('Product id is missing');
          return;
        }
        const res = await getProductById(Number(id));
        if (res.success && res.data) {
          setProduct(res.data);
        } else {
          setError('Failed to load product');
        }
      } catch (e) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;
  if (error || !product) return <ProductNotFound error={error} />;

  return (
      <div style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        padding: '24px 12px'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <ProductBreadcrumb product={product} />

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={11}>
              <ProductImageGallery product={product} />
            </Col>
            <Col xs={24} lg={13}>
              <ProductInfo product={product} />
            </Col>
          </Row>
        </div>
      </div>
  );
};

// Loading Component
const ProductDetailSkeleton: React.FC = () => (
    <div style={{ padding: '48px 24px', maxWidth: 1400, margin: '0 auto' }}>
      <Skeleton.Image active style={{ width: '100%', height: 400 }} />
      <Skeleton active paragraph={{ rows: 8 }} style={{ marginTop: 24 }} />
    </div>
);

// Error Component
const ProductNotFound: React.FC<{ error: string | null }> = ({ error }) => (
    <div style={{
      padding: '48px 24px',
      maxWidth: 1200,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh'
    }}>
      <Card style={{ textAlign: 'center', maxWidth: 500 }}>
        <Alert
            type="error"
            message="Oops! Product not found"
            description={error || 'The product you\'re looking for might have been removed or doesn\'t exist.'}
            showIcon
            style={{ marginBottom: 24 }}
        />
        <Button type="primary" size="large">
          <Link to="/shop">← Back to Shop</Link>
        </Button>
      </Card>
    </div>
);

// Breadcrumb Component
const ProductBreadcrumb: React.FC<{ product: ProductsResponseDto }> = ({ product }) => (
    <Card
        style={{
          marginBottom: 24,
          borderRadius: 16,
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        bodyStyle={{ padding: '16px 24px' }}
    >
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/shop" style={{ color: '#1890ff' }}>
            <BookOutlined /> Shop
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{product.category?.categoryName}</Breadcrumb.Item>
        <Breadcrumb.Item className="current-page">{product.productName}</Breadcrumb.Item>
      </Breadcrumb>
    </Card>
);

export default ProductDetail;