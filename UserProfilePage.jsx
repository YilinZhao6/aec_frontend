import React, { useState } from 'react';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('interests');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  const subjects = [
    'Physics', 'Astrophysics', 'Mathematics', 'Chemistry', 'Biology',
    'Computer Science', 'Engineering', 'Earth Science', 'Statistics',
    'Quantum Mechanics', 'Relativity', 'Cosmology', 'Particle Physics',
    'Nuclear Physics', 'Plasma Physics', 'Condensed Matter', 'String Theory',
    'Dark Matter', 'Black Holes', 'Exoplanets', 'Galaxy Formation'
  ];

  const learningStyles = [
    'Visual Learning', 'Step-by-step Explanations', 'Mathematical Formulas',
    'Practical Examples', 'Historical Context', 'Diagrams & Charts',
    'Interactive Elements', 'Conceptual Understanding', 'Technical Details',
    'Brief Overview First', 'Detailed Explanations', 'Real-world Applications',
    'Analogies & Metaphors', 'Problem Solving', 'Video Explanations',
    'Research Papers', 'Case Studies'
  ];

  const educationLevels = [
    'High School', 'Undergraduate', 'Graduate', 'PhD', 'Postdoctoral',
    'Professional Researcher', 'Industry Professional', 'Educator'
  ];

  const handleBubbleClick = (item, currentSelected, setSelected) => {
    if (currentSelected.includes(item)) {
      setSelected(currentSelected.filter(i => i !== item));
    } else {
      setSelected([...currentSelected, item]);
    }
  };

  const handleSave = () => {
    setShowSavedAlert(true);
    setTimeout(() => setShowSavedAlert(false), 3000);
  };

  const BubbleSelection = ({ items, selected, onSelect }) => (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`
            px-5 py-2.5 rounded-full text-lg font-medium
            transform transition-all duration-300 ease-in-out
            hover:scale-110 hover:shadow-lg
            active:scale-95
            ${
              selected.includes(item)
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:text-orange-500'
            }
          `}
        >
          <span className="relative inline-flex items-center">
            {selected.includes(item) && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-400"></span>
              </span>
            )}
            {item}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-7">
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">Customize Your Learning Experience</h1>
        <p className="text-2xl text-gray-600">
          Help us tailor the content to your needs by customizing your profile preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-3 border-b-2">
          {['interests', 'education', 'learning'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xl font-medium rounded-t-lg transition-colors duration-200
                ${activeTab === tab 
                  ? 'text-orange-500 border-b-3 border-orange-500 bg-orange-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-7">
        {activeTab === 'interests' && (
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-5">Select Your Areas of Interest</h3>
              <BubbleSelection
                items={subjects}
                selected={selectedSubjects}
                onSelect={(item) => handleBubbleClick(item, selectedSubjects, setSelectedSubjects)}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Additional Interests</h3>
              <textarea
                placeholder="Tell us about any other specific topics or areas you're interested in..."
                className="w-full p-3 border-2 rounded-lg resize-none h-36 text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-5">Educational Background</h3>
              <BubbleSelection
                items={educationLevels}
                selected={selectedSubjects}
                onSelect={(item) => handleBubbleClick(item, selectedSubjects, setSelectedSubjects)}
              />
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Current Institution/Organization
                </label>
                <input
                  type="text"
                  className="w-full p-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Columbia University"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Field of Study/Research
                </label>
                <input
                  type="text"
                  className="w-full p-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Astrophysics"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-5">Preferred Learning Styles</h3>
              <BubbleSelection
                items={learningStyles}
                selected={selectedStyles}
                onSelect={(item) => handleBubbleClick(item, selectedStyles, setSelectedStyles)}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-3">Additional Preferences</h3>
              <textarea
                placeholder="Tell us about your preferred way of learning or any specific requirements..."
                className="w-full p-3 border-2 rounded-lg resize-none h-36 text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-orange-500 text-white text-xl font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-md"
        >
          Save Preferences
        </button>
      </div>

      {/* Save Alert */}
      {showSavedAlert && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500 text-lg">
          Your preferences have been saved successfully!
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;