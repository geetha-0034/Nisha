import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  MapPin,
  Users,
  AlertOctagon,
  History,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Navigation,
  Clock,
  Radio,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';
import { SOSButton } from '../components/safety/SOSButton';
import { api } from '../services/api';
import { Incident } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    locationPermission,
    requestLocationPermission,
    startSafetyMode,
    activeSession,
    sosActive,
    triggerSOS,
    contacts,
  } = useSafety();
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    sosDispatches: 0,
    incidentsCount: 0,
    contactsCount: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dynamic greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [incRes, contactsRes] = await Promise.all([
          api.getIncidents(),
          api.getContacts(),
        ]);

        setIncidents(incRes.incidents || []);
        const total = incRes.incidents?.length || 0;
        const sos = incRes.incidents?.filter((i: Incident) => i.sosTriggered).length || 0;

        setStats({
          totalSessions: total,
          sosDispatches: sos,
          incidentsCount: total,
          contactsCount: contactsRes.contacts?.length || 0,
        });
      } catch (err) {
        console.warn('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleStartSafety = async () => {
    await startSafetyMode();
    navigate('/safety');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Your personal safety command center and live navigation monitor
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={requestLocationPermission}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              locationPermission === 'granted'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{locationPermission === 'granted' ? 'GPS Calibrated' : 'Enable Live GPS'}</span>
          </button>
        </div>
      </div>

      {/* Main Action Banner: Safety Mode Activation */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        {/* Subtle decorative background pattern */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
              <span>
                {activeSession ? 'Safety Session In Progress' : 'Instant Emergency Safe-Route'}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeSession
                  ? 'Active Safety Mode Running'
                  : 'Feeling unsafe or uneasy right now?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                {activeSession
                  ? `Currently guiding you to ${activeSession.recommendedDestination || 'verified destination'}. Your route and live GPS status are actively monitored.`
                  : 'Instantly calculate verified nearby emergency posts, hospital emergency rooms, security desks, and lighted 24/7 public hubs with one tap.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleStartSafety}
                className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 transition active:scale-95"
              >
                <Shield className="w-4 h-4" />
                <span>{activeSession ? 'Open Live Route Map' : 'ACTIVATE SAFETY MODE'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/safety"
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition"
              >
                Explore Nearby Safe Destinations
              </Link>
            </div>
          </div>

          {/* Right SOS Controller */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Emergency SOS Dispatch
            </p>
            <SOSButton onTrigger={triggerSOS} isActive={sosActive} size="large" />
            <p className="text-[11px] text-slate-400 mt-3 max-w-[200px]">
              Instantly notifies {contacts.length} trusted contact{contacts.length === 1 ? '' : 's'} with live coordinates.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Safety Walks</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.totalSessions}</p>
          <p className="text-[11px] text-slate-500 font-medium">Navigated safe sessions</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">SOS Alerts</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.sosDispatches}</p>
          <p className="text-[11px] text-slate-500 font-medium">Emergency dispatches</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Incident Logs</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <History className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.incidentsCount}</p>
          <p className="text-[11px] text-slate-500 font-medium">Documented reports</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trusted Circle</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.contactsCount}</p>
          <p className="text-[11px] text-slate-500 font-medium">Active emergency contacts</p>
        </div>
      </div>

      {/* Safety Status & Readiness Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Safety Activity Timeline */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Recent Safety Activity</h3>
              <p className="text-xs text-slate-500">Your documented journeys and safety events</p>
            </div>
            <Link
              to="/incidents"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {incidents.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Shield className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium">No recorded safety incidents yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {incidents.slice(0, 4).map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => navigate(`/incidents/${inc.id}`)}
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        inc.sosTriggered
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {inc.sosTriggered ? (
                        <AlertOctagon className="w-4 h-4" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {inc.destinationName || inc.title || 'Safe-Route Journey'}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{inc.durationMinutes ? `${inc.durationMinutes} min` : '5 min'}</span>
                        {inc.evidence && inc.evidence.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">
                              {inc.evidence.length} evidence file(s)
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      inc.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inc.status === 'in_progress'
                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Readiness & Emergency Hotlines */}
        <div className="space-y-6">
          {/* Readiness Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Safety Readiness</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      locationPermission === 'granted' ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-800">Live GPS Access</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    locationPermission === 'granted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {locationPermission === 'granted' ? 'Active' : 'Needs Tap'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      contacts.length > 0 ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-800">Emergency Contacts</span>
                </div>
                <Link
                  to="/contacts"
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 hover:bg-slate-300"
                >
                  {contacts.length} Configured
                </Link>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Evidence Vault</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Ready
                </span>
              </div>
            </div>
          </div>

          {/* Quick Helplines Box (India Emergency Directory) */}
          <div className="bg-rose-50/60 rounded-3xl p-6 border border-rose-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <span>Direct Emergency Helplines (India)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[10px] font-bold text-rose-800">
                24/7 Active
              </span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              If you are facing immediate danger or harassment, dial India emergency services directly:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:112"
                className="p-2.5 rounded-xl bg-white border border-rose-200 text-center font-bold text-xs text-rose-700 hover:bg-rose-100 transition shadow-xs flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-xs font-black text-rose-900">Call 112</span>
                <span className="text-[10px] text-slate-500 font-medium">All-in-One Emergency</span>
              </a>
              <a
                href="tel:1091"
                className="p-2.5 rounded-xl bg-white border border-rose-200 text-center font-bold text-xs text-rose-700 hover:bg-rose-100 transition shadow-xs flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-xs font-black text-rose-900">Call 1091</span>
                <span className="text-[10px] text-slate-500 font-medium">Women in Distress</span>
              </a>
              <a
                href="tel:100"
                className="p-2.5 rounded-xl bg-white border border-rose-200 text-center font-bold text-xs text-rose-700 hover:bg-rose-100 transition shadow-xs flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-xs font-black text-rose-900">Call 100</span>
                <span className="text-[10px] text-slate-500 font-medium">Police Control Room</span>
              </a>
              <a
                href="tel:181"
                className="p-2.5 rounded-xl bg-white border border-rose-200 text-center font-bold text-xs text-rose-700 hover:bg-rose-100 transition shadow-xs flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-xs font-black text-rose-900">Call 181</span>
                <span className="text-[10px] text-slate-500 font-medium">Women Helpline (NCW)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
