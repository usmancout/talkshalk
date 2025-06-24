import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Plus, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-black shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-yellow-400" />
              <span className="text-white text-xl font-bold">Talk Shalk</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              to="/create"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/create') 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Link>

            <Link
              to={`/profile/${user?.id}`}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(`/profile/${user?.id}`) 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;