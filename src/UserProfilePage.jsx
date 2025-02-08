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
    'Visual Learning',
    'Step-by-step Explanations',
    'Mathematical Formulas',
    'Practical Examples',
    'Historical Context',
    'Diagrams & Charts',
    'Interactive Elements',
    'Conceptual Understanding',
    'Technical Details',
    'Brief Overview First',
    'Detailed Explanations',
    'Real-world Applications',
    'Analogies & Metaphors',
    'Problem Solving',
    'Proof-based Learning',
    'Easy Language',
  ];

  const educationLevels = [
    'Primary School',
    'Middle School',
    'High School',
    'Undergraduate',
    'Graduate',
    'PhD',
    'Postdoctoral',
    'Professional Researcher',
    'Industry Professional',
    'Educator',
  ];

  const fetchUserProfile = async () => {
    const userId = localStorage.getItem('user_id'); // Retrieve user_id from local storage

    if (!userId) {
      console.warn('User not logged in.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/get_user_profile?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const preferences = data.preferences;

        // Pre-fill the selections and fields
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
      const response = await fetch('http://localhost:5000/save_user_profile', {
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
    fetchUserProfile(); // Fetch the user profile when the page loads
  }, []);

  const BubbleSelection = ({ items, selected, onSelect }) => (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`px-5 py-2.5 rounded-full text-lg font-medium transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg active:scale-95 ${
            selected.includes(item)
              ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md'
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:text-orange-500'
          }`}
        >
          {item}
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
          {['education', 'learning'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xl font-medium rounded-t-lg transition-colors duration-200 ${
                activeTab === tab
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
        {activeTab === 'education' && (
          <div>
            <h3 className="text-2xl font-semibold mb-5">Educational Background</h3>
            <BubbleSelection
              items={educationLevels}
              selected={educationLevel}
              onSelect={(item) =>
                setEducationLevel((prev) =>
                  prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
                )
              }
            />
            <div className="space-y-5 mt-5">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Institution</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full p-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your institution"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Field of Study</label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  className="w-full p-3 border-2 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your field of study"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div>
            <h3 className="text-2xl font-semibold mb-5">Preferred Learning Styles</h3>
            <BubbleSelection
              items={learningStyles}
              selected={selectedStyles}
              onSelect={(item) =>
                setSelectedStyles((prev) =>
                  prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
                )
              }
            />
            <div className="mt-10">
              <h3 className="text-2xl font-semibold mb-3">Additional Preferences</h3>
              <textarea
                placeholder="Tell us about your preferred way of learning or any specific requirements..."
                value={additionalPreferences}
                onChange={(e) => setAdditionalPreferences(e.target.value)}
                className="w-full p-3 border-2 rounded-lg resize-none h-36 text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSavePreferences}
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
