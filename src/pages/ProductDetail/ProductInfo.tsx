// ===========================
import React, { useState } from 'react';
import { Card, message } from 'antd';
import ProductHeader from './ProductHeader';
import ProductPricing from './ProductPricing';
import ProductActions from './ProductActions';
import ProductServices from './ProductServices';
import ProductDetailTabs from './ProductDetailTabs';
import { cartApi } from "../../api/cart.api";
import { useNavigate } from "react-router-dom";
import { ProductsResponseDto } from "../../@type/productsResponse";

interface ProductInfoProps {
    product: ProductsResponseDto;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const navigate = useNavigate();

    const handleBuyNow = async () => {
        try {
            const res = await cartApi.addToCart(product.id, quantity);
            if (res.success) {
                navigate("/cart");
                window.dispatchEvent(new CustomEvent("cartUpdated"));
            } else {
                message.error(res.message || "Unable to add to cart, please try again!");
            }
        } catch (error) {
            console.error("Add to cart error:", error);
            message.error("Unable to add to cart, please try again!");
        }
    };

    const handleAddToCart = async () => {
        try {
            const res = await cartApi.addToCart(product.id, quantity);
            message.success(`Added ${quantity} item(s) to the cart !`);
            console.log("Cart API response:", res);

            window.dispatchEvent(new CustomEvent("cartUpdated"));

        } catch (error) {
            console.error("Add to cart error:", error);
            message.error("Unable to add to cart, please try again!");
        }
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
