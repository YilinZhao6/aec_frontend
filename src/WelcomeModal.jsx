import React, { useState } from 'react';
import { X, StickyNote, Plus, HelpCircle } from 'lucide-react';

const WelcomeModal = ({ onClose, initialStep = 'profile' }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const renderProfileStep = () => (
    <>
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
    </>
  );

  const renderNotesStep = () => (
    <>
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Take Notes!</h2>
          <p className="text-gray-600">
            After setting up your profile, let's explore our powerful notes feature.
          </p>
        </div>

        <div className="space-y-5 text-gray-600">
          <div className="flex items-start space-x-3">
            <div className="bg-gray-100 p-2 rounded-full mt-1">
              <StickyNote className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Navigate to Notes</p>
              <p>Use the left sidebar menu to access the Notes page.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-gray-100 p-2 rounded-full mt-1">
              <Plus className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Create a New Note</p>
              <p>Click the "+" button to create a new note and start writing.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-gray-100 p-2 rounded-full mt-1">
              <HelpCircle className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Ask Questions About Content</p>
              <p>Select text in your notes and click the "?" icon in the toolbar to ask questions about that content.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
        <button
          onClick={onClose}
          className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          I'm ready to start taking notes!
        </button>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        
        {currentStep === 'profile' ? renderProfileStep() : renderNotesStep()}
      </div>
    </div>
  );
};

export default WelcomeModal;