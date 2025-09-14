import { api } from '../config/axios';
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

export const blogApi = {
  // Blog CRUD operations
  getBlogs: async (query: BlogQueryDto): Promise<PagedResultDto<BlogListResponseDto>> => {
    const response = await api.get('/Blog', { params: query });
    return response.data;
  },

  getFeaturedBlogs: async (count: number = 5): Promise<BlogListResponseDto[]> => {
    const response = await api.get(`/Blog/featured?count=${count}`);
    return response.data;
  },

  getRecentBlogs: async (count: number = 5): Promise<BlogListResponseDto[]> => {
    const response = await api.get(`/Blog/recent?count=${count}`);
    return response.data;
  },

  searchBlogs: async (searchTerm: string, page: number = 1, pageSize: number = 10): Promise<BlogListResponseDto[]> => {
    const response = await api.get('/Blog/search', {
      params: { searchTerm, page, pageSize }
    });
    return response.data;
  },

  getBlogById: async (id: number): Promise<BlogResponseDto> => {
    const response = await api.get(`/Blog/${id}`);
    return response.data;
  },

  getBlogBySlug: async (slug: string): Promise<BlogResponseDto> => {
    const response = await api.get(`/Blog/slug/${slug}`);
    return response.data;
  },

  getBlogsByAuthor: async (authorId: string, page: number = 1, pageSize: number = 10): Promise<BlogListResponseDto[]> => {
    const response = await api.get(`/Blog/author/${authorId}`, {
      params: { page, pageSize }
    });
    return response.data;
  },

  getBlogsByCategory: async (categoryId: number, page: number = 1, pageSize: number = 10): Promise<BlogListResponseDto[]> => {
    const response = await api.get(`/Blog/category/${categoryId}`, {
      params: { page, pageSize }
    });
    return response.data;
  },

  createBlog: async (blogData: CreateBlogDto): Promise<BlogResponseDto> => {
    const response = await api.post('/Blog', blogData);
    return response.data;
  },

  updateBlog: async (id: number, blogData: UpdateBlogDto): Promise<BlogResponseDto> => {
    const response = await api.put(`/Blog/${id}`, blogData);
    return response.data;
  },

  deleteBlog: async (id: number): Promise<void> => {
    await api.delete(`/Blog/${id}`);
  },

  // Blog likes
  likeBlog: async (id: number): Promise<void> => {
    await api.post(`/Blog/${id}/like`);
  },

  unlikeBlog: async (id: number): Promise<void> => {
    await api.delete(`/Blog/${id}/like`);
  },

  // Comments
  getBlogComments: async (blogId: number): Promise<CommentResponseDto[]> => {
    const response = await api.get(`/Blog/${blogId}/comments`);
    return response.data;
  },

  createComment: async (blogId: number, commentData: CreateCommentDto): Promise<CommentResponseDto> => {
    const response = await api.post(`/Blog/${blogId}/comments`, commentData);
    return response.data;
  },

  updateComment: async (commentId: number, commentData: UpdateCommentDto): Promise<CommentResponseDto> => {
    const response = await api.put(`/Blog/comments/${commentId}`, commentData);
    return response.data;
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await api.delete(`/Blog/comments/${commentId}`);
  },

  likeComment: async (commentId: number): Promise<void> => {
    await api.post(`/Blog/comments/${commentId}/like`);
  },

  unlikeComment: async (commentId: number): Promise<void> => {
    await api.delete(`/Blog/comments/${commentId}/like`);
  },

  // Author follows
  getAuthorFollowers: async (authorId: string, page: number = 1, pageSize: number = 10): Promise<AuthorFollowDto[]> => {
    const response = await api.get(`/Blog/authors/${authorId}/followers`, {
      params: { page, pageSize }
    });
    return response.data;
  },

  getAuthorFollowing: async (authorId: string, page: number = 1, pageSize: number = 10): Promise<AuthorFollowDto[]> => {
    const response = await api.get(`/Blog/authors/${authorId}/following`, {
      params: { page, pageSize }
    });
    return response.data;
  },

  followAuthor: async (authorId: string): Promise<void> => {
    console.log('Following author:', authorId);
    console.log('Request URL:', `/Blog/authors/${authorId}/follow`);
    console.log('Request headers:', api.defaults.headers);
    
    try {
      // Try with empty body first
      const response = await api.post(`/Blog/authors/${authorId}/follow`, {});
      console.log('Follow response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Follow API Error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Try alternative approaches
      try {
        console.log('Trying alternative approach...');
        const altResponse = await api.post(`/Blog/authors/${authorId}/follow`, {
          authorId: authorId
        });
        console.log('Alternative follow response:', altResponse);
        return altResponse.data;
      } catch (altError: any) {
        console.error('Alternative approach also failed:', altError);
        throw error; // Throw original error
      }
    }
  },

  unfollowAuthor: async (authorId: string): Promise<void> => {
    console.log('Unfollowing author:', authorId);
    console.log('Request URL:', `/Blog/authors/${authorId}/follow`);
    console.log('Request headers:', api.defaults.headers);
    
    try {
      const response = await api.delete(`/Blog/authors/${authorId}/follow`);
      console.log('Unfollow response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Unfollow API Error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  getSuggestedAuthors: async (count: number = 5): Promise<AuthorFollowDto[]> => {
    const response = await api.get(`/Blog/authors/suggested?count=${count}`);
    return response.data;
  },

  // Image upload for blogs
  uploadBlogImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", "blogs");

    const response = await api.post("/upload/single?folderName=blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Test API endpoint - for debugging
  testFollowEndpoint: async (authorId: string): Promise<any> => {
    console.log('Testing follow endpoint for author:', authorId);
    
    // Try different possible endpoints
    const possibleEndpoints = [
      // Original attempts
      `/Blog/authors/${authorId}/follow`,
      `/Blog/author/${authorId}/follow`,
      `/Blog/follow/${authorId}`,
      `/Blog/follows/${authorId}`,
      `/authors/${authorId}/follow`,
      `/author/${authorId}/follow`,
      
      // New attempts based on existing patterns
      `/Blog/follow`,
      `/Blog/follows`,
      `/follow`,
      `/follows`,
      `/Blog/authors/follow`,
      `/Blog/authors/follows`,
      
      // Try with different HTTP methods
      `/Blog/authors/${authorId}/followers`, // This one exists for GET
      `/Blog/authors/${authorId}/following`, // This one exists for GET
      
      // Try user-based endpoints
      `/users/${authorId}/follow`,
      `/users/follow`,
      `/user/${authorId}/follow`,
      `/user/follow`,
      `/User/${authorId}/follow`,
      `/User/follow`,
      `/User/follows`,
      `/User/follows/${authorId}`
    ];
    
    const results = [];
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log('Trying GET endpoint:', endpoint);
        const response = await api.get(endpoint);
        console.log('GET endpoint exists:', endpoint, response.status);
        results.push({ endpoint, method: 'GET', status: response.status, exists: true });
      } catch (error: any) {
        console.log('GET endpoint failed:', endpoint, error.response?.status);
        results.push({ endpoint, method: 'GET', status: error.response?.status, exists: false });
      }
      
      // Try POST for follow endpoints
      if (endpoint.includes('follow') && !endpoint.includes('followers') && !endpoint.includes('following')) {
        try {
          console.log('Trying POST endpoint:', endpoint);
          const response = await api.post(endpoint, { authorId });
          console.log('POST endpoint exists:', endpoint, response.status);
          results.push({ endpoint, method: 'POST', status: response.status, exists: true });
        } catch (error: any) {
          console.log('POST endpoint failed:', endpoint, error.response?.status);
          results.push({ endpoint, method: 'POST', status: error.response?.status, exists: false });
        }
      }
    }
    
    const existingEndpoints = results.filter(r => r.exists);
    
    return { 
      exists: existingEndpoints.length > 0, 
      results: results,
      existingEndpoints: existingEndpoints,
      message: existingEndpoints.length > 0 ? 'Found valid endpoints' : 'No valid endpoint found' 
    };
  },

  // Alternative approach - try to follow through a generic endpoint
  tryGenericFollow: async (authorId: string): Promise<any> => {
    console.log('Trying generic follow approach for author:', authorId);
    
    const genericEndpoints = [
      { url: '/follow', method: 'POST', data: { authorId } },
      { url: '/follows', method: 'POST', data: { authorId } },
      { url: '/Blog/follow', method: 'POST', data: { authorId } },
      { url: '/Blog/follows', method: 'POST', data: { authorId } },
      { url: '/User/follow', method: 'POST', data: { authorId } },
      { url: '/User/follows', method: 'POST', data: { authorId } },
      { url: '/follow', method: 'POST', data: { followingId: authorId } },
      { url: '/follows', method: 'POST', data: { followingId: authorId } },
      { url: '/Blog/follow', method: 'POST', data: { followingId: authorId } },
      { url: '/User/follow', method: 'POST', data: { followingId: authorId } }
    ];
    
    const results = [];
    
    for (const endpoint of genericEndpoints) {
      try {
        console.log(`Trying ${endpoint.method} ${endpoint.url} with data:`, endpoint.data);
        let response;
        if (endpoint.method.toLowerCase() === 'post') {
          response = await api.post(endpoint.url, endpoint.data);
        } else if (endpoint.method.toLowerCase() === 'put') {
          response = await api.put(endpoint.url, endpoint.data);
        } else if (endpoint.method.toLowerCase() === 'delete') {
          response = await api.delete(endpoint.url);
        } else {
          response = await api.get(endpoint.url);
        }
        console.log('Success:', endpoint.url, response.status);
        results.push({ 
          endpoint: endpoint.url, 
          method: endpoint.method, 
          data: endpoint.data,
          status: response.status, 
          success: true 
        });
      } catch (error: any) {
        console.log('Failed:', endpoint.url, error.response?.status);
        results.push({ 
          endpoint: endpoint.url, 
          method: endpoint.method, 
          data: endpoint.data,
          status: error.response?.status, 
          success: false,
          error: error.response?.data 
        });
      }
    }
    
    const successfulEndpoints = results.filter(r => r.success);
    
    return {
      success: successfulEndpoints.length > 0,
      results: results,
      successfulEndpoints: successfulEndpoints,
      message: successfulEndpoints.length > 0 ? 'Found working endpoints' : 'No working endpoints found'
    };
  }
};
