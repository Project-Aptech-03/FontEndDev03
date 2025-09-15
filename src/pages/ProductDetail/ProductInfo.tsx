// ===========================
import React, { useState } from 'react';
import { Card } from 'antd';
import { ProductsResponseDto } from '../../../@type/productsResponse';
import ProductHeader from './ProductHeader';
import ProductPricing from './ProductPricing';
import ProductActions from './ProductActions';
import ProductServices from './ProductServices';
import ProductDetailTabs from './ProductDetailTabs';

interface ProductInfoProps {
    product: ProductsResponseDto;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const [quantity, setQuantity] = useState<number>(1);

    const handleBuyNow = () => {
        alert(`Buying ${quantity} item(s) of ${product?.productName}`);
    };

    const handleAddToCart = () => {
        alert(`Added ${quantity} item(s) to cart`);
    };

    return (
        <Card
            style={{
                borderRadius: 20,
                border: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                height: 'fit-content'
            }}
        >
            <ProductHeader product={product} />
            <ProductPricing product={product} />
            <ProductActions
                product={product}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onBuyNow={handleBuyNow}
                onAddToCart={handleAddToCart}
            />
            <ProductServices />
            <ProductDetailTabs product={product} />
        </Card>
    );
};

export default ProductInfo;