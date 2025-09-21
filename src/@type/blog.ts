// Blog Types matching backend DTOs
export interface BlogResponseDto {
  id: number;
  title: string;
  content: string;
  summary?: string;
  featuredImageUrl?: string;
  slug?: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedDate?: string;
  createdDate: string;
  updatedDate: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  categoryId: number;
  categoryName: string;
  isLikedByCurrentUser: boolean;
}

export interface BlogListResponseDto {
  id: number;
  title: string;
  summary?: string;
  featuredImageUrl?: string;
  slug?: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedDate?: string;
  createdDate: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  categoryId: number;
  categoryName: string;
  isLikedByCurrentUser: boolean;
}

export interface CreateBlogDto {
  title: string;
  content: string;
  summary?: string;
  featuredImageUrl?: string;
  slug?: string;
  isPublished: boolean;
  isFeatured: boolean;
  categoryId: number;
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
  summary?: string;
  featuredImageUrl?: string;
  slug?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  categoryId?: number;
  publishedDate?: string | Date;
}

export interface BlogQueryDto {
  page: number;
  pageSize: number;
  search?: string;
  categoryId?: number;
  authorId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  includeDrafts?: boolean; // Include draft blogs
  sortBy?: string; // CreatedDate, PublishedDate, ViewCount, LikeCount
  sortOrder?: string; // asc, desc
}

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Comment Types
export interface CommentResponseDto {
  id: number;
  content: string;
  isApproved: boolean;
  likeCount: number;
  createdDate: string;
  updatedDate: string;
  blogId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  parentCommentId?: number;
  isLikedByCurrentUser: boolean;
  replies: CommentResponseDto[];
}

export interface CreateCommentDto {
  content: string;
  parentCommentId?: number;
}

export interface UpdateCommentDto {
  content: string;
}

// Author Follow Types
export interface AuthorFollowDto {
  id: number;
  followerId: string;
  followerName: string;
  followerAvatar?: string;
  followingId: string;
  followingName: string;
  followingAvatar?: string;
  createdDate: string;
  isFollowingCurrentUser: boolean;
}

// Frontend specific types
export interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary?: string;
  featuredImageUrl?: string;
  slug?: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedDate?: string;
  createdDate: string;
  updatedDate: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  categoryId: number;
  categoryName: string;
  isLikedByCurrentUser: boolean;
  // Frontend calculated fields
  readTime?: string;
  tags?: string[];
}

export interface Comment {
  id: number;
  content: string;
  isApproved: boolean;
  likeCount: number;
  createdDate: string;
  updatedDate: string;
  blogId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  parentCommentId?: number;
  isLikedByCurrentUser: boolean;
  replies: Comment[];
  // Frontend specific
  rating?: number;
}

export interface BlogFormData {
  title: string;
  content: string;
  summary?: string;
  featuredImageUrl?: string;
  slug?: string;
  isPublished: boolean;
  isFeatured: boolean;
  categoryId: number;
  tags?: string[];
}
