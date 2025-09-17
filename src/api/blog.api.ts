
import {
  BlogResponseDto,
  BlogListResponseDto,
  CreateBlogDto,
  UpdateBlogDto,
  BlogQueryDto,
  PagedResultDto,
  CommentResponseDto,
  CreateCommentDto,
  UpdateCommentDto,
  AuthorFollowDto
} from '../@type/blog';
import apiClient from "../services/api";

export const blogApi = {
  // Blog CRUD operations
  getBlogs: async (query: BlogQueryDto): Promise<PagedResultDto<BlogListResponseDto>> => {
    const response = await apiClient.get('/Blog', { params: query });
    return response.data;
  },

  getFeaturedBlogs: async (count: number = 5): Promise<BlogListResponseDto[]> => {
    const response = await apiClient.get(`/Blog/featured?count=${count}`);
    return response.data;
  },

  getRecentBlogs: async (count: number = 5): Promise<BlogListResponseDto[]> => {
    const response = await apiClient.get(`/Blog/recent?count=${count}`);
    return response.data;
  },

  searchBlogs: async (searchTerm: string, page: number = 1, pageSize: number = 10): Promise<BlogListResponseDto[]> => {
    const response = await apiClient.get('/Blog/search', {
      params: { searchTerm, page, pageSize }
    });
    return response.data;
  },

  getBlogById: async (id: number): Promise<BlogResponseDto> => {
    const response = await apiClient.get(`/Blog/${id}`);
    return response.data;
  },

  getBlogBySlug: async (slug: string): Promise<BlogResponseDto> => {
    const response = await apiClient.get(`/Blog/slug/${slug}`);
    return response.data;
  },

  getBlogsByAuthor: async (authorId: string, page: number = 1, pageSize: number = 10): Promise<BlogListResponseDto[]> => {
    const response = await apiClient.get(`/Blog/author/${authorId}`, {
      params: { page, pageSize }
    });
    return response.data;
  },

  getBlogsByCategory: async (categoryId: number, page: number = 1, pageSize: number = 10): Promise<BlogListResponseDto[]> => {
    const response = await apiClient.get(`/Blog/category/${categoryId}`, {
      params: { page, pageSize }
    });
    return response.data;
  },

  createBlog: async (blogData: CreateBlogDto): Promise<BlogResponseDto> => {
    const response = await apiClient.post('/Blog', blogData);
    return response.data;
  },

  updateBlog: async (id: number, blogData: UpdateBlogDto): Promise<BlogResponseDto> => {
    const response = await apiClient.put(`/Blog/${id}`, blogData);
    return response.data;
  },

  deleteBlog: async (id: number): Promise<void> => {
    await apiClient.delete(`/Blog/${id}`);
  },

  // Blog likes
  likeBlog: async (id: number): Promise<void> => {
    await apiClient.post(`/Blog/${id}/like`);
  },

  unlikeBlog: async (id: number): Promise<void> => {
    await apiClient.delete(`/Blog/${id}/like`);
  },

  // Comments
  getBlogComments: async (blogId: number): Promise<CommentResponseDto[]> => {
    const response = await apiClient.get(`/Blog/${blogId}/comments`);
    return response.data;
  },

  createComment: async (blogId: number, commentData: CreateCommentDto): Promise<CommentResponseDto> => {
    const response = await apiClient.post(`/Blog/${blogId}/comments`, commentData);
    return response.data;
  },

  updateComment: async (commentId: number, commentData: UpdateCommentDto): Promise<CommentResponseDto> => {
    const response = await apiClient.put(`/Blog/comments/${commentId}`, commentData);
    return response.data;
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`/Blog/comments/${commentId}`);
  },

  likeComment: async (commentId: number): Promise<void> => {
    await apiClient.post(`/Blog/comments/${commentId}/like`);
  },

  unlikeComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`/Blog/comments/${commentId}/like`);
  },

  // Author follows
  getAuthorFollowers: async (authorId: string, page: number = 1, pageSize: number = 10): Promise<AuthorFollowDto[]> => {
    const response = await apiClient.get(`/Blog/authors/${authorId}/followers`, {
      params: { page, pageSize }
    });
    return response.data;
  },

  getAuthorFollowing: async (authorId: string, page: number = 1, pageSize: number = 10): Promise<AuthorFollowDto[]> => {
    const response = await apiClient.get(`/Blog/authors/${authorId}/following`, {
      params: { page, pageSize }
    });
    return response.data;
  },

  followAuthor: async (authorId: string): Promise<void> => {
    try {
      const response = await apiClient.post(`/Blog/authors/${authorId}/follow`, {});
      return response.data;
    } catch (error: any) {
      console.error('Follow API Error:', error);
      throw error;
    }
  },

  unfollowAuthor: async (authorId: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`/Blog/authors/${authorId}/follow`);
      return response.data;
    } catch (error: any) {
      console.error('Unfollow API Error:', error);
      throw error;
    }
  },

  getSuggestedAuthors: async (count: number = 5): Promise<AuthorFollowDto[]> => {
    const response = await apiClient.get(`/Blog/authors/suggested?count=${count}`);
    return response.data;
  },

  // Image upload for blogs
  uploadBlogImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", "blogs");

    const response = await apiClient.post("/upload/single?folderName=blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

};
