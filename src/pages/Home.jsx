import React, { useState, useEffect } from 'react';
import PostCard from '../components/Post/PostCard';
import CreatePost from '../components/Post/CreatePost';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };

  const handlePostLiked = (postId, newLikeCount, isLiked) => {
    setPosts(prev => prev.map(post => 
      post._id === postId 
        ? { ...post, likes: Array(newLikeCount).fill(null) }
        : post
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto pt-8 pb-12 px-4">
        <div className="space-y-6">
          <CreatePost onPostCreated={handlePostCreated} />
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white text-xl mb-4">No posts yet</div>
              <div className="text-gray-500">Be the first to share something!</div>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handlePostDeleted}
                onLike={handlePostLiked}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;