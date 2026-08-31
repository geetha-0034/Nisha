import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Shield, History, Users, Settings, ShieldAlert } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const MobileNav: React.FC = () => {
  const { sosActive, activeSession } = useSafety();

  const items = [
    { to: '/dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    {
      to: '/safety',
      label: 'Safety',
      icon: <Shield className="w-5 h-5" />,
      isEmergency: true,
      badge: sosActive ? 'SOS' : activeSession ? 'Active' : undefined,
    },
    { to: '/incidents', label: 'History', icon: <History className="w-5 h-5" /> },
    { to: '/contacts', label: 'Contacts', icon: <Users className="w-5 h-5" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl text-[10px] font-bold transition relative ${
                item.isEmergency && (sosActive || activeSession)
                  ? 'text-rose-600'
                  : isActive
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl transition ${isActive ? 'bg-slate-100' : ''}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="absolute top-0.5 right-1 px-1 py-0.2 text-[8px] font-black rounded-full bg-rose-600 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
