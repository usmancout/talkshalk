import React, { useState } from 'react';
import { Image, Send, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const newPost = await response.json();
        setContent('');
        setImage(null);
        setImagePreview(null);
        onPostCreated(newPost);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-black font-semibold">
              {user?.username?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-transparent border-none resize-none text-white placeholder-gray-500 focus:outline-none text-lg"
              rows="3"
            />
            
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-lg max-h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer text-gray-400 hover:text-yellow-400 transition-colors">
              <Image className="h-5 w-5" />
              <span>Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span>{loading ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;