import React, { useState } from 'react';
import { Heart, MessageCircle, Trash2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import CommentSection from './CommentSection';

const PostCard = ({ post, onDelete, onLike }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post._id}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        onLike(post._id, data.likes, data.isLiked);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${post._id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (response.ok) {
          onDelete(post._id);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const isLiked = post.likes?.includes(user?.id);

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-black font-semibold text-sm">
                {post.author?.username?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-white font-semibold">{post.author?.username}</h3>
              <p className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {user?.id === post.author?._id && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-700">
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Post</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-white text-lg leading-relaxed">{post.content}</p>
        </div>

        {post.image && (
          <div className="mb-4">
            <img
              src={`http://localhost:5000/uploads/${post.image}`}
              alt="Post"
              className="w-full rounded-lg max-h-96 object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isLiked 
                  ? 'text-red-400 bg-red-400/20' 
                  : 'text-gray-500 hover:text-red-400 hover:bg-red-400/10'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes?.length || 0}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments?.length || 0}</span>
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <CommentSection postId={post._id} />
      )}
    </div>
  );
};

export default PostCard;