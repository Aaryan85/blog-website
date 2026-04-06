import { useState, useEffect, useCallback } from "react";
import { postsAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export function usePosts() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all posts on mount
  const fetchPosts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsAPI.getAll(params);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const getPost = useCallback(async (id) => {
    try {
      return await postsAPI.getById(id);
    } catch (err) {
      throw err;
    }
  }, []);

  const createPost = useCallback(
    async (postData) => {
      const newPost = await postsAPI.create(postData, token);
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    },
    [token]
  );

  const updatePost = useCallback(
    async (id, postData) => {
      const updated = await postsAPI.update(id, postData, token);
      setPosts((prev) => prev.map((p) => (p._id === id ? updated : p)));
      return updated;
    },
    [token]
  );

  const deletePost = useCallback(
    async (id) => {
      await postsAPI.delete(id, token);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    },
    [token]
  );

  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))].sort();

  return {
    posts,
    loading,
    error,
    fetchPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    allTags,
  };
}
