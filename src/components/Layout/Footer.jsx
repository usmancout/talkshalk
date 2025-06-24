import React from 'react';
import { Heart, MessageSquare, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="h-6 w-6 text-yellow-400" />
              <span className="text-white text-xl font-bold">Talk Shalk</span>
            </div>
            <p className="text-gray-400 text-sm">
              A social platform designed for friends to share moments, memes, and memories together.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Share Posts & Memes</li>
              <li>Comment & Reply</li>
              <li>User Profiles</li>
              <li>Image Uploads</li>
              <li>Real-time Updates</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Github className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>for friends</span>
          </div>
          <div className="text-gray-400 text-sm mt-2 md:mt-0">
            © 2025 Talk Shalk. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;