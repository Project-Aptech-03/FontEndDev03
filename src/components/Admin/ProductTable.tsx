import React from 'react';
import { Table, Button, Space, Popconfirm, Tag, Tooltip, Image, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {AdminProduct, ProductPhoto, Publisher} from '../../@type/adminProduct';

const { Text } = Typography;

interface ProductTableProps {
  products: AdminProduct[];
  loading: boolean;
  onEdit: (product: AdminProduct) => void;
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  onEdit,
  onDelete
}) => {
  const columns = [
    {
      title: "Image",
      dataIndex: "photos",
      key: "photos",
      width: 80,
      render: (photos: ProductPhoto[] | undefined, record: AdminProduct) =>
          photos && photos.length > 0 ? (
              <Image
                  src={photos[0].photoUrl}
                  alt={record.productName}
                  width={50}
                  height={50}
                  style={{
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #f0f0f0",
                  }}
                  fallback="https://via.placeholder.com/50x50?text=No+Img"
              />
          ) : (
              <Text type="secondary">No Image</Text>
          ),
    },
    { 
      title: "Product Code", 
      dataIndex: "productCode", 
      key: "productCode",
      width: 120,
      render: (code: string) => (
        <Text code style={{ fontSize: 12 }}>{code}</Text>
      )
    },
    { 
      title: "Product Name", 
      dataIndex: "productName", 
      key: "productName",
      ellipsis: {
        showTitle: false,
      },
      render: (name: string) => (
        <Tooltip placement="topLeft" title={name}>
          <Text strong>{name}</Text>
        </Tooltip>
      )
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (author: string) => (
        <Tooltip placement="topLeft" title={author}>
          <Text>{author}</Text>
        </Tooltip>
      )
    },
    {
      title: "Type",
      dataIndex: "productType",
      key: "productType",
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'book' ? 'blue' : type === 'stationery' ? 'green' : 'orange'}>
          {type}
        </Tag>
      )
    },
    {
      title: "Category",
      key: "category",
      width: 120,
      render: (_: any, record: AdminProduct) => (
          <Tag color="blue">{record.category?.categoryName || "N/A"}</Tag>
      ),
    },
    {
      title: "Manufacturer",
      key: "manufacturer",
      width: 160,
      ellipsis: { showTitle: false },
      render: (_: any, record: AdminProduct) => (
          <Tooltip placement="topLeft" title={record.manufacturer?.manufacturerName || "N/A"}>
            <Text>{record.manufacturer?.manufacturerName || "N/A"}</Text>
          </Tooltip>
      ),
    },
      {
        title: "Publisher",
        key: "publisher",
        width: 160,
        ellipsis: { showTitle: false },
        render: (_: Publisher, record: AdminProduct) => (
            <Tooltip placement="topLeft" title={record.publisher?.publisherName || "N/A"}>
              <Text>{record.publisher?.publisherName || "N/A"}</Text>
            </Tooltip>
        ),
      },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (price: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${price.toLocaleString()}
        </Text>
      ),
      sorter: (a: AdminProduct, b: AdminProduct) => a.price - b.price,
    },
    {
      title: "Pages",
      dataIndex: "pages",
      key: "pages",
      width: 80,
      render: (pages: number) => (
        <Text>{pages}</Text>
      ),
      sorter: (a: AdminProduct, b: AdminProduct) => a.pages - b.pages,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      width: 80,
      render: (weight: number) => (
        <Text>{weight}kg</Text>
      ),
      sorter: (a: AdminProduct, b: AdminProduct) => a.weight - b.weight,
    },
    {
      title: "Stock",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      width: 80,
      render: (stock: number) => (
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock}
        </Tag>
      ),
      sorter: (a: AdminProduct, b: AdminProduct) => a.stockQuantity - b.stockQuantity,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 80,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: never, record: AdminProduct) => record.isActive === value,
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      fixed: 'right' as const,
      render: (_: never, record: AdminProduct) => (
        <Space size="small">
          <Tooltip title="Edit Product">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product? This action cannot be undone."
            onConfirm={() => onDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okType="danger"
            icon={<DeleteOutlined style={{ color: 'red' }} />}
          >
            <Tooltip title="Delete Product">
              <Button 
                danger 
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 8, 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <Table 
        dataSource={products} 
        columns={columns} 
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `Showing ${range[0]}-${range[1]} of ${total} products`,
          pageSizeOptions: ['10', '20', '50', '100'],
          size: 'default',
        }}
        scroll={{ x: 1600 }}
        size="middle"
        bordered={false}
        style={{ margin: 0 }}
      />
    </div>
  );
};

export default ProductTable;
