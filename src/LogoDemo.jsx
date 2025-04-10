import React from 'react';
import Logo from './Logo';
import { useTheme, ThemeToggle } from './ThemeProvider';

const LogoDemo = () => {

  return (
    <div className="min-h-screen bg-terminal-white dark:bg-cyber-black transition-colors duration-300 flex flex-col items-center justify-center">
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="cyber-card p-8 max-w-md w-full">
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-2xl font-medium text-gray-900 dark:text-terminal-white font-space-mono">Logo Preview</h1>
          
          <div className="space-y-12 w-full">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-space-mono">Default Size</p>
              <div className="p-6 bg-off-white dark:bg-cyber-dark border border-slate-300 dark:border-slate-600 rounded-lg w-full flex justify-center">
                <Logo />
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-space-mono">Small Size</p>
              <div className="p-6 bg-off-white dark:bg-cyber-dark border border-slate-300 dark:border-slate-600 rounded-lg w-full flex justify-center">
                <Logo size="small" />
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-space-mono">Large Size</p>
              <div className="p-6 bg-off-white dark:bg-cyber-dark border border-slate-300 dark:border-slate-600 rounded-lg w-full flex justify-center">
                <Logo size="large" />
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-300 font-space-mono text-center">
            <p>The logo uses #3A3A3A with a clean, minimalist style</p>
            <p>Font: Sora, 22px, uppercase</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoDemo;