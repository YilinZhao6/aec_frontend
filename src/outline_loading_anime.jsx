import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';

const funFacts = [
  "Light takes 8 minutes and 20 seconds to travel from the Sun to Earth.",
  "Your brain generates about 20 watts of power—enough to power a dim light bulb!",
  "A teaspoon of a neutron star weighs about 6 billion tons.",
  "Water can boil and freeze at the same time under special conditions.",
  "Octopuses have three hearts and blue blood.",
  "Time moves slower in stronger gravitational fields—a concept known as time dilation.",
  "The human body contains around 37.2 trillion cells.",
  "A day on Venus is longer than a year on Venus."
];

// Loading dots component
const LoadingDots = ({ activeDots }) => (
  <div className="flex justify-center space-x-2">
    {[...Array(5)].map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          index < activeDots ? 'bg-gray-800' : 'bg-gray-200'
        }`}
      />
    ))}
  </div>
);

const ProcessingMessage = ({ message }) => (
  <div className="absolute -bottom-6 left-0 right-0 flex justify-center opacity-70">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="animate-pulse">{message}</span>
    </div>
  </div>
);

const OutlineGenerationScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatingText, setGeneratingText] = useState('');
  const [currentFact, setCurrentFact] = useState(funFacts[0]);
  const [processingMessage, setProcessingMessage] = useState('');
  const [finalizingStartTime, setFinalizingStartTime] = useState(null);

  // Typing animation for steps
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
        } else if (currentStep === outlineSteps.length - 1) {
          // Set the start time when we begin "Finalizing outline..."
          setFinalizingStartTime(Date.now());
        }
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, [currentStep]);

  // Fun facts rotation
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    }, 3000);
    return () => clearInterval(factInterval);
  }, []);

  // Processing message timer after "Finalizing outline..."
  useEffect(() => {
    if (!finalizingStartTime) return;

    const messageInterval = setInterval(() => {
      const elapsed = Date.now() - finalizingStartTime;
      
      if (elapsed > 14000) {
        setProcessingMessage("It's coming soon...");
      } else if (elapsed > 6000) {
        setProcessingMessage("Don't worry, we are diving deep into it");
      }
    }, 1000);

    return () => clearInterval(messageInterval);
  }, [finalizingStartTime]);

  // Calculate active dots based on current step (starting from 2nd dot)
  const activeDots = Math.min(currentStep + 2, 5);

  return (
    <div className="relative min-h-screen bg-white">
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-3xl space-y-16">
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-16 pl-14 pr-16 text-xl bg-gray-50 rounded-lg border border-gray-200 flex items-center">
              <Search className="absolute left-4 w-6 h-6 text-gray-400" />
              <span className="text-gray-600">{generatingText}<span className="animate-pulse">|</span></span>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gray-900 text-white rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </div>
            {processingMessage && <ProcessingMessage message={processingMessage} />}
          </div>

          {/* Loading Dots */}
          <LoadingDots activeDots={activeDots} />

          {/* Fun Fact Box */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
            <div className="mb-4">
              <span className="text-gray-500 uppercase tracking-wider text-sm font-medium">Research Insight</span>
            </div>
            <p className="text-gray-600 text-lg font-light leading-relaxed transition-all duration-500 ease-in-out">
              {currentFact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const outlineSteps = [
  "Analyzing document structure...",
  "Processing learning objectives...",
  "Organizing sections...",
  "Finalizing outline..."
];

export default OutlineGenerationScreen;