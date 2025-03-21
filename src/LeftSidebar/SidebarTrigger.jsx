import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  GraduationCap, 
  Library, 
  Upload,
  Settings,
  LogOut,
  Menu,
  StickyNote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SidebarTrigger = ({ 
  onHomeClick, 
  onProfileClick, 
  onArchivesClick, 
  onUploadClick 
}) => {
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    return savedState ? JSON.parse(savedState) : false;
  });
  
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('user_id'));

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  useEffect(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    
    if (trigger) {
      trigger.addEventListener('mouseenter', handleMouseEnter);
      trigger.addEventListener('mouseleave', handleMouseLeave);
    }
    
    if (menu) {
      menu.addEventListener('mouseenter', handleMouseEnter);
      menu.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (trigger) {
        trigger.removeEventListener('mouseenter', handleMouseEnter);
        trigger.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      if (menu) {
        menu.removeEventListener('mouseenter', handleMouseEnter);
        menu.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

  const MenuItem = ({ icon: Icon, label, onClick, color = "bg-[#F0F0F0]" }) => (
    <button
      onClick={() => handleMenuItemClick(onClick)}
      className={`flex items-center justify-center gap-2 ${color} shadow-md rounded-full p-3 hover:scale-110 transition-all duration-200`}
      title={label}
    >
      <Icon className="w-5 h-5 text-[#3A3A3A]" />
      <span className="text-sm font-quicksand hidden md:inline">{label}</span>
    </button>
  );

  return (
    <>
      <div 
        ref={triggerRef}
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`}
      >
        <div className="flex flex-col items-center w-16 h-20 bg-[#F0F0F0] border-y border-r border-[#CCCCCC] rounded-r-lg shadow-md cursor-pointer">
          <div className="flex-1 flex items-center justify-center pt-2">
            <Menu className="w-6 h-6 text-[#3A3A3A]" />
          </div>
          <div className="text-[10px] font-medium text-[#3A3A3A] pb-2">
            MENU
          </div>
        </div>
      </div>

      <div 
        ref={menuRef}
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 ${
          isOpen 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-full opacity-0'
        }`}
      >
        <div className="bg-[#F0F0F0]/90 backdrop-blur-sm border border-[#CCCCCC] rounded-r-lg p-4 shadow-lg">
          <div className="grid grid-cols-1 gap-4">
            <MenuItem icon={Home} label="Home" onClick={onHomeClick} />
            <MenuItem icon={GraduationCap} label="Profile" onClick={onProfileClick} />
            <MenuItem icon={Library} label="Archives" onClick={onArchivesClick} />
            <MenuItem icon={Upload} label="Upload" onClick={onUploadClick} />
            <MenuItem icon={StickyNote} label="Notes" onClick={() => navigate('/notes')} />
            <MenuItem icon={Settings} label="Settings" onClick={() => navigate('/user_info')} />
            
            {isLoggedIn && (
              <MenuItem 
                icon={LogOut} 
                label="Sign Out" 
                onClick={handleLogout} 
                color="bg-red-50"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarTrigger;