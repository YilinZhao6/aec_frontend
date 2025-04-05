import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  TrendingUp, 
  Bell,
  Home,
  GraduationCap,
  Library,
  Upload,
  Settings,
  LogOut,
  Loader2,
  LogIn
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { systemMessages, discoveries } from './data/notifications';

const MobileMenuDrawer = ({ 
  isLoggedIn,
  onHomeClick,
  onProfileClick,
  onArchivesClick,
  onUploadClick,
  onSignOut,
  onLoginClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('announcements'); // Changed default to announcements
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    // Check for priority messages first
    const priorityMessage = systemMessages.find(msg => msg.priority);
    if (priorityMessage && activeTab === 'announcements') {
      setCurrentIndex(systemMessages.findIndex(msg => msg.id === priorityMessage.id));
      return;
    }

    // Rotate items every 5 seconds if no priority message
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const items = activeTab === 'trending' ? discoveries : systemMessages;
        return (prev + 1) % items.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setCurrentIndex(0);
      }}
      className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
        activeTab === id
          ? 'bg-[#E5E5E5] text-gray-900 border border-[#CCCCCC]'
          : 'text-gray-600 hover:bg-[#E5E5E5] hover:text-gray-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const LoadingState = () => (
    <div className="flex items-center justify-center h-24">
      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
    </div>
  );

  const TrendingCard = ({ item }) => (
    <div className="bg-[#EEEEEE] border border-[#CCCCCC] rounded-lg p-3">
      <div>
        <span className="inline-block px-2 py-0.5 text-xs font-medium text-gray-600 bg-[#E5E5E5] rounded-md mb-2">
          {item.category}
        </span>
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          {item.title}
        </h3>
        <p className="text-xs text-gray-600">
          {item.description}
        </p>
      </div>
    </div>
  );

  const AnnouncementCard = ({ item }) => {
    const getTypeStyles = (type) => {
      switch (type) {
        case 'maintenance':
          return 'bg-orange-100 text-orange-700';
        case 'update':
          return 'bg-blue-100 text-blue-700';
        case 'announcement':
          return 'bg-green-100 text-green-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    };

    const getTypeLabel = (type) => {
      return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
      <div className="bg-[#EEEEEE] border border-[#CCCCCC] rounded-lg p-3">
        <div>
          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-md mb-2 ${getTypeStyles(item.type)}`}>
            {getTypeLabel(item.type)}
          </span>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            {item.title}
          </h3>
          <p className="text-xs text-gray-600">
            {item.description}
          </p>
        </div>
      </div>
    );
  };

  const currentItems = activeTab === 'trending' ? discoveries : systemMessages;
  const currentItem = currentItems[currentIndex];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden p-2 bg-[#F0F0F0] text-gray-600 rounded-lg hover:bg-[#E5E5E5] border border-[#CCCCCC]"
      >
        <Menu className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden">
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-[#F0F0F0] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#CCCCCC]">
              <div className="flex items-center">
                <img 
                  src="/hyperknow_logo_with_text.svg" 
                  alt="HyperKnow" 
                  className="h-6" 
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[#E5E5E5] rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Notifications Section */}
            <div className="p-4 border-b border-[#CCCCCC]">
              <div className="flex items-center space-x-2 mb-4">
                <TabButton
                  id="announcements"
                  label="System"
                  icon={Bell}
                />
                <TabButton
                  id="trending"
                  label="Latest"
                  icon={TrendingUp}
                />
              </div>

              {loading ? (
                <LoadingState />
              ) : (
                <div className="transition-all duration-300">
                  {activeTab === 'trending' ? (
                    <TrendingCard item={currentItem} />
                  ) : (
                    <AnnouncementCard item={currentItem} />
                  )}
                </div>
              )}
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 p-4">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onHomeClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#E5E5E5] rounded-lg"
                >
                  <Home className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Home</span>
                </button>
                <button
                  onClick={() => {
                    onProfileClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#E5E5E5] rounded-lg"
                >
                  <GraduationCap className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Profile</span>
                </button>
                <button
                  onClick={() => {
                    onArchivesClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#E5E5E5] rounded-lg"
                >
                  <Library className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Archives</span>
                </button>
                <button
                  onClick={() => {
                    onUploadClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#E5E5E5] rounded-lg"
                >
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Upload</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/user_info');
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#E5E5E5] rounded-lg"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Settings</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#CCCCCC]">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    onSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenuDrawer;