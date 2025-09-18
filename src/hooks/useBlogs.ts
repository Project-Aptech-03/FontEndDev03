import { useState, useEffect, useCallback } from 'react';
import { blogApi } from '../api/blog.api';
import {
  BlogResponseDto,
  BlogListResponseDto,
  CreateBlogDto,
  UpdateBlogDto,
  BlogQueryDto,
  CommentResponseDto,
  CreateCommentDto,
  UpdateCommentDto,
} from '../@type/blog';

export const useBlogs = (initialQuery: BlogQueryDto = { page: 1, pageSize: 10 }) => {
  const [blogs, setBlogs] = useState<BlogListResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  });

  const fetchBlogs = useCallback(async (query: BlogQueryDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await blogApi.getBlogs(query);
      setBlogs(result.items);
      setPagination({
        totalCount: result.totalCount,
        pageNumber: result.pageNumber,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        hasPreviousPage: result.hasPreviousPage,
        hasNextPage: result.hasNextPage
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(initialQuery);
  }, [fetchBlogs, initialQuery]);

  return {
    blogs,
    loading,
    error,
    pagination,
    refetch: () => fetchBlogs(initialQuery),
    updateQuery: fetchBlogs
  };
};

// Hook for managing featured blogs
export const useFeaturedBlogs = (count: number = 5) => {
  const [blogs, setBlogs] = useState<BlogListResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await blogApi.getFeaturedBlogs(count);
      setBlogs(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured blogs');
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => {
    fetchFeaturedBlogs();
  }, [fetchFeaturedBlogs]);

  return {
    blogs,
    loading,
    error,
    refetch: fetchFeaturedBlogs
  };
};

// Hook for managing recent blogs
export const useRecentBlogs = (count: number = 5) => {
  const [blogs, setBlogs] = useState<BlogListResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await blogApi.getRecentBlogs(count);
      setBlogs(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent blogs');
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => {
    fetchRecentBlogs();
  }, [fetchRecentBlogs]);

  return {
    blogs,
    loading,
    error,
    refetch: fetchRecentBlogs
  };
};

// Hook for managing single blog
export const useBlog = (id: number | string) => {
  const [blog, setBlog] = useState<BlogResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const result = typeof id === 'number'
        ? await blogApi.getBlogById(id)
        : await blogApi.getBlogBySlug(id);
      setBlog(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  return {
    blog,
    loading,
    error,
    refetch: fetchBlog
  };
};
export const useBlogCrud = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBlog = useCallback(async (blogData: CreateBlogDto): Promise<BlogResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await blogApi.createBlog(blogData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create blog');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBlog = useCallback(async (id: number, blogData: UpdateBlogDto): Promise<BlogResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await blogApi.updateBlog(id, blogData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blog');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBlog = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await blogApi.deleteBlog(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createBlog,
    updateBlog,
    deleteBlog,
    loading,
    error
  };
};

export const useBlogLikes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const likeBlog = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await blogApi.likeBlog(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like blog');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlikeBlog = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await blogApi.unlikeBlog(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlike blog');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    likeBlog,
    unlikeBlog,
    loading,
    error
  };
};

// Hook for blog comments
export const useBlogComments = (blogId: number) => {
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!blogId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await blogApi.getBlogComments(blogId);
      setComments(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const createComment = useCallback(async (commentData: CreateCommentDto): Promise<CommentResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await blogApi.createComment(blogId, commentData);
      await fetchComments(); // Refresh comments
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
      return null;
    } finally {
      setLoading(false);
    }
  }, [blogId, fetchComments]);

  const updateComment = useCallback(async (commentId: number, commentData: UpdateCommentDto): Promise<CommentResponseDto | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await blogApi.updateComment(commentId, commentData);
      await fetchComments(); // Refresh comments
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comment');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchComments]);

  const deleteComment = useCallback(async (commentId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await blogApi.deleteComment(commentId);
      await fetchComments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchComments]);

  const likeComment = useCallback(async (commentId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await blogApi.likeComment(commentId);
      await fetchComments(); // Refresh comments
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like comment');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchComments]);

  const unlikeComment = useCallback(async (commentId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await blogApi.unlikeComment(commentId);
      await fetchComments(); // Refresh comments
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlike comment');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    refetch: fetchComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment
  };
};

// Hook for author follows
export const useAuthorFollows = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const followAuthor = useCallback(async (authorId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await blogApi.followAuthor(authorId);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to follow author';
      setError(errorMessage);
      console.error('Follow author error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unfollowAuthor = useCallback(async (authorId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await blogApi.unfollowAuthor(authorId);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to unfollow author';
      setError(errorMessage);
      console.error('Unfollow author error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    followAuthor,
    unfollowAuthor,
    loading,
    error
  };
};
