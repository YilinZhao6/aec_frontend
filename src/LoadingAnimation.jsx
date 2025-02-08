import React from 'react';
import LeftNavigationBar from './LeftNavigationBar';

const LoadingAnimation = ({ loadingMessages }) => {
  return (
    <div className="fixed inset-0 flex">
      <LeftNavigationBar />
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-color)]">
        <div className="w-[28rem] h-[20rem] bg-white shadow-lg rounded-lg p-8 flex flex-col items-center justify-between space-y-6">
          <div className="relative flex items-center justify-center mt-4">
            <div className="w-20 h-20 rounded-full border-4 border-t-red-500 border-r-yellow-500 border-b-green-500 border-l-blue-500 animate-spin"></div>
          </div>
          <div className="text-2xl font-semibold text-gray-700 transition-opacity duration-500 ease-in-out text-center">
            {loadingMessages.length > 0 && <p>{loadingMessages[loadingMessages.length - 1]}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
