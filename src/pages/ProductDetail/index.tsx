import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, Card, Typography, Image, Tag, Space, Row, Col, Divider, Skeleton, Alert, Button } from 'antd';
import { getProductById } from '../../api/adminProducts.api';
import { ProductsResponseDto } from '../../@type/productsResponse';

const { Title, Text, Paragraph } = Typography;

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

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          type="error"
          message="Unable to load product"
          description={error || 'Unknown error'}
          showIcon
        />
        <div style={{ marginTop: 16 }}>
          <Button type="primary">
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const primaryImage = product.photos && product.photos.length > 0
    ? product.photos[0]
    : 'https://via.placeholder.com/600x800?text=No+Image';

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ borderRadius: 12 }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            <Link to="/shop">Shop</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{product.productName}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={10}>
            <Image
              src={primaryImage}
              alt={product.productName}
              width="100%"
              style={{ borderRadius: 8 }}
            />
            {product.photos && product.photos.length > 1 && (
              <Space wrap style={{ marginTop: 12 }}>
                {product.photos.slice(1, 6).map((url, idx) => (
                  <Image key={idx} src={url} width={80} height={100} style={{ objectFit: 'cover', borderRadius: 6 }} />
                ))}
              </Space>
            )}
          </Col>
          <Col xs={24} md={14}>
            <Title level={2} style={{ marginTop: 0 }}>{product.productName}</Title>
            <Space size="small" wrap>
              <Tag color="blue">{product.productType}</Tag>
              {product.category && <Tag>{product.category.categoryName}</Tag>}
              {product.isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
            </Space>
            <div style={{ marginTop: 12 }}>
              <Text type="secondary">Author:</Text> <Text strong>{product.author}</Text>
            </div>
            <div style={{ marginTop: 8 }}>
              <Title level={3} style={{ color: '#52c41a', margin: 0 }}>$ {product.price.toFixed(2)}</Title>
              <Text>In stock: {product.stockQuantity}</Text>
            </div>
            <Divider />
            <div>
              <Title level={4}>Description</Title>
              <Paragraph>{product.description}</Paragraph>
            </div>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary">Pages</Text>
                <div><Text strong>{product.pages}</Text></div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Weight</Text>
                <div><Text strong>{product.weight} kg</Text></div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Dimensions</Text>
                <div><Text strong>{product.dimensions}</Text></div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Created</Text>
                <div><Text strong>{new Date(product.createdDate).toLocaleString()}</Text></div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Manufacturer</Text>
                <div><Text strong>{product.manufacturer ? product.manufacturer.manufacturerName : 'N/A'}</Text></div>
              </Col>
              <Col span={12}>
                <Text type="secondary">Publisher</Text>
                <div><Text strong>{product.publisher ? product.publisher.publisherName : 'N/A'}</Text></div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetail;


