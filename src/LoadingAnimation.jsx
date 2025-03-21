import React from 'react';
import LeftNavigationBar from './LeftNavigationBar';

const LoadingAnimation = ({ loadingMessages }) => {
  return (
    <div className="fixed inset-0 flex">
      <LeftNavigationBar />
      <div className="flex-1 flex items-center justify-center bg-terminal-white dark:bg-cyber-black transition-colors duration-300">
        <div className="w-[28rem] h-[20rem] cyber-card p-8 flex flex-col items-center justify-between space-y-6">
          <div className="relative flex items-center justify-center mt-4">
            <div className="w-20 h-20 rounded-full border-4 border-t-neon-green border-r-neon-cyan border-b-neon-blue border-l-neon-purple animate-spin"></div>
          </div>
          <div className="text-2xl font-semibold text-gray-700 dark:text-terminal-white transition-opacity duration-500 ease-in-out text-center">
            {loadingMessages.length > 0 && <p className="terminal-cursor font-sora">{loadingMessages[loadingMessages.length - 1]}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;