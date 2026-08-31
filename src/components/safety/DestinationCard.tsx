import React, { useState } from 'react';
import { Shield, MapPin, Clock, Navigation2, Info, Check, Building, PhoneCall } from 'lucide-react';
import { Destination } from '../../types';
import { ScoreBreakdownModal } from './ScoreBreakdownModal';

interface DestinationCardProps {
  destination: Destination;
  isSelected?: boolean;
  onSelect: (dest: Destination) => void;
  onNavigate?: (dest: Destination) => void;
  isNavigating?: boolean;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  isSelected = false,
  onSelect,
  onNavigate,
  isNavigating = false,
}) => {
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'police':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hospital':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'security':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'institution':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  return (
    <>
      <div
        onClick={() => onSelect(destination)}
        className={`relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer border ${
          isSelected
            ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/20'
            : 'bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-xs'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full border ${getBadgeColor(
                destination.type
              )}`}
            >
              {destination.typeLabel}
            </span>
            {destination.isOpen24_7 && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700">
                24/7 Staffed
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowScoreModal(true);
              }}
              title="View transparent score calculation"
              className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-slate-900 text-white flex items-center gap-1 hover:bg-slate-800 transition"
            >
              <span>{destination.safetyScore}</span>
              <span className="text-[9px] text-slate-300 font-normal">/100</span>
              <Info className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Destination Name & Address */}
        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-1">{destination.name}</h4>
        <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{destination.address}</span>
        </p>

        {/* Distance & ETA Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-700 font-medium">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>~{destination.etaMinutes} min walk</span>
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100">
            <Navigation2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{destination.distanceKm} km</span>
          </span>
          {destination.phone && (
            <a
              href={`tel:${destination.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <PhoneCall className="w-3 h-3 text-slate-500" />
              <span className="text-[11px] font-semibold">{destination.phone.split('/')[0]}</span>
            </a>
          )}
        </div>

        {/* Facility Highlights */}
        {destination.facilities && destination.facilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {destination.facilities.slice(0, 3).map((facility, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-100 flex items-center gap-1"
              >
                <Check className="w-2.5 h-2.5 text-emerald-600" /> {facility}
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 font-medium italic">
            Recommended safer public hub
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onNavigate) {
                onNavigate(destination);
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm ${
              isSelected && isNavigating
                ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Navigation2 className="w-3.5 h-3.5" />
            <span>{isSelected && isNavigating ? 'Active Route' : 'Navigate Here'}</span>
          </button>
        </div>
      </div>

      <ScoreBreakdownModal
        destination={destination}
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
      />
    </>
  );
};
