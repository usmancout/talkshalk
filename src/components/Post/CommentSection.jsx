import React, { useState, useEffect } from 'react';
import { Send, Reply, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/post/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          postId,
          content: newComment
        })
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          postId,
          content: replyText,
          parentCommentId: replyingTo
        })
      });

      if (response.ok) {
        setReplyText('');
        setReplyingTo(null);
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          fetchComments();
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div className="border-t border-gray-800 bg-black/20">
      <div className="p-6">
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex space-x-3">
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg transition-colors flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-semibold text-xs">
                    {comment.author?.username?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-white font-medium text-sm">
                      {comment.author?.username}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{comment.content}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                      className="text-gray-500 hover:text-yellow-400 text-xs flex items-center space-x-1"
                    >
                      <Reply className="h-3 w-3" />
                      <span>Reply</span>
                    </button>
                    {user?.id === comment.author?._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-gray-500 hover:text-red-400 text-xs flex items-center space-x-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {replyingTo === comment._id && (
                <div className="ml-11">
                  <form onSubmit={handleAddReply} className="flex space-x-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg transition-colors"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </form>
                </div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-xs">
                          {reply.author?.username?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium text-sm">
                            {reply.author?.username}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{reply.content}</p>
                        {user?.id === reply.author?._id && (
                          <button
                            onClick={() => handleDeleteComment(reply._id)}
                            className="text-gray-500 hover:text-red-400 text-xs flex items-center space-x-1 mt-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;