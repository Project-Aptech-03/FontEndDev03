import { useState, useEffect } from 'react';
import { Book } from '../@type/book';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Book[]>([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('Wishlist') || '[]');
    setWishlist(savedWishlist);
  }, []);

  const handleWishlistToggle = (book: Book) => {
    setWishlist(prev => {
      const isInWishlist = prev.some(item => item.id === book.id);
      let updatedWishlist;
      
      if (isInWishlist) {
        updatedWishlist = prev.filter(item => item.id !== book.id);
      } else {
        updatedWishlist = [...prev, book];
      }
      
      // Save to localStorage
      localStorage.setItem('Wishlist', JSON.stringify(updatedWishlist));
      
      return updatedWishlist;
    });
  };

  const isInWishlist = (bookId: number) => {
    return wishlist.some(item => item.id === bookId);
  };

  return { wishlist, handleWishlistToggle, isInWishlist };
};
