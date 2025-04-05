import React, { useState, useEffect } from 'react';
import { TrendingUp, Bell, Loader2 } from 'lucide-react';
import { systemMessages, discoveries } from '../data/notifications';

const TrendingSection = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
      <Icon className="w-3 h-3" />
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
    <div className="fixed top-4 left-6 w-64 z-20">
      <div className="flex items-center space-x-2">
        <TabButton
          id="trending"
          label="Latest"
          icon={TrendingUp}
        />
        <TabButton
          id="announcements"
          label="System"
          icon={Bell}
        />
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="mt-2 transition-all duration-300">
          {activeTab === 'trending' ? (
            <TrendingCard item={currentItem} />
          ) : (
            <AnnouncementCard item={currentItem} />
          )}
        </div>
      )}
    </div>
  );
};

export default TrendingSection;