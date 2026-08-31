import React, { useState, useEffect } from 'react';
import {
  Shield,
  MapPin,
  Navigation,
  AlertOctagon,
  Camera,
  ExternalLink,
  CheckCircle2,
  PhoneCall,
  Clock,
  Filter,
  RefreshCw,
  AlertTriangle,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { SafetyMap } from '../components/map/SafetyMap';
import { DestinationCard } from '../components/safety/DestinationCard';
import { SOSButton } from '../components/safety/SOSButton';
import { EvidenceCaptureModal } from '../components/safety/EvidenceCaptureModal';
import { Destination, DestinationType } from '../types';

export const SafetyModePage: React.FC = () => {
  const {
    coords,
    locationPermission,
    requestLocationPermission,
    destinations,
    selectedDestination,
    selectDestination,
    activeSession,
    startNavigation,
    endSafetySession,
    sosActive,
    triggerSOS,
    activeIncident,
    refreshDestinations,
    loadingDestinations,
  } = useSafety();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState<boolean>(false);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [isEnding, setIsEnding] = useState<boolean>(false);

  // Filtered list
  const filteredDestinations = destinations.filter((dest) => {
    if (activeFilter === 'all') return true;
    return dest.type === activeFilter;
  });

  const handleStartNavigationTo = async (dest: Destination) => {
    await startNavigation(dest);
  };

  const handleConfirmEndSession = async () => {
    setIsEnding(true);
    try {
      await endSafetySession(sessionNotes);
      setShowEndSessionModal(false);
      setSessionNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnding(false);
    }
  };

  const openExternalMaps = (dest: Destination) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${dest.latitude},${dest.longitude}&travelmode=walking`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-extrabold uppercase tracking-wider">
              Safety Console
            </span>
            {activeSession && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider animate-pulse">
                Navigating
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Find a Safer Destination
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time ranked safe havens within verified proximity of your GPS coordinates
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => refreshDestinations()}
            disabled={loadingDestinations}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingDestinations ? 'animate-spin' : ''}`} />
            <span>Recalculate Proximity</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEvidenceModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <Camera className="w-4 h-4 text-rose-600" />
            <span>Preserve Evidence</span>
          </button>

          <SOSButton onTrigger={triggerSOS} isActive={sosActive} size="compact" />
        </div>
      </div>

      {/* Active Navigation Floating Banner (when user is on a walk) */}
      {selectedDestination && (
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-600 text-white shrink-0 mt-0.5">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400">
                  Target Destination
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-300">
                  ~{selectedDestination.etaMinutes} min walk ({selectedDestination.distanceKm} km)
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">{selectedDestination.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">{selectedDestination.address}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => openExternalMaps(selectedDestination)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {activeSession ? (
              <button
                type="button"
                onClick={() => setShowEndSessionModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/25 transition active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Arrived Safely</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleStartNavigationTo(selectedDestination)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/25 transition active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                <span>Begin Safety Walk</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Map + Ranked List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Interactive Map Container */}
        <div className="lg:col-span-7 space-y-4">
          <div className="h-[420px] sm:h-[480px] lg:h-[540px] w-full">
            <SafetyMap
              userCoords={coords}
              destinations={filteredDestinations}
              selectedDestination={selectedDestination}
              onSelectDestination={(dest) => selectDestination(dest)}
              isNavigating={Boolean(activeSession)}
              className="h-full w-full shadow-md"
            />
          </div>

          {/* Safe Corridor Guidance Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs leading-relaxed text-slate-600">
              <span className="font-bold text-slate-900">Recommended Safe Path:</span> Stay on illuminated major thoroughfares and sidewalks. If pursued, enter any well-lit 24/7 business or police desk immediately.
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Ranked Safe Destinations */}
        <div className="lg:col-span-5 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {[
              { id: 'all', label: 'All Destinations' },
              { id: 'police', label: 'Police' },
              { id: 'hospital', label: 'Hospitals' },
              { id: 'security', label: 'Security' },
              { id: 'public_establishment', label: '24/7 Retail' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  activeFilter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Destinations Scroll List */}
          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredDestinations.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">No destinations matching this filter category.</p>
              </div>
            ) : (
              filteredDestinations.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  isSelected={selectedDestination?.id === dest.id}
                  isNavigating={Boolean(activeSession && selectedDestination?.id === dest.id)}
                  onSelect={(d) => selectDestination(d)}
                  onNavigate={(d) => handleStartNavigationTo(d)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Evidence Capture Modal */}
      <EvidenceCaptureModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        incidentId={activeIncident?.id}
      />

      {/* End Session Confirmation Modal */}
      {showEndSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 text-center mb-1">
              Have you arrived safely?
            </h3>
            <p className="text-xs text-slate-600 text-center mb-5">
              This will complete your safety journey and update your incident log.
            </p>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-bold text-slate-700">
                Optional journey notes / observations
              </label>
              <textarea
                rows={3}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="e.g. Safely entered precinct lobby, desk officer assisted."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleConfirmEndSession}
                disabled={isEnding}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-98"
              >
                {isEnding ? 'Completing Session...' : 'Confirm I am Safe'}
              </button>
              <button
                type="button"
                onClick={() => setShowEndSessionModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Keep Safety Session Active
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
