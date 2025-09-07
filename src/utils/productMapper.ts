import { Book } from '../@type/book';
import { ProductsResponseDto } from '../@type/productsResponse';

export const mapProductToBook = (product: ProductsResponseDto): Book => {
  return {
    id: product.id,
    title: product.productName,
    author: product.author,
    price: product.price,
    originalPrice: product.price * 1.2,
    rating: 4.5, 
    reviewCount: Math.floor(Math.random() * 200) + 50,
    category: product.category ? product.category.categoryName : 'N/A',
    image: product.photos && product.photos.length > 0 
      ? product.photos[0] 
      : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    description: product.description,
    inStock: product.isActive && (product.stockQuantity || 0) > 0,
    productCode: product.productCode,
    productType: product.productType,
    pages: product.pages,
    dimensions: product.dimensions,
    weight: product.weight,
    stockQuantity: product.stockQuantity,
    createdDate: product.createdDate,
    manufacturer: product.manufacturer ? product.manufacturer.manufacturerName : 'N/A',
    publisher: product.publisher ? product.publisher.publisherName : 'N/A',
    photos: product.photos
  };
};

export const mapProductsToBooks = (products: ProductsResponseDto[]): Book[] => {
  return products.map(mapProductToBook);
};
