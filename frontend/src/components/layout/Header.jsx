import React from 'react';
import { Menu, User } from 'lucide-react';

const Header = ({ toggleSidebar, userName = 'Guest' }) => {
  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left: Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} className="text-gray-700" />
        </button>

        {/* Center: Page title (optional, can be dynamic) */}
        <div className="flex-1 lg:ml-0 ml-4">
          <h2 className="text-xl font-semibold text-gray-800">
            AI Career Assistant
          </h2>
        </div>

        {/* Right: User Profile */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {userName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;