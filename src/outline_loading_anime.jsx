import React, { useState, useEffect } from 'react';
import { ListTree, ChevronRight, CheckCircle, Coffee, Sparkles } from 'lucide-react';

const OutlineGenerationScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatingText, setGeneratingText] = useState('');

  const outlineSteps = [
    "Analyzing document structure...",
    "Processing learning objectives...",
    "Organizing sections...",
    "Finalizing outline..."
  ];

  // Typing animation effect for steps
  useEffect(() => {
    const text = outlineSteps[currentStep];
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setGeneratingText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        if (currentStep < outlineSteps.length - 1) {
          setTimeout(() => setCurrentStep(prev => prev + 1), 1000);
        }
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentStep]);

  return (
    <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 w-full h-full min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {outlineSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-orange-500 text-white' : 'bg-orange-200'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < outlineSteps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-orange-500' : 'bg-orange-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-2">
              <ListTree className="w-5 h-5 text-orange-600 animate-pulse" />
              <span className="text-orange-900 font-mono">
                {generatingText}<span className="animate-pulse">|</span>
              </span>
            </div>
          </div>
        </div>

        {/* Content Box - Shows Processing Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-orange-100">
          <div className="space-y-6">
            <div className="text-center mb-6 flex items-center justify-center space-x-2">
              <Coffee className="w-5 h-5 text-orange-500 animate-bounce" />
              <p className="text-orange-700">Before your coffee cools, your outline's ready to rule!</p>
            </div>
            {/* Status Messages */}
            {outlineSteps.slice(0, currentStep + 1).map((step, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-4 rounded-lg bg-orange-50 border border-orange-100"
              >
                <div className="mt-1">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-orange-700">{step}</p>
                  <p className="text-sm text-orange-600">{`Step ${index + 1} of ${outlineSteps.length}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutlineGenerationScreen;
