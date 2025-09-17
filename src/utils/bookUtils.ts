import { Book } from '../@type/book';
import {cartApi} from "../api/cart.api";
import {message} from "antd";


export const handleAddToCart = async (book: Book) => {
  try {
    const res = await cartApi.addToCart(book.id, 1);
    message.success("Thêm vào giỏ hàng thành công!");
    console.log("Cart API response:", res);
  } catch (error) {
    message.error("Không thể thêm vào giỏ hàng, vui lòng thử lại!");
    console.error("Add to cart error:", error);
  }
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const getTop = <T>(
    arr: T[],
    compareFn: (a: T, b: T) => number,
    count = 3
): T[] => {
  return [...arr].sort(compareFn).slice(0, count);
};
