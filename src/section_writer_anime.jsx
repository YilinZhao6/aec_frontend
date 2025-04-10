const SectionWriterScreen = ({ 
  outlineSections, 
  currentSection, 
  completedSections, 
  generatingText 
}) => {
  return (
    <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 w-full h-full min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-4">
          <span className="text-orange-900 font-mono">{generatingText}<span className="animate-pulse">|</span></span>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border border-orange-100">
          <div className="space-y-6">
            {outlineSections.map((section, index) => {
              const isCompleted = completedSections.includes(index);
              const isCurrent = currentSection === index;

              return (
                <div key={index} className={`transition-all duration-500 ${isCompleted || isCurrent ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="flex items-center space-x-2 text-orange-900 font-semibold mb-3">
                    <h3 className="text-lg">{section.section_title}</h3>
                  </div>
                  <div className="ml-7 space-y-2">
                    {section.learning_goals?.map((goal, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-orange-600">
                        <span className="text-sm">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionWriterScreen;