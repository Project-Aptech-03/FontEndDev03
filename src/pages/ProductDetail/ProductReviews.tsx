


// // src/pages/ProductDetail/ProductReviews.tsx - FIXED VERSION
// import React, { useState, useEffect } from 'react';
// import {
//   Row, Col, Card, Rate, Avatar, List, Spin, Alert,
//   Button, Space, Progress, Empty, Tag, Image, Typography,
//   Badge, Tabs
// } from 'antd';
// import {
//   StarFilled, UserOutlined, CheckCircleOutlined,
//   EyeOutlined, MessageOutlined, CalendarOutlined,
//   ClockCircleOutlined, FilterOutlined, PictureOutlined
// } from '@ant-design/icons';
// import { ReviewResponse } from "../../@type/Orders";
// import { getProductReviews, getProductReviewStats } from "../../api/reviews.api";

// const { Text, Title, Paragraph } = Typography;
// const { TabPane } = Tabs;

// interface ProductReviewsProps {
//   productId: number;
// }

// // SỬA LẠI: Sử dụng đúng backend URL
// const getBaseUrl = () => {
//   return 'https://localhost:7275'; // Backend đang chạy trên port 7275
// };

// const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
//   const [reviews, setReviews] = useState<ReviewResponse[]>([]);
//   const [allReviews, setAllReviews] = useState<ReviewResponse[]>([]);
//   const [stats, setStats] = useState<{
//     averageRating: number;
//     reviewCount: number;
//     ratingDistribution: Array<{ rating: number; count: number }>;
//   } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending'>('all');
//   const [sortBy, setSortBy] = useState<'latest' | 'highest' | 'lowest'>('latest');
//   const [baseUrl, setBaseUrl] = useState('');

//   useEffect(() => {
//     // Set base URL cho images
//     setBaseUrl(getBaseUrl());
//   }, []);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         console.log('🔄 Fetching reviews for product ID:', productId);
//         console.log('🌐 Backend URL:', baseUrl);

//         // Lấy thống kê đánh giá (bỏ qua nếu lỗi)
//         try {
//           const statsResponse = await getProductReviewStats(productId);
//           if (statsResponse.success && statsResponse.result) {
//             setStats(statsResponse.result.data);
//           }
//         } catch (statsError) {
//           console.warn('⚠️ Stats API failed, continuing without stats...');
//         }

//         // Lấy danh sách đánh giá
//         const reviewsResponse = await getProductReviews(productId);
//         console.log('📝 Reviews response:', reviewsResponse);

//         if (reviewsResponse.success && reviewsResponse.result) {
//           console.log('✅ Reviews data received:', reviewsResponse.result.data);
//           setAllReviews(reviewsResponse.result.data);

//           // Filter reviews based on active tab
//           let filteredReviews = reviewsResponse.result.data;
//           if (activeTab === 'approved') {
//             filteredReviews = filteredReviews.filter(review => review.isApproved);
//           } else if (activeTab === 'pending') {
//             filteredReviews = filteredReviews.filter(review => !review.isApproved);
//           }

//           // Sort reviews
//           let sortedReviews = [...filteredReviews];
//           switch (sortBy) {
//             case 'latest':
//               sortedReviews.sort((a, b) =>
//                 new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
//               );
//               break;
//             case 'highest':
//               sortedReviews.sort((a, b) => b.rating - a.rating);
//               break;
//             case 'lowest':
//               sortedReviews.sort((a, b) => a.rating - b.rating);
//               break;
//           }

//           setReviews(sortedReviews);
//         } else {
//           setError(reviewsResponse.error?.message || 'Failed to load reviews');
//         }

//       } catch (err) {
//         console.error('❌ Error loading reviews:', err);
//         setError('Failed to load reviews');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (baseUrl) {
//       fetchReviews();
//     }
//   }, [productId, activeTab, sortBy, baseUrl]);

//   const handleTabChange = (key: string) => {
//     setActiveTab(key as 'all' | 'approved' | 'pending');
//   };

//   const handleSortChange = (newSort: 'latest' | 'highest' | 'lowest') => {
//     setSortBy(newSort);
//   };

//   // Calculate stats from all reviews (including pending)
//   const calculateComprehensiveStats = () => {
//     if (!allReviews.length) return null;

//     const approvedReviews = allReviews.filter(review => review.isApproved);
//     const pendingReviews = allReviews.filter(review => !review.isApproved);

//     const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
//     const averageRating = totalRating / allReviews.length;

//     const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
//       rating,
//       count: allReviews.filter(review => review.rating === rating).length
//     }));

//     return {
//       averageRating,
//       reviewCount: allReviews.length,
//       approvedCount: approvedReviews.length,
//       pendingCount: pendingReviews.length,
//       ratingDistribution
//     };
//   };

//   const comprehensiveStats = calculateComprehensiveStats();

//   if (loading) {
//     return (
//       <div style={{ padding: '40px 0', textAlign: 'center' }}>
//         <Spin size="large" />
//         <div style={{ marginTop: 16, color: '#666' }}>Loading reviews...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ textAlign: 'center', padding: '40px 0' }}>
//         <Alert
//           type="warning"
//           message="Could not load reviews"
//           description={error}
//           showIcon
//           style={{ maxWidth: 500, margin: '0 auto' }}
//         />
//         <Button
//           type="primary"
//           style={{ marginTop: 16 }}
//           onClick={() => window.location.reload()}
//         >
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '16px 0' }}>
//       {/* Statistics Section */}
//       {comprehensiveStats && (
//         <Card
//           style={{
//             marginBottom: 32,
//             background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
//             border: 'none',
//             borderRadius: 12,
//           }}
//         >
//           <Row gutter={24} align="middle">
//             <Col xs={24} sm={8} style={{ textAlign: 'center', padding: '24px' }}>
//               <Title level={1} style={{ margin: 0, color: '#1890ff', fontSize: '4rem' }}>
//                 {comprehensiveStats.averageRating > 0 ? comprehensiveStats.averageRating.toFixed(1) : '0.0'}
//               </Title>
//               <Rate
//                 disabled
//                 value={comprehensiveStats.averageRating}
//                 allowHalf
//                 style={{ fontSize: '20px', margin: '12px 0' }}
//               />
//               <div style={{ marginTop: 8, color: '#6c757d', fontWeight: 500 }}>
//                 {comprehensiveStats.reviewCount} total reviews
//               </div>
//               <div style={{ marginTop: 4, fontSize: '12px', color: '#8c8c8c' }}>
//                 ({comprehensiveStats.approvedCount} approved • {comprehensiveStats.pendingCount} pending)
//               </div>
//             </Col>

//             <Col xs={24} sm={16}>
//               <div style={{ padding: '20px' }}>
//                 <Title level={4} style={{ marginBottom: 20 }}>Rating Distribution (All Reviews)</Title>
//                 {[5, 4, 3, 2, 1].map((rating) => {
//                   const ratingData = comprehensiveStats.ratingDistribution.find(r => r.rating === rating);
//                   const count = ratingData?.count || 0;
//                   const percentage = comprehensiveStats.reviewCount > 0 ? (count / comprehensiveStats.reviewCount) * 100 : 0;

//                   return (
//                     <div key={rating} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
//                       <div style={{ width: 80, display: 'flex', alignItems: 'center', gap: 8 }}>
//                         <Text strong>{rating}</Text>
//                         <StarFilled style={{ color: '#faad14' }} />
//                       </div>
//                       <div style={{ flex: 1, margin: '0 20px' }}>
//                         <Progress
//                           percent={Math.round(percentage)}
//                           showInfo={false}
//                           strokeColor="#52c41a"
//                         />
//                       </div>
//                       <div style={{ width: 80, textAlign: 'right' }}>
//                         <Text strong>{count}</Text>
//                         <Text type="secondary" style={{ marginLeft: 4 }}>
//                           ({percentage.toFixed(1)}%)
//                         </Text>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </Col>
//           </Row>
//         </Card>
//       )}

//       {/* Reviews List */}
//       {reviews.length === 0 ? (
//         <Empty
//           description={
//             <div>
//               <Title level={4} style={{ color: '#bfbfbf' }}>
//                 {activeTab === 'approved' ? 'No approved reviews yet' :
//                  activeTab === 'pending' ? 'No pending reviews' : 'No reviews yet'}
//               </Title>
//               <Text type="secondary">
//                 {activeTab === 'approved' ? 'Approved reviews will appear here once they are approved by admin.' :
//                  activeTab === 'pending' ? 'Pending reviews are waiting for admin approval.' :
//                  'Be the first to review this product!'}
//               </Text>
//             </div>
//           }
//           style={{
//             padding: '60px 0',
//             background: '#fafafa',
//             borderRadius: 12,
//             margin: '20px 0'
//           }}
//         />
//       ) : (
//         <List
//           itemLayout="vertical"
//           dataSource={reviews}
//           renderItem={(review) => (
//             <ReviewItem review={review} baseUrl={baseUrl} />
//           )}
//           pagination={{
//             pageSize: 5,
//             showSizeChanger: true,
//             showQuickJumper: true,
//             showTotal: (total, range) =>
//               `${range[0]}-${range[1]} of ${total} reviews`,
//             style: { marginTop: 24 }
//           }}
//         />
//       )}
//     </div>
//   );
// };

// // Review Item Component
// interface ReviewItemProps {
//   review: ReviewResponse;
//   baseUrl: string;
// }

// const ReviewItem: React.FC<ReviewItemProps> = ({ review, baseUrl }) => {
//   const reviewDate = new Date(review.reviewDate);
//   const formattedDate = reviewDate.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });

//   // SỬA LẠI: Hàm getImageUrl chính xác
//   const getImageUrl = (imagePath: string) => {
//     if (!imagePath) return '';

//     console.log('🖼️ Original image path:', imagePath);

//     // Nếu đường dẫn đã bắt đầu bằng /, kết hợp với baseUrl
//     if (imagePath.startsWith('/')) {
//       const fullUrl = `${baseUrl}${imagePath}`;
//       console.log('🔗 Full image URL:', fullUrl);
//       return fullUrl;
//     }

//     // Fallback: giữ nguyên path (relative)
//     return imagePath;
//   };

//   return (
//     <Card
//       style={{
//         marginBottom: 20,
//         border: '1px solid #f0f0f0',
//         borderRadius: 12,
//         boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
//         background: review.isApproved ? '#fff' : '#fafafa'
//       }}
//       bodyStyle={{ padding: 24 }}
//     >
//       <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
//         {/* Avatar */}
//         <Avatar
//           icon={<UserOutlined />}
//           size={56}
//           style={{
//             background: '#1890ff',
//             border: '2px solid #f0f0f0',
//             flexShrink: 0
//           }}
//         />

//         {/* Content */}
//         <div style={{ flex: 1, minWidth: 0 }}>
//           {/* Header */}
//           <div style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'flex-start',
//             marginBottom: 12,
//             flexWrap: 'wrap',
//             gap: 12
//           }}>
//             <div>
//               <Text strong style={{ fontSize: '16px', display: 'block' }}>
//                 {review.customer?.fullName || 'Anonymous Customer'}
//               </Text>
//               {review.customer?.email && (
//                 <Text type="secondary" style={{ fontSize: '12px' }}>
//                   {review.customer.email}
//                 </Text>
//               )}
//             </div>

//             <div style={{ textAlign: 'right' }}>
//               <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
//                 <CalendarOutlined style={{ marginRight: 4 }} />
//                 {formattedDate}
//               </Text>
//               <Space size={8} style={{ marginTop: 4 }}>
//                 {review.isApproved ? (
//                   <Tag color="success" style={{ fontSize: '10px', padding: '2px 6px' }}>
//                     Approved
//                   </Tag>
//                 ) : (
//                   <Tag color="orange" style={{ fontSize: '10px', padding: '2px 6px' }}>
//                     Pending Approval
//                   </Tag>
//                 )}
//                 <Tag color="blue" style={{ fontSize: '10px', padding: '2px 6px' }}>
//                   Order #{review.orderId}
//                 </Tag>
//               </Space>
//             </div>
//           </div>

//           {/* Rating */}
//           <div style={{ marginBottom: 16 }}>
//             <Rate
//               disabled
//               defaultValue={review.rating}
//               style={{ fontSize: '16px' }}
//             />
//             <Text strong style={{ marginLeft: 8, color: '#faad14', fontSize: '16px' }}>
//               {review.rating}.0
//             </Text>
//           </div>

//           {/* Comment */}
//           <Paragraph style={{
//             marginBottom: 16,
//             lineHeight: 1.6,
//             fontSize: '14px',
//             color: '#262626'
//           }}>
//             {review.comment || 'No comment provided.'}
//           </Paragraph>

//           {/* Review Images */}
//           {review.reviewImages && review.reviewImages.length > 0 && (
//             <div style={{ marginBottom: 20 }}>
//               <Text strong style={{ display: 'block', marginBottom: 12, fontSize: '14px' }}>
//                 <PictureOutlined style={{ marginRight: 8 }} />
//                 Customer Photos ({review.reviewImages.length})
//               </Text>

//               <Image.PreviewGroup>
//                 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//                   {review.reviewImages.map((image) => {
//                     const fullImageUrl = getImageUrl(image.imageUrl);

//                     return (
//                       <div key={image.id} style={{ position: 'relative' }}>
//                         <Image
//                           src={fullImageUrl}
//                           width={120}
//                           height={120}
//                           style={{
//                             objectFit: 'cover',
//                             borderRadius: 8,
//                             cursor: 'pointer',
//                             border: '1px solid #f0f0f0'
//                           }}
//                           placeholder={
//                             <div style={{
//                               width: 120,
//                               height: 120,
//                               display: 'flex',
//                               alignItems: 'center',
//                               justifyContent: 'center',
//                               background: '#f5f5f5',
//                               borderRadius: 8
//                             }}>
//                               <PictureOutlined style={{ fontSize: 24, color: '#d9d9d9' }} />
//                             </div>
//                           }
//                           preview={{
//                             mask: (
//                               <div style={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 height: '100%',
//                                 background: 'rgba(0,0,0,0.4)',
//                                 color: 'white',
//                                 borderRadius: 8,
//                                 fontSize: '12px'
//                               }}>
//                                 <EyeOutlined /> View
//                               </div>
//                             )
//                           }}
//                           onError={(e) => {
//                             console.error('❌ Image failed to load:', fullImageUrl);
//                             const target = e.target as HTMLImageElement;
//                             target.style.display = 'none';
//                           }}
//                           onLoad={() => {
//                             console.log('✅ Image loaded successfully:', fullImageUrl);
//                           }}
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               </Image.PreviewGroup>

//               {/* Debug info */}
//               <div style={{
//                 marginTop: 8,
//                 padding: 8,
//                 background: '#fff3cd',
//                 borderRadius: 4,
//                 fontSize: '12px',
//                 color: '#856404'
//               }}>
//                 <Text type="warning">
//                   Debug: Base URL: {baseUrl} |
//                   Image Path: {review.reviewImages[0]?.imageUrl} |
//                   <a
//                     href={getImageUrl(review.reviewImages[0]?.imageUrl)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{ marginLeft: 8 }}
//                   >
//                     Test Image URL
//                   </a>
//                 </Text>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default ProductReviews;



// // // src/pages/ProductDetail/ProductReviews.tsx
// // import React, { useState, useEffect } from 'react';
// // import {
// //   Row, Col, Card, Rate, Avatar, List, Spin, Alert,
// //   Button, Space, Progress, Empty, Tag, Image, Typography
// // } from 'antd';
// // import {
// //   StarFilled, UserOutlined, EyeOutlined, PictureOutlined, CalendarOutlined
// // } from '@ant-design/icons';
// // import { ReviewResponse, ReviewReply } from "../../@type/Orders";
// // import { getProductReviews, getProductReviewStats } from "../../api/reviews.api";

// // const { Text, Title, Paragraph } = Typography;

// // interface ProductReviewsProps {
// //   productId: number;
// // }

// // const getBaseUrl = () => {
// //   return 'https://localhost:7275'; // adapt if backend runs on different host/port
// // };

// // const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
// //   const [reviews, setReviews] = useState<ReviewResponse[]>([]);
// //   const [allReviews, setAllReviews] = useState<ReviewResponse[]>([]);
// //   const [stats, setStats] = useState<any | null>(null);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending'>('all');
// //   const [sortBy, setSortBy] = useState<'latest' | 'highest' | 'lowest'>('latest');
// //   const baseUrl = getBaseUrl();

// //   useEffect(() => {
// //     let mounted = true;

// //     const fetchReviews = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);

// //         // stats
// //         try {
// //           const statsResponse = await getProductReviewStats(productId);
// //           if (statsResponse.success && statsResponse.result?.data) {
// //             if (mounted) setStats(statsResponse.result.data);
// //           }
// //         } catch (err) {
// //           // ignore stats error, continue
// //           console.warn('Stats fetch failed', err);
// //         }

// //         // reviews
// //         const reviewsResponse = await getProductReviews(productId);
// //         if (!reviewsResponse.success) {
// //           throw new Error(reviewsResponse.error?.message || 'Failed to load reviews');
// //         }

// //         const remoteReviews = reviewsResponse.result?.data || [];
// //         if (!mounted) return;

// //         setAllReviews(remoteReviews);

// //         // filter by activeTab
// //         let filtered = remoteReviews;
// //         if (activeTab === 'approved') filtered = filtered.filter(r => r.isApproved);
// //         if (activeTab === 'pending') filtered = filtered.filter(r => !r.isApproved);

// //         // sort
// //         switch (sortBy) {
// //           case 'latest':
// //             filtered.sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
// //             break;
// //           case 'highest':
// //             filtered.sort((a, b) => b.rating - a.rating);
// //             break;
// //           case 'lowest':
// //             filtered.sort((a, b) => a.rating - b.rating);
// //             break;
// //         }

// //         setReviews(filtered);
// //       } catch (err: any) {
// //         console.error('Error fetching reviews', err);
// //         if (mounted) setError(err.message || 'Failed to load reviews');
// //       } finally {
// //         if (mounted) setLoading(false);
// //       }
// //     };

// //     fetchReviews();

// //     return () => { mounted = false; };
// //   }, [productId, activeTab, sortBy]);

// //   // derived stats from allReviews (fallback if stats API missing)
// //   const computeComprehensiveStats = () => {
// //     if (!allReviews || allReviews.length === 0) return null;
// //     const total = allReviews.length;
// //     const totalRating = allReviews.reduce((s, r) => s + (r.rating || 0), 0);
// //     const averageRating = total > 0 ? totalRating / total : 0;
// //     const approvedCount = allReviews.filter(r => r.isApproved).length;
// //     const pendingCount = total - approvedCount;
// //     const ratingDistribution = [5,4,3,2,1].map(rating => ({
// //       rating,
// //       count: allReviews.filter(r => r.rating === rating).length
// //     }));
// //     return { averageRating, reviewCount: total, approvedCount, pendingCount, ratingDistribution };
// //   };

// //   const comprehensiveStats = stats ?? computeComprehensiveStats();

// //   if (loading) {
// //     return (
// //       <div style={{ padding: '40px 0', textAlign: 'center' }}>
// //         <Spin size="large" />
// //         <div style={{ marginTop: 12, color: '#666' }}>Loading reviews...</div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div style={{ textAlign: 'center', padding: '40px 0' }}>
// //         <Alert type="warning" message="Could not load reviews" description={error} showIcon />
// //         <Button type="primary" style={{ marginTop: 12 }} onClick={() => window.location.reload()}>Retry</Button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       {comprehensiveStats && (
// //         <Card style={{ marginBottom: 24, borderRadius: 10 }}>
// //           <Row gutter={16} align="middle">
// //             <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
// //               <Title level={1} style={{ margin: 0, color: '#1890ff', fontSize: '3rem' }}>
// //                 {comprehensiveStats.averageRating ? comprehensiveStats.averageRating.toFixed(1) : '0.0'}
// //               </Title>
// //               <Rate disabled allowHalf value={comprehensiveStats.averageRating} style={{ fontSize: 18 }} />
// //               <div style={{ color: '#6c757d', marginTop: 8 }}>{comprehensiveStats.reviewCount} total reviews</div>
// //               <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 6 }}>
// //                 ({comprehensiveStats.approvedCount} approved • {comprehensiveStats.pendingCount} pending)
// //               </div>
// //             </Col>

// //             <Col xs={24} sm={16}>
// //               <div style={{ padding: 12 }}>
// //                 <Title level={4}>Rating Distribution</Title>
// //                 {[5,4,3,2,1].map(rating => {
// //                   const r = comprehensiveStats.ratingDistribution.find((x: any) => x.rating === rating);
// //                   const count = r?.count || 0;
// //                   const percent = comprehensiveStats.reviewCount > 0 ? Math.round((count / comprehensiveStats.reviewCount) * 100) : 0;
// //                   return (
// //                     <div key={rating} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
// //                       <div style={{ width: 70, display: 'flex', alignItems: 'center', gap: 8 }}>
// //                         <Text strong>{rating}</Text>
// //                         <StarFilled style={{ color: '#faad14' }} />
// //                       </div>
// //                       <div style={{ flex: 1, margin: '0 12px' }}>
// //                         <Progress percent={percent} showInfo={false} strokeColor="#52c41a" />
// //                       </div>
// //                       <div style={{ width: 80, textAlign: 'right' }}>
// //                         <Text strong>{count}</Text>
// //                         <Text type="secondary" style={{ marginLeft: 6 }}>({percent}%)</Text>
// //                       </div>
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             </Col>
// //           </Row>
// //         </Card>
// //       )}

// //       {reviews.length === 0 ? (
// //         <Empty description={
// //           <div>
// //             <Title level={4} style={{ color: '#bfbfbf' }}>
// //               {activeTab === 'approved' ? 'No approved reviews' : activeTab === 'pending' ? 'No pending reviews' : 'No reviews yet'}
// //             </Title>
// //             <Text type="secondary">
// //               {activeTab === 'approved' ? 'Approved reviews will appear here.' : activeTab === 'pending' ? 'Pending reviews awaiting approval.' : 'Be the first to review.'}
// //             </Text>
// //           </div>

// src/pages/ProductDetail/ProductReviews.tsx - UPDATED VERSION WITH ADMIN REPLIES
import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Rate, Avatar, List, Spin, Alert, 
  Button, Space, Progress, Empty, Tag, Image, Typography,
  Badge, Tabs, Input, Form, Modal, message
} from 'antd';
import { 
  StarFilled, UserOutlined, CheckCircleOutlined, 
  EyeOutlined, MessageOutlined, CalendarOutlined,
  ClockCircleOutlined, FilterOutlined, PictureOutlined,
  EditOutlined, DeleteOutlined, 
  CrownOutlined, ShopOutlined
} from '@ant-design/icons';
import { ReviewResponse, CreateReplyRequest } from "../../@type/Orders";
import { getProductReviews, getProductReviewStats, addReply, deleteReply } from "../../api/reviews.api";

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface ProductReviewsProps {
  productId: number;
}

// SỬA LẠI: Sử dụng đúng backend URL
const getBaseUrl = () => {
  return 'https://localhost:7275';
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [allReviews, setAllReviews] = useState<ReviewResponse[]>([]);
  const [stats, setStats] = useState<{
    averageRating: number;
    reviewCount: number;
    ratingDistribution: Array<{ rating: number; count: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'highest' | 'lowest'>('latest');
  const [baseUrl, setBaseUrl] = useState('');
  const [replyingTo, setReplyingTo] = useState<{reviewId: number, parentReplyId?: number} | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState<number | null>(null);

  useEffect(() => {
    setBaseUrl(getBaseUrl());
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [productId, activeTab, sortBy, baseUrl]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching reviews for product ID:', productId);

      // Lấy thống kê đánh giá
      try {
        const statsResponse = await getProductReviewStats(productId);
        if (statsResponse.success && statsResponse.result) {
          setStats(statsResponse.result.data);
        }
      } catch (statsError) {
        console.warn('⚠️ Stats API failed, continuing without stats...');
      }
      
      // Lấy danh sách đánh giá
      const reviewsResponse = await getProductReviews(productId);
      console.log('📝 Reviews response:', reviewsResponse);
      
      if (reviewsResponse.success && reviewsResponse.result) {
        setAllReviews(reviewsResponse.result.data);
        
        // Filter reviews based on active tab
        let filteredReviews = reviewsResponse.result.data;
        if (activeTab === 'approved') {
          filteredReviews = filteredReviews.filter(review => review.isApproved);
        } else if (activeTab === 'pending') {
          filteredReviews = filteredReviews.filter(review => !review.isApproved);
        }
        
        // Sort reviews
        let sortedReviews = [...filteredReviews];
        switch (sortBy) {
          case 'latest':
            sortedReviews.sort((a, b) => 
              new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
            );
            break;
          case 'highest':
            sortedReviews.sort((a, b) => b.rating - a.rating);
            break;
          case 'lowest':
            sortedReviews.sort((a, b) => a.rating - b.rating);
            break;
        }
        
        setReviews(sortedReviews);
      } else {
        setError(reviewsResponse.error?.message || 'Failed to load reviews');
      }
      
    } catch (err) {
      console.error('❌ Error loading reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyingTo || !replyText.trim()) return;

    try {
      setReplyLoading(true);
      const replyData: CreateReplyRequest = {
        comment: replyText.trim(),
        parentReplyId: replyingTo.parentReplyId
      };

      const response = await addReply(replyingTo.reviewId, replyData);
      
      if (response.success) {
        message.success('Reply added successfully!');
        setReplyText('');
        setReplyingTo(null);
        fetchReviews(); // Refresh reviews to show new reply
      } else {
        message.error(response.error?.message || 'Failed to add reply');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      message.error('Failed to add reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    try {
      const response = await deleteReply(replyId);
      
      if (response.success) {
        message.success('Reply deleted successfully!');
        setDeleteModalVisible(false);
        setReplyToDelete(null);
        fetchReviews(); // Refresh reviews
      } else {
        message.error(response.error?.message || 'Failed to delete reply');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      message.error('Failed to delete reply');
    }
  };

  const showDeleteConfirm = (replyId: number) => {
    setReplyToDelete(replyId);
    setDeleteModalVisible(true);
  };

  const calculateComprehensiveStats = () => {
    if (!allReviews.length) return null;
    
    const approvedReviews = allReviews.filter(review => review.isApproved);
    const pendingReviews = allReviews.filter(review => !review.isApproved);
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: allReviews.filter(review => review.rating === rating).length
    }));
    
    return {
      averageRating,
      reviewCount: allReviews.length,
      approvedCount: approvedReviews.length,
      pendingCount: pendingReviews.length,
      ratingDistribution
    };
  };

  const comprehensiveStats = calculateComprehensiveStats();

  if (loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: '#666' }}>Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Alert
          type="warning"
          message="Could not load reviews"
          description={error}
          showIcon
          style={{ maxWidth: 500, margin: '0 auto' }}
        />
        <Button 
          type="primary" 
          style={{ marginTop: 16 }}
          onClick={() => fetchReviews()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 0' }}>
      {/* Statistics Section */}
      {comprehensiveStats && (
        <Card 
          style={{ 
            marginBottom: 32, 
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: 'none',
            borderRadius: 12,
          }}
        >
          <Row gutter={24} align="middle">
            <Col xs={24} sm={8} style={{ textAlign: 'center', padding: '24px' }}>
              {/* <Title level={1} style={{ margin: 0, color: '#1890ff', fontSize: '4rem' }}>
                {comprehensiveStats.averageRating > 0 ? comprehensiveStats.averageRating.toFixed(1) : '0.0'}
              </Title> */}
              <Rate 
                disabled 
                value={comprehensiveStats.averageRating} 
                allowHalf 
                style={{ fontSize: '20px', margin: '12px 0' }}
              />
              <div style={{ marginTop: 8, color: '#6c757d', fontWeight: 500 }}>
                {comprehensiveStats.reviewCount} total reviews
              </div>
              {/* thống kê  approved và pending */}
              {/* <div style={{ marginTop: 4, fontSize: '12px', color: '#8c8c8c' }}>
                ({comprehensiveStats.approvedCount} approved • {comprehensiveStats.pendingCount} pending)
              </div> */}
            </Col>
            
            <Col xs={24} sm={16}>
              <div style={{ padding: '20px' }}>
                <Title level={4} style={{ marginBottom: 20 }}>Rating Distribution (All Reviews)</Title>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const ratingData = comprehensiveStats.ratingDistribution.find(r => r.rating === rating);
                  const count = ratingData?.count || 0;
                  const percentage = comprehensiveStats.reviewCount > 0 ? (count / comprehensiveStats.reviewCount) * 100 : 0;
                  
                  return (
                    <div key={rating} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ width: 80, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text strong>{rating}</Text>
                        <StarFilled style={{ color: '#faad14' }} />
                      </div>
                      <div style={{ flex: 1, margin: '0 20px' }}>
                        <Progress 
                          percent={Math.round(percentage)} 
                          showInfo={false} 
                          strokeColor="#52c41a"
                        />
                      </div>
                      <div style={{ width: 80, textAlign: 'right' }}>
                        <Text strong>{count}</Text>
                        <Text type="secondary" style={{ marginLeft: 4 }}>
                          ({percentage.toFixed(1)}%)
                        </Text>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </Card>
      )}
      
      {/* Reply Modal */}
      <Modal
        title={replyingTo?.parentReplyId ? "Reply to Comment" : "Add Reply to Review"}
        open={!!replyingTo}
        onOk={handleReplySubmit}
        onCancel={() => {
          setReplyingTo(null);
          setReplyText('');
        }}
        confirmLoading={replyLoading}
        okText="Submit Reply"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Your Reply">
            <TextArea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              maxLength={2000}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={() => replyToDelete && handleDeleteReply(replyToDelete)}
        onCancel={() => {
          setDeleteModalVisible(false);
          setReplyToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okType="danger"
      >
        <p>Are you sure you want to delete this reply? This action cannot be undone.</p>
      </Modal>
      
      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Empty
          description={
            <div>
              <Title level={4} style={{ color: '#bfbfbf' }}>
                {activeTab === 'approved' ? 'No approved reviews yet' : 
                 activeTab === 'pending' ? 'No pending reviews' : 'No reviews yet'}
              </Title>
              <Text type="secondary">
                {activeTab === 'approved' ? 'Approved reviews will appear here once they are approved by admin.' :
                 activeTab === 'pending' ? 'Pending reviews are waiting for admin approval.' :
                 'Be the first to review this product!'}
              </Text>
            </div>
          }
          style={{ 
            padding: '60px 0',
            background: '#fafafa',
            borderRadius: 12,
            margin: '20px 0'
          }}
        />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={reviews}
          renderItem={(review) => (
            <ReviewItem 
              review={review} 
              baseUrl={baseUrl}
              onReply={(reviewId, parentReplyId) => setReplyingTo({ reviewId, parentReplyId })}
              onDeleteReply={showDeleteConfirm}
            />
          )}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} reviews`,
            style: { marginTop: 24 }
          }}
        />
      )}
    </div>
  );
};

// Review Item Component với Admin Replies
interface ReviewItemProps {
  review: ReviewResponse;
  baseUrl: string;
  onReply: (reviewId: number, parentReplyId?: number) => void;
  onDeleteReply: (replyId: number) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, baseUrl, onReply, onDeleteReply }) => {
  const reviewDate = new Date(review.reviewDate);
  const formattedDate = reviewDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('/')) {
      return `${baseUrl}${imagePath}`;
    }
    return imagePath;
  };

  // Hàm hiển thị replies (bao gồm cả nested replies)
  const renderReplies = (replies: any[], level = 0) => {
    return replies.map((reply) => (
      <div key={reply.id} style={{ 
        marginLeft: level > 0 ? 40 : 0,
        marginTop: 12,
        padding: 12,
        background: level === 0 ? '#f8f9fa' : '#ffffff',
        border: '1px solid #e8e8e8',
        borderRadius: 8
      }}>
        {/* Reply Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar
              size="small"
              icon={reply.isAdminReply ? <CrownOutlined /> : <UserOutlined />}
              style={{ 
                background: reply.isAdminReply ? '#ff4d4f' : '#1890ff',
                fontSize: '12px'
              }}
            />
            <div>
              <Text strong style={{ fontSize: '14px' }}>
                {reply.user?.fullName || 'Unknown User'}
                {reply.isAdminReply && (
                  <Tag color="red" style={{ marginLeft: 8, fontSize: '10px' }}>
                    <CrownOutlined /> Admin
                  </Tag>
                )}
              </Text>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                <CalendarOutlined /> {new Date(reply.replyDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Reply Actions */}
          <Space>
            <Button 
              type="text" 
              size="small" 
              icon={<MessageOutlined />}
              onClick={() => onReply(review.id, reply.id)}
            >
              Reply
            </Button>
            {/* Chỉ cho phép xóa reply của chính mình hoặc admin */}
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => onDeleteReply(reply.id)}
            >
              Delete
            </Button>
          </Space>
        </div>

        {/* Reply Content */}
        <Paragraph style={{ 
          margin: 0,
          fontSize: '14px',
          lineHeight: 1.5,
          color: '#262626'
        }}>
          {reply.comment}
        </Paragraph>

        {/* Render child replies recursively */}
        {reply.childReplies && reply.childReplies.length > 0 && (
          <div style={{ marginTop: 12 }}>
            {renderReplies(reply.childReplies, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <Card 
      style={{ 
        marginBottom: 20, 
        border: '1px solid #f0f0f0',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        background: review.isApproved ? '#fff' : '#fafafa'
      }}
      bodyStyle={{ padding: 24 }}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <Avatar
          icon={<UserOutlined />}
          size={56}
          style={{ 
            background: '#1890ff',
            border: '2px solid #f0f0f0',
            flexShrink: 0
          }}
        />
        
        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: 12,
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div>
              <Text strong style={{ fontSize: '16px', display: 'block' }}>
                {review.customer?.fullName || 'Anonymous Customer'}
              </Text>
              {review.customer?.email && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {review.customer.email}
                </Text>
              )}
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                <CalendarOutlined style={{ marginRight: 4 }} />
                {formattedDate}
              </Text>
              <Space size={8} style={{ marginTop: 4 }}>
                {review.isApproved ? (
                  <Tag color="success" style={{ fontSize: '10px', padding: '2px 6px' }}>
                    Approved
                  </Tag>
                ) : (
                  <Tag color="orange" style={{ fontSize: '10px', padding: '2px 6px' }}>
                    Pending Approval
                  </Tag>
                )}
                <Tag color="blue" style={{ fontSize: '10px', padding: '2px 6px' }}>
                  Order #{review.orderId}
                </Tag>
              </Space>
            </div>
          </div>
          
          {/* Rating */}
          <div style={{ marginBottom: 16 }}>
            <Rate 
              disabled 
              defaultValue={review.rating} 
              style={{ fontSize: '16px' }}
            />
            <Text strong style={{ marginLeft: 8, color: '#faad14', fontSize: '16px' }}>
              {review.rating}.0
            </Text>
          </div>
          
          {/* Comment */}
          <Paragraph style={{ 
            marginBottom: 16, 
            lineHeight: 1.6,
            fontSize: '14px',
            color: '#262626'
          }}>
            {review.comment || 'No comment provided.'}
          </Paragraph>
          
          {/* Review Images */}
          {review.reviewImages && review.reviewImages.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ display: 'block', marginBottom: 12, fontSize: '14px' }}>
                <PictureOutlined style={{ marginRight: 8 }} />
                Customer Photos ({review.reviewImages.length})
              </Text>
              
              <Image.PreviewGroup>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {review.reviewImages.map((image) => {
                    const fullImageUrl = getImageUrl(image.imageUrl);
                    
                    return (
                      <div key={image.id} style={{ position: 'relative' }}>
                        <Image
                          src={fullImageUrl}
                          width={120}
                          height={120}
                          style={{ 
                            objectFit: 'cover',
                            borderRadius: 8,
                            cursor: 'pointer',
                            border: '1px solid #f0f0f0'
                          }}
                          placeholder={
                            <div style={{ 
                              width: 120, 
                              height: 120, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              background: '#f5f5f5',
                              borderRadius: 8
                            }}>
                              <PictureOutlined style={{ fontSize: 24, color: '#d9d9d9' }} />
                            </div>
                          }
                          preview={{
                            mask: (
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                height: '100%',
                                background: 'rgba(0,0,0,0.4)',
                                color: 'white',
                                borderRadius: 8,
                                fontSize: '12px'
                              }}>
                                <EyeOutlined /> View
                              </div>
                            )
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </Image.PreviewGroup>
            </div>
          )}

          {/* Reply Section */}
          <div style={{ marginTop: 20 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 12
            }}>
              <Text strong style={{ fontSize: '14px' }}>
                <MessageOutlined style={{ marginRight: 8 }} />
                Replies ({review.reviewReplies.length})
              </Text>
              <Button 
                type="primary" 
                size="small" 
                icon={<MessageOutlined />}
                onClick={() => onReply(review.id)}
              >
                Add Reply
              </Button>
            </div>

            {/* Replies List */}
            {review.reviewReplies.length > 0 ? (
              <div>
                {renderReplies(review.reviewReplies)}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px',
                background: '#fafafa',
                borderRadius: 8,
                border: '1px dashed #d9d9d9'
              }}>
                <Text type="secondary">No replies yet. Be the first to reply!</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductReviews;