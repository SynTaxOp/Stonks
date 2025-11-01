import React from 'react';

const LoadingSpinner = () => {
  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          
          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
          
          .shimmer-animation {
            animation: shimmer 2s linear infinite;
          }
          
          .loading-animation {
            animation: loading 2s ease-in-out infinite;
          }
        `}
      </style>
      
      <div className="bg-gray-50 dark:bg-transparent flex items-center justify-center py-24">
        <div className="text-center">
          {/* Rotating ring animation */}
          <div className="relative mx-auto mb-8 w-24 h-24">
            {/* Outer rotating ring */}
            <div className="absolute inset-0">
              <div className="w-full h-full border-4 border-gray-200 dark:border-gray-700 border-t-green-500 dark:border-t-green-400 rounded-full animate-spin"></div>
            </div>
            
            {/* Middle ring */}
            <div className="absolute inset-4">
              <div className="w-full h-full border-4 border-gray-200 dark:border-gray-700 border-b-green-500 dark:border-b-green-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            
            {/* Inner ring */}
            <div className="absolute inset-8">
              <div className="w-full h-full border-2 border-gray-200 dark:border-gray-700 border-r-green-400 dark:border-r-green-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
            </div>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Text with gradient animation */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent bg-[length:200%_auto] shimmer-animation">
              Loading data and Building wealth,
            </h2>
            <p className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent bg-[length:200%_auto] shimmer-animation">
              one byte at a time.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">- Please wait.</p>
          </div>

          {/* Animated progress bar */}
          <div className="mt-8 w-64 mx-auto">
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full loading-animation" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingSpinner;
