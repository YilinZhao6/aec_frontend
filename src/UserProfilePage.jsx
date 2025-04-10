import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { SidebarTrigger } from './LeftSidebar';
import MobileMenuDrawer from './MobileMenuDrawer';
import WelcomeModal from './WelcomeModal';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('education');
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [educationLevel, setEducationLevel] = useState([]);
  const [institution, setInstitution] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [additionalPreferences, setAdditionalPreferences] = useState('');
  const [showSavedAlert, setShowSavedAlert] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('user_id'));

  const handleSignOut = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    navigate('/');
  };

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
    if (!userId) return;

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
      }
    } catch (error) {
      console.error('Error connecting to the server:', error);
    }
  };

  const handleSavePreferences = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, preferences }),
      });

      if (response.ok) {
        setShowSavedAlert(true);
        setTimeout(() => {
          setShowSavedAlert(false);
          // Only show notes modal if saving from learning tab
          if (activeTab === 'learning') {
            setShowNotesModal(true);
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error connecting to the server:', error);
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
              ? 'bg-[#E5E5E5] text-gray-900 border border-[#CCCCCC]'
              : 'bg-[#EEEEEE] text-gray-700 hover:bg-[#E5E5E5] border border-[#CCCCCC]'
            }
          `}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#F0F0F0]">
      {/* Show SidebarTrigger only on desktop */}
      <div className="hidden sm:block">
        <SidebarTrigger 
          onHomeClick={() => navigate('/')}
          onProfileClick={() => navigate('/profile')}
          onArchivesClick={() => navigate('/archive')}
          onUploadClick={() => navigate('/upload')}
        />
      </div>

      {/* Show MobileMenuDrawer only on mobile */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <MobileMenuDrawer 
          isLoggedIn={isLoggedIn}
          onHomeClick={() => navigate('/')}
          onProfileClick={() => navigate('/profile')}
          onArchivesClick={() => navigate('/archive')}
          onUploadClick={() => navigate('/upload')}
          onSignOut={handleSignOut}
          onLoginClick={() => navigate('/login')}
        />
      </div>

      {/* Sign In Button - visible on mobile */}
      {!isLoggedIn && (
        <div className="sm:hidden fixed top-4 right-4 z-30">
          <button
            onClick={() => navigate('/login')}
            className="cyber-button bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <LogIn className="w-5 h-5 text-white" />
            <span className="text-white">Sign In</span>
          </button>
        </div>
      )}

      <div className="w-[65%] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Customize your learning experience</p>
        </div>

        {/* Tab Selection */}
        <div className="mb-6 flex space-x-1">
          <button
            onClick={() => setActiveTab('education')}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
              ${activeTab === 'education'
                ? 'bg-[#E5E5E5] text-gray-900 border border-[#CCCCCC]'
                : 'bg-[#EEEEEE] text-gray-600 hover:text-gray-900 hover:bg-[#E5E5E5] border border-[#CCCCCC]'
              }
            `}
          >
            Education
          </button>
          <button
            onClick={() => setActiveTab('learning')}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
              ${activeTab === 'learning'
                ? 'bg-[#E5E5E5] text-gray-900 border border-[#CCCCCC]'
                : 'bg-[#EEEEEE] text-gray-600 hover:text-gray-900 hover:bg-[#E5E5E5] border border-[#CCCCCC]'
              }
            `}
          >
            Learning
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'education' && (
            <div className="bg-[#EEEEEE] rounded-lg border border-[#CCCCCC] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#CCCCCC] bg-[#E5E5E5]">
                <h2 className="text-lg font-medium text-gray-900">Educational Background</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Education Level</h3>
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
                      className="w-full p-2 text-sm bg-[#F0F0F0] border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                      placeholder="Enter your institution"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      className="w-full p-2 text-sm bg-[#F0F0F0] border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                      placeholder="Enter your field of study"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="bg-[#EEEEEE] rounded-lg border border-[#CCCCCC] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#CCCCCC] bg-[#E5E5E5]">
                <h2 className="text-lg font-medium text-gray-900">Learning Preferences</h2>
              </div>
              <div className="p-6 space-y-6">
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
                    className="w-full p-2 text-sm bg-[#F0F0F0] border border-[#CCCCCC] rounded-md resize-none h-32 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Tell us about your preferred way of learning or any specific requirements..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="px-4 py-2 bg-[#E5E5E5] text-gray-900 text-sm font-medium rounded-md border border-[#CCCCCC] hover:bg-[#D5D5D5] transition-colors duration-200"
          >
            Save Changes
          </button>
        </div>

        {/* Save Alert */}
        {showSavedAlert && (
          <div className="fixed bottom-6 right-6 bg-[#E5E5E5] text-gray-900 px-4 py-2 rounded-md shadow-lg border border-[#CCCCCC] transition-opacity duration-500 text-sm">
            Changes saved successfully
          </div>
        )}

        {/* Notes Tutorial Modal */}
        {showNotesModal && (
          <WelcomeModal 
            initialStep="notes"
            onClose={() => {
              setShowNotesModal(false);
              navigate('/notes');
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;