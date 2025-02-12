import React from 'react';
import { X } from 'lucide-react';

const WelcomeModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Hyperknow!</h2>
            <p className="text-gray-600">
              We're excited to have you join our learning community.
            </p>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <p>
              Before you start exploring, please take a moment to set up your profile. This will help us:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Personalize your learning experience</li>
              <li>Provide content at the right level</li>
              <li>Tailor explanations to your preferences</li>
            </ul>
            <p className="font-medium text-gray-700">
              It'll only take a minute, and it'll make your experience much better!
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Got it, let's set up my profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;