import { useState, useEffect } from 'react';
import { Book } from "../@type/book";

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Book[]>([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("Wishlist") || "[]");
    setWishlistItems(savedWishlist);
  }, []);

  const handleWishlistToggle = (book: Book) => {
    let updatedWishlist: Book[];

    if (wishlistItems.find(item => item.id === book.id)) {
      updatedWishlist = wishlistItems.filter(item => item.id !== book.id);
    } else {
      updatedWishlist = [...wishlistItems, book];
    }

    setWishlistItems(updatedWishlist);
    localStorage.setItem("Wishlist", JSON.stringify(updatedWishlist));

    // Dispatch event để Header cập nhật count
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const isInWishlist = (bookId: number) => {
    return wishlistItems.some(item => item.id === bookId);
  };

  return {
    wishlistItems,
    handleWishlistToggle,
    isInWishlist
  };
};
