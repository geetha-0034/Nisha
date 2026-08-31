import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  History,
  Users,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSafety } from '../../context/SafetyContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { logout, user } = useAuth();
  const { sosActive, activeSession } = useSafety();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      to: '/safety',
      label: 'Safety Mode',
      icon: <Shield className="w-4 h-4" />,
      badge: sosActive ? 'SOS' : activeSession ? 'Active' : undefined,
      badgeColor: sosActive ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white',
    },
    { to: '/incidents', label: 'Incident History', icon: <History className="w-4 h-4" /> },
    { to: '/contacts', label: 'Trusted Contacts', icon: <Users className="w-4 h-4" /> },
    { to: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { to: '/settings', label: 'Settings & Privacy', icon: <Settings className="w-4 h-4" /> },
  ];

  const secondaryItems = [
    { to: '/help', label: 'Helplines & Safety Tips', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const content = (
    <aside className="w-64 h-full flex flex-col justify-between bg-white border-r border-slate-200/80 p-4">
      <div className="space-y-6">
        {/* Navigation Group */}
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Platform</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${item.badgeColor} animate-pulse`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Support Group */}
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Emergency</p>
          <nav className="space-y-1">
            {secondaryItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer User Info & Logout */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate leading-tight">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate leading-tight">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">{content}</div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
          <div className="relative z-10 h-full w-64">{content}</div>
        </div>
      )}
    </>
  );
};
