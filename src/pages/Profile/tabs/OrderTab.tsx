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
    Pagination, Row, Col, Select,
} from "antd";
import dayjs from "dayjs";
import {ApiOrder, CancelOrderRequest} from "../../../@type/Orders";
import { cancelOrder, getMyOrders } from "../../../api/orders.api";
import { getProductById } from "../../../api/products.api";
import { ProductsResponseDto } from "../../../@type/productsResponse";
import {useNavigate} from "react-router-dom";

const { Title, Paragraph } = Typography;

const OrderTab: React.FC = () => {
    const [orders, setOrders] = useState<ApiOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState<string>("");

    const reasons = [
        "Changed delivery address",
        "No longer needed",
        "Changed order quantity",
        "Ordered wrong product type",
        "Found a better price elsewhere",
        "Delayed shipping",
        "Payment issue",
        "Received wrong information",
        "Duplicate order",
        "Other personal reasons"
    ];
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 2; // số đơn hàng mỗi trang
    // Cancel order state
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    // Modal state
    const [productDetail, setProductDetail] = useState<ProductsResponseDto | null>(null);
    const [productLoading, setProductLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const fetchOrders = async () => {
        setLoading(true);
        const res = await getMyOrders();
        if (res.success && res.result?.data) {
            setOrders(res.result.data);
        } else {
            message.error("Unable to load order history information");
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
    // 👉 Khi bấm nút Cancel Order
    const openCancelModal = (orderId: number) => {
        setSelectedOrderId(orderId);
        setReason("");
        setIsCancelModalVisible(true);
    };

    // 👉 Xác nhận hủy đơn
    const handleConfirmCancel = async () => {
        if (!selectedOrderId || !reason) {
            message.warning("Please select a cancellation reason");
            return;
        }
        const payload: CancelOrderRequest = { CancellationReason: reason };
        const res = await cancelOrder(selectedOrderId, payload);
        if (res.success) {
            message.success("Order has been successfully cancelled");
            fetchOrders();
            setIsCancelModalVisible(false);
            setReason("");
            setSelectedOrderId(null);
        } else {
            message.error(res.error?.message || "Failed to cancel the order");
        }
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

    // Tính toán dữ liệu phân trang
    const startIndex = (currentPage - 1) * pageSize;
    const currentOrders = orders.slice(startIndex, startIndex + pageSize);

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <List
                itemLayout="vertical"
                dataSource={currentOrders}
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
                        style={{ marginBottom: 20, borderRadius: 12 }}
                        extra={
                            order.orderStatus === "Pending" && (
                                <Button danger onClick={() => openCancelModal(order.id)}>
                                    Cancel Order
                                </Button>
                            )
                        }
                    >
                        {/* Order Information */}
                        <Descriptions column={2} size="small" bordered style={{ marginBottom: 16 }}>
                            <Descriptions.Item label="Order Date">
                                {dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")}
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment">
                                {order.paymentType}
                            </Descriptions.Item>
                            <Descriptions.Item label="Subtotal">
                                {order.subtotal.toLocaleString()} $
                            </Descriptions.Item>
                            <Descriptions.Item label="Shipping Fee">
                                {order.deliveryAddress?.displayShippingFee}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Amount" span={2}>
                                <b style={{ color: "#d4380d" }}>
                                    {order.totalAmount.toLocaleString()} $
                                </b>
                            </Descriptions.Item>
                        </Descriptions>

                        {/* Shipping Address */}
                        <Card
                            size="small"
                            type="inner"
                            title="Shipping Address"
                            style={{ marginBottom: 16 }}
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
                                                style={{
                                                    cursor: "pointer",
                                                    color: "#1677ff",
                                                    fontWeight: 500,
                                                }}
                                                onClick={() => handleViewProduct(item.productId)}
                                            >
                                                {item.product?.productName}
                                            </span>
                                        }
                                        description={
                                            <div style={{ fontSize: 13, color: "#666" }}>
                                                Quantity: <b>{item.quantity}</b>
                                            </div>
                                        }
                                    />
                                    <div style={{ fontWeight: 600, color: "#d4380d" }}>
                                        {item.totalPrice.toLocaleString()} $
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                )}
            />

            {/* Pagination */}
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={orders.length}
                onChange={(page) => setCurrentPage(page)}
                style={{ marginTop: 16, textAlign: "center" }}
            />

            {/* Product Detail Modal */}
            <Modal
                title={null}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={900}
                centered
                bodyStyle={{ padding: 0, borderRadius: 12, overflow: "hidden" }}
            >
                {productLoading ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <Spin size="large" />
                    </div>
                ) : productDetail ? (
                    <Card
                        bordered={false}
                        bodyStyle={{ padding: 24 }}
                        style={{ borderRadius: 12 }}
                    >
                        <Row gutter={24}>
                            {/* Image section */}
                            <Col span={10} style={{ textAlign: "center" }}>
                                <Image
                                    src={productDetail.photos[0]?.photoUrl}
                                    alt={productDetail.productName}
                                    width={280}
                                    style={{ borderRadius: 12 }}
                                    preview={true}
                                />
                            </Col>

                            {/* Product info */}
                            <Col span={14}>
                                <Title level={3} style={{ marginBottom: 12 }}>
                                    {productDetail.productName}
                                </Title>
                                <Paragraph
                                    style={{ color: "#595959", marginBottom: 16 }}
                                >
                                    {productDetail.description}
                                </Paragraph>
                                <p>
                                    <b>Product Code:</b> {productDetail.productCode}
                                </p>
                                <p>
                                    <b>Manufacturer:</b>{" "}
                                    {productDetail.manufacturer?.manufacturerName}
                                </p>
                                <p style={{ fontSize: 18, margin: "12px 0" }}>
                                    <b>Price:</b>{" "}
                                    <span style={{ color: "#d4380d", fontWeight: 600 }}>
                                    {productDetail.price.toLocaleString()} $
                                </span>
                                </p>

                                <div style={{ marginTop: 24 }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        style={{ borderRadius: 8, marginRight: 12 }}
                                        onClick={() =>
                                            navigate(`/detail-product/${productDetail.id}`)
                                        }
                                    >
                                        Buy More
                                    </Button>
                                    <Button
                                        size="large"
                                        style={{ borderRadius: 8 }}
                                        onClick={() => setIsModalVisible(false)}
                                    >
                                        Close
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                ) : (
                    <p style={{ padding: 24 }}>No product information available</p>
                )}
            </Modal>

            <Modal
                title="Cancel Order"
                open={isCancelModalVisible}
                onOk={handleConfirmCancel}
                onCancel={() => setIsCancelModalVisible(false)}
                okText="Confirm"
                cancelText="Close"
                okButtonProps={{ danger: true }}
            >
                <p>Please select the reason for cancellation:</p>
                <Select
                    placeholder="Select a reason"
                    style={{ width: "100%" }}
                    value={reason}
                    onChange={setReason}
                >
                    {reasons.map((r, index) => (
                        <Select.Option key={index} value={r}>
                            {r}
                        </Select.Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
};

export default OrderTab;
