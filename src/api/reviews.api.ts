

// // src/api/reviews.api.ts
// import apiClient from "../services/api";
// import { ApiResponse } from "../@type/apiResponse";
// import {
//     ReviewResponse,
//     CreateReviewRequest,
//     UpdateReviewRequest,
//     CreateReplyRequest
// } from "../@type/Orders";

// // Customer Review Functions
// export const createReview = async (reviewData: CreateReviewRequest): Promise<{
//     success: boolean;
//     result?: ApiResponse<ReviewResponse>;
//     error?: any;
// }> => {
//     try {
//         const formData = new FormData();
//         formData.append('orderId', reviewData.orderId.toString());
//         formData.append('productId', reviewData.productId.toString());
//         formData.append('rating', reviewData.rating.toString());
//         formData.append('comment', reviewData.comment);
        
//         // Add review images
//         reviewData.reviewImages.forEach((file, index) => {
//             formData.append('reviewImages', file);
//         });

//         const response = await apiClient.post<ApiResponse<ReviewResponse>>('/reviews', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
        
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// export const updateReview = async (reviewId: number, updateData: UpdateReviewRequest): Promise<{
//     success: boolean;
//     result?: ApiResponse<ReviewResponse>;
//     error?: any;
// }> => {
//     try {
//         const formData = new FormData();
        
//         if (updateData.rating !== undefined) {
//             formData.append('rating', updateData.rating.toString());
//         }
//         if (updateData.comment) {
//             formData.append('comment', updateData.comment);
//         }
//         if (updateData.imagesToDelete && updateData.imagesToDelete.length > 0) {
//             updateData.imagesToDelete.forEach(id => {
//                 formData.append('imagesToDelete', id.toString());
//             });
//         }
//         if (updateData.newReviewImages && updateData.newReviewImages.length > 0) {
//             updateData.newReviewImages.forEach(file => {
//                 formData.append('newReviewImages', file);
//             });
//         }

//         const response = await apiClient.put<ApiResponse<ReviewResponse>>(
//             `/reviews/${reviewId}`, 
//             formData,
//             {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             }
//         );
        
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// export const deleteReview = async (reviewId: number): Promise<{
//     success: boolean;
//     result?: ApiResponse<boolean>;
//     error?: any;
// }> => {
//     try {
//         const response = await apiClient.delete<ApiResponse<boolean>>(`/reviews/${reviewId}`);
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// // Get Reviews Functions
// export const getReviewById = async (reviewId: number): Promise<{
//     success: boolean;
//     result?: ApiResponse<ReviewResponse>;
//     error?: any;
// }> => {
//     try {
//         const response = await apiClient.get<ApiResponse<ReviewResponse>>(`/reviews/${reviewId}`);
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// export const getProductReviews = async (productId: number): Promise<{
//     success: boolean;
//     result?: ApiResponse<ReviewResponse[]>;
//     error?: any;
// }> => {
//     try {
//         const response = await apiClient.get<ApiResponse<ReviewResponse[]>>(`/reviews/product/${productId}`);
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// export const getOrderReviews = async (orderId: number): Promise<{
//     success: boolean;
//     result?: ApiResponse<ReviewResponse[]>;
//     error?: any;
// }> => {
//     try {
//         const response = await apiClient.get<ApiResponse<ReviewResponse[]>>(`/reviews/order/${orderId}`);
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// export const getMyReviews = async (): Promise<{
//     success: boolean;
//     result?: ApiResponse<ReviewResponse[]>;
//     error?: any;
// }> => {
//     try {
//         const response = await apiClient.get<ApiResponse<ReviewResponse[]>>('/reviews/my-reviews');
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// export const getProductReviewStats = async (productId: number): Promise<{
//     success: boolean;
//     result?: ApiResponse<{
//         averageRating: number;
//         reviewCount: number;
//         ratingDistribution: Array<{ rating: number; count: number }>;
//     }>;
//     error?: any;
// }> => {
//     try {
//         const response = await apiClient.get(`/reviews/product/${productId}/stats`);
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// // Reply Functions
// export const addReply = async (reviewId: number, replyData: CreateReplyRequest): Promise<{
//     success: boolean;
//     result?: ApiResponse<any>;
//     error?: any;
// }> => {
//     try {
//         const response = await apiClient.post(`/reviews/${reviewId}/replies`, replyData);
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// export const deleteReply = async (replyId: number): Promise<{
//     success: boolean;
//     result?: ApiResponse<boolean>;
//     error?: any;
// }> => {
//     try {
//         const response = await apiClient.delete<ApiResponse<boolean>>(`/reviews/replies/${replyId}`);
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// // Helper functions for MyOrders component
// export const getOrderReviewInfo = async (orderId: number): Promise<{
//     success: boolean;
//     result?: ApiResponse<any>;
//     error?: any;
// }> => {
//     try {
//         // This would be a custom endpoint to check review status for order products
//         const response = await apiClient.get(`/orders/${orderId}/review-info`);
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// export const getExistingReview = async (productId: number, orderId: number): Promise<{
//     success: boolean;
//     result?: ApiResponse<ReviewResponse>;
//     error?: any;
// }> => {
//     try {
//         // Get reviews for specific product and order
//         const response = await apiClient.get(`/reviews/product/${productId}?orderId=${orderId}`);
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// // Admin Functions (if needed)
// export const getPendingReviews = async (): Promise<{
//     success: boolean;
//     result?: ApiResponse<ReviewResponse[]>;
//     error?: any;
// }> => {
//     try {
//         const response = await apiClient.get<ApiResponse<ReviewResponse[]>>('/reviews/pending');
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// export const approveReview = async (reviewId: number): Promise<{
//     success: boolean;
//     result?: ApiResponse<boolean>;
//     error?: any;
// }> => {
//     try {
//         const response = await apiClient.post<ApiResponse<boolean>>(`/reviews/${reviewId}/approve`);
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };

// export const rejectReview = async (reviewId: number, reason: string): Promise<{
//     success: boolean;
//     result?: ApiResponse<boolean>;
//     error?: any;
// }> => {
//     try {
//         const response = await apiClient.post<ApiResponse<boolean>>(`/reviews/${reviewId}/reject`, reason);
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };


// // Admin function: Get all reviews
// export const getAllReviews = async (): Promise<{
//     success: boolean;
//     result?: ApiResponse<ReviewResponse[]>;
//     error?: any;
// }> => {
//     try {
//         const response = await apiClient.get<ApiResponse<ReviewResponse[]>>('/reviews');
//         return { success: true, result: response.data };
//     } catch (error: any) {
//         return {
//             success: false,
//             error: error.response?.data || { message: "Unknown error" },
//         };
//     }
// };


// src/api/reviews.api.ts
import apiClient from "../services/api";
import { ApiResponse } from "../@type/apiResponse";
import {
  ReviewResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
  CreateReplyRequest
} from "../@type/Orders";

/**
 * All functions return a consistent shape:
 * { success: boolean, result?: ApiResponse<T>, error?: any }
 */

// Create review (customer)
export const createReview = async (reviewData: CreateReviewRequest): Promise<{
  success: boolean;
  result?: ApiResponse<ReviewResponse>;
  error?: any;
}> => {
  try {
    const formData = new FormData();
    formData.append('orderId', reviewData.orderId.toString());
    formData.append('productId', reviewData.productId.toString());
    formData.append('rating', reviewData.rating.toString());
    formData.append('comment', reviewData.comment ?? '');

    (reviewData.reviewImages || []).forEach((file) => {
      formData.append('reviewImages', file);
    });

    const response = await apiClient.post<ApiResponse<ReviewResponse>>('/reviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Update review
export const updateReview = async (reviewId: number, updateData: UpdateReviewRequest): Promise<{
  success: boolean;
  result?: ApiResponse<ReviewResponse>;
  error?: any;
}> => {
  try {
    const formData = new FormData();
    if (updateData.rating !== undefined) formData.append('rating', updateData.rating.toString());
    if (updateData.comment) formData.append('comment', updateData.comment);
    (updateData.imagesToDelete || []).forEach(id => formData.append('imagesToDelete', id.toString()));
    (updateData.newReviewImages || []).forEach(file => formData.append('newReviewImages', file));

    const response = await apiClient.put<ApiResponse<ReviewResponse>>(`/reviews/${reviewId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Delete review
export const deleteReview = async (reviewId: number): Promise<{
  success: boolean;
  result?: ApiResponse<boolean>;
  error?: any;
}> => {
  try {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/reviews/${reviewId}`);
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Get review by id
export const getReviewById = async (reviewId: number): Promise<{
  success: boolean;
  result?: ApiResponse<ReviewResponse>;
  error?: any;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<ReviewResponse>>(`/reviews/${reviewId}`);
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Get reviews for one product (product detail)
export const getProductReviews = async (productId: number): Promise<{
  success: boolean;
  result?: ApiResponse<ReviewResponse[]>;
  error?: any;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<ReviewResponse[]>>(`/reviews/product/${productId}`);
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Get reviews for an order
export const getOrderReviews = async (orderId: number): Promise<{
  success: boolean;
  result?: ApiResponse<ReviewResponse[]>;
  error?: any;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<ReviewResponse[]>>(`/reviews/order/${orderId}`);
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Get current user's reviews
export const getMyReviews = async (): Promise<{
  success: boolean;
  result?: ApiResponse<ReviewResponse[]>;
  error?: any;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<ReviewResponse[]>>('/reviews/my-reviews');
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Get product review stats
export const getProductReviewStats = async (productId: number): Promise<{
  success: boolean;
  result?: ApiResponse<{
    averageRating: number;
    reviewCount: number;
    ratingDistribution: Array<{ rating: number; count: number }>;
  }>;
  error?: any;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(`/reviews/product/${productId}/stats`);
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Add reply to review
export const addReply = async (reviewId: number, replyData: CreateReplyRequest): Promise<{
  success: boolean;
  result?: ApiResponse<any>;
  error?: any;
}> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(`/reviews/${reviewId}/replies`, replyData);
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Delete reply
export const deleteReply = async (replyId: number): Promise<{
  success: boolean;
  result?: ApiResponse<boolean>;
  error?: any;
}> => {
  try {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/reviews/replies/${replyId}`);
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Admin: Get pending reviews
export const getPendingReviews = async (): Promise<{
  success: boolean;
  result?: ApiResponse<ReviewResponse[]>;
  error?: any;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<ReviewResponse[]>>('/reviews/pending');
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Admin: Get all reviews (for admin list)
// NOTE: change endpoint to your backend admin route if different (e.g. '/admin/reviews')
export const getAllReviews = async (): Promise<{
  success: boolean;
  result?: ApiResponse<ReviewResponse[]>;
  error?: any;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<ReviewResponse[]>>('/reviews'); // <-- adjust if backend path differs
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Admin: approve review
export const approveReview = async (reviewId: number): Promise<{
  success: boolean;
  result?: ApiResponse<boolean>;
  error?: any;
}> => {
  try {
    const response = await apiClient.post<ApiResponse<boolean>>(`/reviews/${reviewId}/approve`);
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Admin: reject review (send reason as object)
export const rejectReview = async (reviewId: number, reason: string): Promise<{
  success: boolean;
  result?: ApiResponse<boolean>;
  error?: any;
}> => {
  try {
    // send reason in request body (server expect JSON)
    const response = await apiClient.post<ApiResponse<boolean>>(`/reviews/${reviewId}/reject`, { reason });
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Helper: order review info (for orders page)
export const getOrderReviewInfo = async (orderId: number): Promise<{
  success: boolean;
  result?: ApiResponse<any>;
  error?: any;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(`/orders/${orderId}/review-info`);
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};

// Get existing review for product + order
export const getExistingReview = async (productId: number, orderId: number): Promise<{
  success: boolean;
  result?: ApiResponse<ReviewResponse>;
  error?: any;
}> => {
  try {
    const response = await apiClient.get<ApiResponse<ReviewResponse>>(`/reviews/product/${productId}?orderId=${orderId}`);
    return { success: true, result: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || { message: 'Unknown error' } };
  }
};


export const updateReviewVisibility = async (reviewId: number, isHidden: boolean) => {
  // API call để cập nhật trạng thái ẩn/hiện
};