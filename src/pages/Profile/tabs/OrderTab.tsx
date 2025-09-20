import React, { useEffect, useState } from "react";
import {
    Card,
    List,
    Tag,
    Button,
    Descriptions,
    Modal,
    message,
    Spin,
    Image,
    Typography,
} from "antd";
import dayjs from "dayjs";
import { ApiOrder } from "../../../@type/Orders";
import { cancelOrder, getMyOrders } from "../../../api/orders.api";
import { getProductById } from "../../../api/products.api";
import {ProductsResponseDto} from "../../../@type/productsResponse";

const { Title, Paragraph } = Typography;

const OrderTab: React.FC = () => {
    const [orders, setOrders] = useState<ApiOrder[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [productDetail, setProductDetail] = useState<ProductsResponseDto | null>(
        null
    );
    const [productLoading, setProductLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        const res = await getMyOrders();
        if (res.success && res.result?.data) {
            setOrders(res.result.data);
        } else {
            message.error("Không thể tải danh sách đơn hàng");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const [productImages, setProductImages] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchImages = async () => {
            for (const order of orders) {
                for (const item of order.orderItems) {
                    if (!productImages[item.productId]) {
                        const res = await getProductById(item.productId);
                        if (res.success && res.data.photos.length > 0) {
                            setProductImages((prev) => ({
                                ...prev,
                                [item.productId]: res.data.photos[0].photoUrl,
                            }));
                        }
                    }
                }
            }
        };
        if (orders.length > 0) fetchImages();
    }, [orders]);

    const handleCancelOrder = (orderId: number) => {
        Modal.confirm({
            title: "Confirm Cancellation",
            content: "Are you sure you want to cancel this order?",
            okText: "Cancel Order",
            okButtonProps: { danger: true },
            cancelText: "Close",
            async onOk() {
                const res = await cancelOrder(orderId, {
                    reason: "User requested cancellation",
                });
                if (res.success) {
                    message.success("Order has been successfully cancelled");
                    fetchOrders();
                } else {
                    message.error(res.error?.message || "Failed to cancel the order");
                }
            },
        });
    };

    const handleViewProduct = async (productId: number) => {
        setProductLoading(true);
        try {
            const res = await getProductById(productId);
            if (res.success) {
                setProductDetail(res.data);
                setIsModalVisible(true);
            } else {
                message.error("Unable to load product information");
            }
        } catch (err) {
            console.error(err);
            message.error("Error while loading product information");
        } finally {
            setProductLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Spin size="large" tip="Đang tải đơn hàng..." />
            </div>
        );
    }

    return (
        <div style={{maxWidth: 900, margin: "0 auto"}}>
            <List
                itemLayout="vertical"
                dataSource={orders}
                renderItem={(order) => (
                    <Card
                        key={order.id}
                        title={
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                        <span>
                            Order <b>{order.orderNumber}</b>
                        </span>
                                <Tag
                                    color={order.orderStatus === "Pending" ? "orange" : "green"}
                                >
                                    {order.orderStatus}
                                </Tag>
                            </div>
                        }
                        style={{marginBottom: 20, borderRadius: 12}}
                        extra={
                            order.orderStatus === "Pending" && (
                                <Button danger onClick={() => handleCancelOrder(order.id)}>
                                    Cancel Order
                                </Button>
                            )
                        }
                    >
                        {/* Order Information */}
                        <Descriptions
                            column={2}
                            size="small"
                            bordered
                            style={{marginBottom: 16}}
                        >
                            <Descriptions.Item label="Order Date">
                                {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment">
                                {order.paymentType}
                            </Descriptions.Item>
                            <Descriptions.Item label="Subtotal">
                                {order.subtotal.toLocaleString()} VND
                            </Descriptions.Item>
                            <Descriptions.Item label="Shipping Fee">
                                {order.deliveryAddress?.displayShippingFee}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Amount" span={2}>
                                <b style={{color: "#d4380d"}}>
                                    {order.totalAmount.toLocaleString()} VND
                                </b>
                            </Descriptions.Item>
                        </Descriptions>

                        {/* Shipping Address */}
                        <Card
                            size="small"
                            type="inner"
                            title="Shipping Address"
                            style={{marginBottom: 16}}
                        >
                            <p>{order.deliveryAddress?.displayAddress}</p>
                            <p>{order.deliveryAddress?.displayContactInfo}</p>
                            <p>{order.deliveryAddress?.displayDistance}</p>
                        </Card>

                        {/* Product List */}
                        <List
                            size="small"
                            header={<b>Products in Order</b>}
                            dataSource={order.orderItems}
                            renderItem={(item) => (
                                <List.Item
                                    key={item.id}
                                    style={{
                                        padding: "12px 8px",
                                        borderBottom: "1px solid #f0f0f0",
                                        borderRadius: 8,
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <img
                                                src={
                                                    item.product?.photos?.[0]?.photoUrl ||
                                                    "https://via.placeholder.com/60x80?text=No+Image"
                                                }
                                                alt={item.product?.productName}
                                                style={{
                                                    width: 60,
                                                    height: 80,
                                                    objectFit: "cover",
                                                    borderRadius: 6,
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleViewProduct(item.productId)}
                                            />
                                        }
                                        title={
                                            <span
                                                style={{cursor: "pointer", color: "#1677ff", fontWeight: 500}}
                                                onClick={() => handleViewProduct(item.productId)}
                                            >
                                        {item.product?.productName}
                                    </span>
                                        }
                                        description={
                                            <div style={{fontSize: 13, color: "#666"}}>
                                                Quantity: <b>{item.quantity}</b>
                                            </div>
                                        }
                                    />
                                    <div style={{fontWeight: 600, color: "#d4380d"}}>
                                        {item.totalPrice.toLocaleString()} VND
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                )}
            />

            {/* Product Detail Modal */}
            <Modal
                title="Product Details"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
            >
                {productLoading ? (
                    <Spin size="large"/>
                ) : productDetail ? (
                    <div>
                        <Image
                            src={productDetail.photos[0]?.photoUrl}
                            alt={productDetail.productName}
                            width={200}
                            style={{borderRadius: 8, marginBottom: 16}}
                        />
                        <Title level={4}>{productDetail.productName}</Title>
                        <Paragraph>{productDetail.description}</Paragraph>
                        <p>
                            <b>Product Code:</b> {productDetail.productCode}
                        </p>
                        <p>
                            <b>Price:</b>{" "}
                            <span style={{color: "#d4380d"}}>
                        {productDetail.price.toLocaleString()} VND
                    </span>
                        </p>
                        <p>
                            <b>Manufacturer:</b> {productDetail.manufacturer?.manufacturerName}
                        </p>
                    </div>
                ) : (
                    <p>No product information available</p>
                )}
            </Modal>
        </div>
    );
};

export default OrderTab;
