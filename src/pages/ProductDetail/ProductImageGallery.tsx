import React, { useState } from 'react';
import { Card, Image, Badge, Button, Tooltip, Modal, message, Space, Typography } from 'antd';
import { HeartOutlined, ShareAltOutlined, EyeOutlined, LinkOutlined, FacebookOutlined, QrcodeOutlined, CloseOutlined } from "@ant-design/icons";
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProductsResponseDto } from "../../@type/productsResponse";
import { useWishlist } from "../../hooks/useWishlist"; // <-- import hook chung

const { Title, Text } = Typography;

interface ProductImageGalleryProps {
    product: ProductsResponseDto;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ product }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    // dùng chung wishlist hook
    const { handleWishlistToggle, isInWishlist } = useWishlist();

    const images = product.photos?.length
        ? product.photos.map(p => p.photoUrl)
        : ['https://via.placeholder.com/600x800?text=No+Image'];

    const primaryImage = images[selectedImageIndex];

    const sliderSettings = {
        dots: false,
        infinite: images.length > 4,
        speed: 500,
        slidesToShow: Math.min(images.length, 4),
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 480, settings: { slidesToShow: 2 } }
        ]
    };

    return (
        <Card
            style={{
                borderRadius: 20,
                overflow: 'hidden',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }}
            bodyStyle={{ padding: 0 }}
        >
            <div style={{ position: 'relative' }}>
                <Badge.Ribbon
                    text="Bestseller"
                    color="red"
                    style={{ display: product.isActive ? 'block' : 'none' }}
                >
                    <Image
                        src={primaryImage}
                        alt={product.productName}
                        width="100%"
                        height={500}
                        style={{
                            objectFit: 'cover',
                            background: '#f8f9fa'
                        }}
                        preview={{
                            mask: (
                                <div
                                    style={{
                                        background: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: 20,
                                        fontSize: 14
                                    }}
                                >
                                    <EyeOutlined /> View larger
                                </div>
                            )
                        }}
                    />
                </Badge.Ribbon>

                <ImageActionButtons
                    productId={product.id}
                    productName={product.productName}
                    isWishlisted={isInWishlist(product.id)}
                    onToggleWishlist={() => handleWishlistToggle(product)}
                />
            </div>

            {images.length > 1 && (
                <ImageThumbnailSlider
                    images={images}
                    selectedImageIndex={selectedImageIndex}
                    onImageSelect={setSelectedImageIndex}
                    sliderSettings={sliderSettings}
                />
            )}
        </Card>
    );
};

// Image Action Buttons Component
const ImageActionButtons: React.FC<{
    isWishlisted: boolean;
    onToggleWishlist: () => void;
    productId: number;
    productName: string;
}> = ({ isWishlisted, onToggleWishlist, productId, productName }) => {
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const currentUrl = `${window.location.origin}/product/${productId}`;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            message.success("Link has been copied!");
            setShareModalVisible(false);
        } catch (err) {
            message.error("Unable to copy the link");
        }
    };


    const shareOptions = [
        {
            key: 'copy',
            icon: <LinkOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
            title: 'Copy Link',
            description: 'Copy the product URL',
            color: '#e6f7ff',
            onClick: copyLink
        },
        {
            key: 'facebook',
            icon: <FacebookOutlined style={{ fontSize: 20, color: '#1877f2' }} />,
            title: 'Share on Facebook',
            description: 'Post to Facebook',
            color: '#e7f3ff',
            onClick: () => {
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
                    "_blank",
                    "width=600,height=400"
                );
                setShareModalVisible(false);
            }
        },
        {
            key: 'zalo',
            icon: <QrcodeOutlined style={{ fontSize: 20, color: '#0068ff' }} />,
            title: 'Share on Zalo',
            description: 'Send via Zalo',
            color: '#f0f5ff',
            onClick: () => {
                window.open(
                    `https://zalo.me/share?url=${encodeURIComponent(currentUrl)}`,
                    "_blank",
                    "width=600,height=400"
                );
                setShareModalVisible(false);
            }
        }
    ];


    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                }}
            >
                <Tooltip title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
                    <Button
                        shape="circle"
                        icon={<HeartOutlined />}
                        onClick={onToggleWishlist}
                        style={{
                            background: isWishlisted ? '#ff4d4f' : 'white',
                            color: isWishlisted ? 'white' : '#666',
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    />
                </Tooltip>

                <Tooltip title="Share product">
                    <Button
                        shape="circle"
                        icon={<ShareAltOutlined />}
                        onClick={() => setShareModalVisible(true)}
                        style={{
                            background: 'white',
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    />
                </Tooltip>
            </div>

            <Modal
                title={null}
                open={shareModalVisible}
                onCancel={() => setShareModalVisible(false)}
                footer={null}
                width={420}
                centered
                closeIcon={null}
                styles={{
                    content: {
                        borderRadius: 16,
                        padding: 0,
                        overflow: 'hidden'
                    }
                }}
            >
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '24px 24px 16px',
                    position: 'relative'
                }}>
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setShareModalVisible(false)}
                        style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            color: 'white',
                            border: 'none'
                        }}
                    />
                    <Title level={4} style={{ color: 'white', margin: 0, textAlign: 'center' }}>
                        Share Product
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', display: 'block', textAlign: 'center', marginTop: 4 }}>
                        {productName}
                    </Text>
                </div>

                <div style={{ padding: '24px' }}>
                    <Space direction="vertical" style={{ width: '100%' }} size={12}>
                        {shareOptions.map((option) => (
                            <div
                                key={option.key}
                                onClick={option.onClick}
                                style={{
                                    padding: '16px',
                                    borderRadius: 12,
                                    background: option.color,
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    background: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    {option.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>
                                        {option.title}
                                    </div>
                                    <div style={{ color: '#666', fontSize: 13 }}>
                                        {option.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Space>

                    <div style={{
                        marginTop: 20,
                        padding: 16,
                        background: '#f8f9fa',
                        borderRadius: 12,
                        border: '1px dashed #d9d9d9'
                    }}>
                        <Text style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 8 }}>
                            Product Link:
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: '#1890ff',
                                wordBreak: 'break-all',
                                cursor: 'pointer'
                            }}
                            onClick={copyLink}
                        >
                            {currentUrl}
                        </Text>
                    </div>
                </div>
            </Modal>
        </>
    );
};

const ImageThumbnailSlider: React.FC<{
    images: string[];
    selectedImageIndex: number;
    onImageSelect: (index: number) => void;
    sliderSettings: any;
}> = ({ images, selectedImageIndex, onImageSelect, sliderSettings }) => (
    <div style={{ padding: '20px' }}>
        <Slider {...sliderSettings}>
            {images.map((url, idx) => (
                <div key={idx} style={{ padding: '0 6px' }}>
                    <div
                        style={{
                            position: 'relative',
                            cursor: 'pointer',
                            borderRadius: 12,
                            margin: '0 10px',
                            overflow: 'hidden',
                            border:
                                selectedImageIndex === idx
                                    ? '3px solid #1890ff'
                                    : '2px solid #f0f0f0',
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => onImageSelect(idx)}
                    >
                        <Image
                            src={url}
                            width="100%"
                            height={80}
                            style={{ objectFit: 'cover' }}
                            preview={false}
                        />
                    </div>
                </div>
            ))}
        </Slider>
    </div>
);

export default ProductImageGallery;