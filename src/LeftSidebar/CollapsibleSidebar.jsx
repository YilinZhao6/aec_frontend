import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  GraduationCap, 
  Library, 
  Upload,
  Settings,
  LogOut,
  StickyNote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CollapsibleSidebar = ({ 
  onHomeClick, 
  onProfileClick, 
  onArchivesClick, 
  onUploadClick 
}) => {
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('collapsibleSidebarOpen');
    return savedState ? JSON.parse(savedState) : false;
  });
  
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('user_id'));

  useEffect(() => {
    localStorage.setItem('collapsibleSidebarOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    onHomeClick();
    setIsOpen(false);
  };

  const handleMenuItemClick = (action) => {
    action();
  };

  const MenuItem = ({ icon: Icon, label, onClick }) => (
    <button
      onClick={() => handleMenuItemClick(onClick)}
      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[#E0E0E0] rounded-md transition-colors"
    >
      <Icon className="w-5 h-5 text-[#3A3A3A]" />
      <span className="text-sm font-quicksand">{label}</span>
    </button>
  );

  return (
    <div ref={sidebarRef} className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 p-2 rounded-md bg-[#F0F0F0] border border-[#CCCCCC] shadow-md hover:bg-[#E0E0E0] transition-colors z-50"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-[#3A3A3A]" />
        ) : (
          <Menu className="w-5 h-5 text-[#3A3A3A]" />
        )}
      </button>

      <div
        className={`fixed top-0 left-0 h-auto max-h-[90vh] w-64 bg-[#F0F0F0] border-r border-[#CCCCCC] shadow-lg rounded-r-lg overflow-y-auto transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-[#CCCCCC] flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-[#E0E0E0]"
          >
            <X className="w-5 h-5 text-[#3A3A3A]" />
          </button>
        </div>

        <div className="p-3 space-y-1">
          <MenuItem icon={Home} label="Home" onClick={onHomeClick} />
          <MenuItem icon={GraduationCap} label="Profile" onClick={onProfileClick} />
          <MenuItem icon={Library} label="Archives" onClick={onArchivesClick} />
          <MenuItem icon={Upload} label="Upload" onClick={onUploadClick} />
          <MenuItem icon={StickyNote} label="Notes" onClick={() => navigate('/notes')} />
        </div>

        <div className="p-3 border-t border-[#CCCCCC]">
          <MenuItem 
            icon={Settings} 
            label="Settings" 
            onClick={() => navigate('/user_info')} 
          />
        </div>

        {isLoggedIn && (
          <div className="p-3 border-t border-[#CCCCCC]">
            <MenuItem 
              icon={LogOut} 
              label="Sign Out" 
              onClick={handleLogout}
            />
          </div>
        )}
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CollapsibleSidebar;