import React, { useState } from 'react';
import { Card, Image, Badge, Button, Tooltip } from 'antd';
import { HeartOutlined, ShareAltOutlined, EyeOutlined } from "@ant-design/icons";
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProductsResponseDto } from "../../@type/productsResponse";
import { useWishlist } from "../../hooks/useWishlist"; // <-- import hook chung

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
}> = ({ isWishlisted, onToggleWishlist }) => (
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
                // onClick={handleShare}
                style={{
                    background: 'white',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
            />
        </Tooltip>
    </div>
);

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
