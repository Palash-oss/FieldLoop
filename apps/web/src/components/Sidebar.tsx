import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Receipt,
  Smartphone,
  LogOut,
  Map,
  BarChart3,
  Settings,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard',       path: '/dashboard', icon: LayoutDashboard, roles: ['OWNER', 'DISPATCHER', 'ACCOUNTANT'] },
    { label: 'Job Board',       path: '/jobs',      icon: Calendar,        roles: ['OWNER', 'DISPATCHER'] },
    { label: 'Live Fleet Map',  path: '/map',       icon: Map,             roles: ['OWNER', 'DISPATCHER'] },
    { label: 'Customers',       path: '/customers', icon: Users,           roles: ['OWNER', 'DISPATCHER'] },
    { label: 'Team Members',    path: '/team',      icon: UserCheck,       roles: ['OWNER', 'DISPATCHER'] },
    { label: 'Invoices',        path: '/invoices',  icon: Receipt,         roles: ['OWNER', 'DISPATCHER', 'ACCOUNTANT'] },
    { label: 'Analytics',       path: '/reports',   icon: BarChart3,       roles: ['OWNER', 'ACCOUNTANT'] },
    { label: 'Tech Portal',     path: '/tech-portal',icon: Smartphone,     roles: ['TECHNICIAN', 'OWNER'] },
    { label: 'Settings',        path: '/settings',  icon: Settings,        roles: ['OWNER'] },
  ];

  const filtered = navItems.filter(i => user && i.roles.includes(user.role));

  return (
    <aside
      className="w-60 flex flex-col h-screen sticky top-0 shrink-0 select-none bg-[#FFFDF2] border-r-2 border-[#0F0F0F]"
    >
      {/* Brand Header */}
      <div className="px-5 h-16 flex items-center border-b-2 border-[#0F0F0F]">
        <Logo size="md" darkText={true} />
      </div>

      {/* User Info Badge */}
      <div
        className="mx-3 mt-3 mb-1 p-2.5 rounded-lg flex items-center gap-2.5 bg-[#F5F3E9] border-2 border-[#0F0F0F]"
      >
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-extrabold text-[#FFFDF2] shrink-0 bg-[#0F0F0F]"
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-extrabold text-[#0F0F0F] truncate">{user?.name}</div>
          <div className="label-ui text-[10px] text-[#D97706]">{user?.role}</div>
        </div>
      </div>

      {/* Nav Section Label */}
      <div className="px-5 pt-4 pb-1">
        <span className="label-ui text-[10px] text-[#333333]">Workspace</span>
      </div>

      {/* Navigation Links */}
      <nav className="px-2 flex-1 space-y-1 overflow-y-auto pb-4">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-100 ${
                  isActive
                    ? 'bg-[#0F0F0F] text-[#FFFDF2] border-2 border-[#0F0F0F]'
                    : 'text-[#0F0F0F] hover:bg-[#F5F3E9]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-2 border-t-2 border-[#0F0F0F]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-[#0F0F0F] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors duration-100"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
