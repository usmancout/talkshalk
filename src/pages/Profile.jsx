import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit2, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/Post/PostCard';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setBio(data.bio || '');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBioUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ bio })
      });

      if (response.ok) {
        setUser(prev => ({ ...prev, bio }));
        setEditingBio(false);
      }
    } catch (error) {
      console.error('Error updating bio:', error);
    }
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

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto pt-8 pb-12 px-4">
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-3xl">
                {user?.username?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user?.username}</h1>
              <p className="text-gray-500 mb-4">{user?.email}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {formatDistanceToNow(new Date(user?.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="text-gray-500">
                  {posts.length} posts
                </div>
              </div>

              <div className="mb-4">
                {editingBio ? (
                  <div className="space-y-3">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                      rows="3"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleBioUpdate}
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingBio(false);
                          setBio(user?.bio || '');
                        }}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <p className="text-gray-300">
                      {user?.bio || 'No bio yet.'}
                    </p>
                    {isOwnProfile && (
                      <button
                        onClick={() => setEditingBio(true)}
                        className="text-gray-500 hover:text-white transition-colors ml-4"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">
            {isOwnProfile ? 'Your Posts' : `${user?.username}'s Posts`}
          </h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white text-xl mb-4">No posts yet</div>
              <div className="text-gray-500">
                {isOwnProfile ? 'Share your first post!' : 'This user hasn\'t posted anything yet.'}
              </div>
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

export default Profile;