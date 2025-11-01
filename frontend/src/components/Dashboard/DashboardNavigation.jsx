import React from 'react';
import { 
  Home, 
  Calendar, 
  User, 
  LogOut,
  RefreshCw
} from 'lucide-react';

const DashboardNavigation = ({ currentView, onViewChange, onLogout, onRefresh, user }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'from-blue-500 to-blue-600' },
    { id: 'sips', label: 'SIPs', icon: Calendar, color: 'from-purple-500 to-purple-600' },
    { id: 'profile', label: 'Profile', icon: User, color: 'from-indigo-500 to-indigo-600' }
  ];

  return (
    <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg supports-backdrop-blur:bg-white/70 dark:supports-backdrop-blur:bg-gray-800/70 shadow-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Brand */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <img src="/Stonks.jpeg" alt="Stonks" className="w-12 h-12 rounded-lg shadow-lg" />
              <div className="flex-shrink-0 select-none">
                <span className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg">
                  Stonks
                </span>
                <div className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                  Investment Tracking Platform
                </div>
              </div>
            </div>
            
            {/* Enhanced Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange && onViewChange(item.id)}
                    className={`group relative px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-blue-200`
                        : 'bg-white/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-white opacity-20 animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enhanced Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Refresh Button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="group relative px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                title="Refresh dashboard"
              >
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            )}

            {/* Enhanced Logout Button */}
            <button
              onClick={onLogout}
              className="group relative px-4 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden pb-4">
          <div className="flex items-center justify-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange && onViewChange(item.id)}
                  className={`group relative px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;

