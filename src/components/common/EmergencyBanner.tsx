import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, ShieldAlert, ArrowRight } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const EmergencyBanner: React.FC = () => {
  const { sosActive, activeSession, activeIncident } = useSafety();

  if (!sosActive && !activeSession) return null;

  if (sosActive) {
    return (
      <div className="bg-rose-600 text-white px-4 py-2.5 shadow-md sticky top-0 z-40 border-b border-rose-700 animate-pulse">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
              EMERGENCY SOS ACTIVE: Trusted contacts alerted with your live location.
            </span>
          </div>
          <Link
            to="/safety"
            className="px-3 py-1 rounded-xl bg-white text-rose-700 font-extrabold text-xs flex items-center gap-1 hover:bg-rose-50 shadow transition active:scale-95"
          >
            <span>Open Emergency Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white px-4 py-2 shadow-xs sticky top-0 z-40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          <span className="text-slate-300">
            Safety Mode Active:{' '}
            <strong className="text-white">
              {activeSession?.recommendedDestination || 'Navigating to safer destination'}
            </strong>
          </span>
        </div>
        <Link
          to="/safety"
          className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
        >
          <span>View Safe Route</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
