import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, User, Check, X } from 'lucide-react';

interface TopBarProps {
  onSearch?: (query: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onSearch }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Job Assigned', message: 'Job #8492 assigned to M. Torres', time: '10m ago', unread: true },
    { id: '2', title: 'Status Change', message: 'Job #8493 marked as Completed', time: '1h ago', unread: true },
    { id: '3', title: 'Payment Received', message: 'Invoice #INV-2026-001 paid ($450.00)', time: '3h ago', unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div
      className="h-16 px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 select-none bg-[#FFFDF2] border-b-2 border-[#0F0F0F]"
    >
      {/* Search Input */}
      <div className="relative w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0F0F0F]" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search jobs, customers, technicians..."
          className="input-field pl-9 pr-3 py-1.5 text-xs bg-[#FFFDF2] text-[#0F0F0F] border-2 border-[#0F0F0F]"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-[#0F0F0F] hover:bg-[#F5F3E9] transition-colors relative border-2 border-transparent hover:border-[#0F0F0F]"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#D97706] border border-[#FFFDF2]" />
            )}
          </button>

          {/* Dropdown Notifications Panel */}
          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl z-50 p-4 bg-[#FFFDF2] border-2 border-[#0F0F0F]"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#0F0F0F]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0F0F0F]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="badge badge-amber text-[9px]">{unreadCount} NEW</span>
                  )}
                </div>
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] text-[#0F0F0F] hover:underline font-bold"
                >
                  Mark read
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg text-left text-xs transition-colors bg-[#F5F3E9] border border-[#0F0F0F]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#0F0F0F]">{item.title}</span>
                      <span className="text-[10px] text-[#555555]">{item.time}</span>
                    </div>
                    <p className="text-[#333333] text-[11px] leading-tight">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l-2 border-[#0F0F0F]">
          <div className="w-7 h-7 rounded-md bg-[#0F0F0F] text-[#FFFDF2] font-extrabold text-xs flex items-center justify-center">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-extrabold text-[#0F0F0F] leading-none">{user?.name}</p>
            <p className="text-[10px] text-[#333333] uppercase font-mono mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
