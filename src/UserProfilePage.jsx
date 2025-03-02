import React, { useState, useEffect } from 'react';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('education');
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [educationLevel, setEducationLevel] = useState([]);
  const [institution, setInstitution] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [additionalPreferences, setAdditionalPreferences] = useState('');
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  const learningStyles = [
    'Visual Learning', 'Step-by-step Explanations', 'Mathematical Formulas',
    'Practical Examples', 'Historical Context', 'Diagrams & Charts',
    'Interactive Elements', 'Conceptual Understanding', 'Technical Details',
    'Brief Overview First', 'Detailed Explanations', 'Real-world Applications',
    'Analogies & Metaphors', 'Problem Solving', 'Proof-based Learning',
    'Easy Language',
  ];

  const educationLevels = [
    'Primary School', 'Middle School', 'High School', 'Undergraduate',
    'Graduate', 'PhD', 'Postdoctoral', 'Professional Researcher',
    'Industry Professional', 'Educator',
  ];

  const fetchUserProfile = async () => {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      console.warn('User not logged in.');
      return;
    }

    try {
      const response = await fetch(`https://backend-ai-cloud-explains.onrender.com/get_user_profile?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const preferences = data.preferences;

        setEducationLevel(preferences.education.level || []);
        setInstitution(preferences.education.institution || '');
        setFieldOfStudy(preferences.education.field_of_study || '');
        setSelectedStyles(preferences.learning_styles || []);
        setAdditionalPreferences(preferences.additional_preferences || '');
      } else if (response.status === 404) {
        console.warn('No user profile found. Fields will remain empty.');
      } else {
        console.error('Error fetching user profile:', await response.text());
      }
    } catch (error) {
      console.error('Error connecting to the server:', error);
    }
  };

  const handleSavePreferences = async () => {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      alert('User not logged in.');
      return;
    }

    const preferences = {
      education: {
        level: educationLevel,
        institution,
        field_of_study: fieldOfStudy,
      },
      learning_styles: selectedStyles,
      additional_preferences: additionalPreferences,
    };

    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/save_user_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, preferences }),
      });

      if (response.ok) {
        setShowSavedAlert(true);
        setTimeout(() => setShowSavedAlert(false), 3000);
      } else {
        console.error('Error saving preferences:', await response.text());
        alert('Failed to save preferences. Please try again.');
      }
    } catch (error) {
      console.error('Error connecting to the server:', error);
      alert('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const BubbleSelection = ({ items, selected, onSelect }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`
            flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium
            transition-all duration-200 ease-in-out
            ${selected.includes(item)
              ? 'bg-gray-900 text-white shadow-sm'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }
          `}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Profile Page</h1>
        <p className="text-sm text-gray-500 mt-1">Help us tailor the content to your needs by customizing your profile preferences.</p>
      </div>

      {/* Button-style Tabs */}
      <div className="mb-6">
        <div className="inline-flex p-1 space-x-1 bg-gray-100 rounded-lg">
          {['education', 'learning'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Educational Background</h3>
              <BubbleSelection
                items={educationLevels}
                selected={educationLevel}
                onSelect={(item) =>
                  setEducationLevel((prev) =>
                    prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
                  )
                }
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Enter your institution"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Enter your field of study"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Preferred Learning Styles</h3>
              <BubbleSelection
                items={learningStyles}
                selected={selectedStyles}
                onSelect={(item) =>
                  setSelectedStyles((prev) =>
                    prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
                  )
                }
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Additional Preferences</h3>
              <textarea
                value={additionalPreferences}
                onChange={(e) => setAdditionalPreferences(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none h-32 focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Tell us about your preferred way of learning or any specific requirements..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSavePreferences}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors duration-200"
        >
          Save Changes
        </button>
      </div>

      {/* Save Alert */}
      {showSavedAlert && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-500 text-sm">
          Changes saved successfully
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;