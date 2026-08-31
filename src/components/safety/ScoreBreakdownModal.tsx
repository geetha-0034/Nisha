import React from 'react';
import { X, Shield, MapPin, Clock, CheckCircle2, HelpCircle } from 'lucide-react';
import { Destination } from '../../types';

interface ScoreBreakdownModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({ destination, isOpen, onClose }) => {
  if (!isOpen || !destination) return null;

  const { scoreBreakdown } = destination;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Safety Score Calculation</h3>
              <p className="text-xs text-slate-500">{destination.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Score Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Overall Recommendation</p>
            <p className="text-2xl font-black text-slate-900">
              {destination.safetyScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
            Recommended Safer Destination
          </span>
        </div>

        {/* Factor Breakdown */}
        <div className="space-y-3.5 mb-6">
          {/* 1. Facility Type Weight */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" /> Facility Type & Security Level
              </span>
              <span>{scoreBreakdown.typeWeight} / 40 pts</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${(scoreBreakdown.typeWeight / 40) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Classified as: {destination.typeLabel}</p>
          </div>

          {/* 2. Proximity & Distance */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" /> Proximity & Quick Access
              </span>
              <span>{scoreBreakdown.distanceScore} / 30 pts</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full"
                style={{ width: `${(scoreBreakdown.distanceScore / 30) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {destination.distanceKm} km away (~{destination.etaMinutes} min brisk walk)
            </p>
          </div>

          {/* 3. Availability */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Hours & Active Staffing
              </span>
              <span>{scoreBreakdown.availabilityScore} / 20 pts</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${(scoreBreakdown.availabilityScore / 20) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {destination.isOpen24_7 ? 'Open 24/7 with active personnel' : destination.openingHours}
            </p>
          </div>

          {/* 4. Accessibility */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verification & Public Lighting
              </span>
              <span>{scoreBreakdown.accessibilityScore} / 10 pts</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${(scoreBreakdown.accessibilityScore / 10) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Direct street entrance with verified lighting</p>
          </div>
        </div>

        {/* Transparent Reasoning */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900 leading-relaxed mb-4">
          <span className="font-bold">Transparent Recommendation:</span> {destination.reason}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition"
        >
          Close Explanation
        </button>
      </div>
    </div>
  );
};
