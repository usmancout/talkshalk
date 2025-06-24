import React from 'react';
import { MessageSquare, Users, Zap } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-yellow-400" />
              <span className="text-white text-2xl font-bold">Talk Shalk</span>
            </div>
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="h-4 w-4" />
                <span className="text-sm">Connect with Friends</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Share Your Moments</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="text-gray-400 text-sm">
              Your Social Space
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;