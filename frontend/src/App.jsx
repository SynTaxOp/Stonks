import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import Auth from './components/Auth/Auth.jsx';
import UserDashboard from './components/Dashboard/UserDashboard.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import './App.css';

const AppContent = () => {
  const { user, isLoading, login, logout, updateUser } = useAuth();

        if (isLoading) {
          return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
              {/* Subtle Animated Background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Loading Stonks</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Preparing your investment dashboard...</p>
                <LoadingSpinner />
              </div>
            </div>
          );
        }

  if (user) {
    return <UserDashboard user={user} onLogout={logout} onUserUpdate={updateUser} />;
  }

  return <Auth onLogin={login} />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;