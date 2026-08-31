import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  AlertOctagon,
  Navigation,
  Clock,
  MapPin,
  Camera,
  ChevronRight,
  Shield,
  FileText,
} from 'lucide-react';
import { api } from '../services/api';
import { Incident } from '../types';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncidents = async () => {
      setIsLoading(true);
      try {
        const res = await api.getIncidents();
        setIncidents(res.incidents || []);
      } catch (err) {
        console.warn('Error fetching incidents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      (inc.destinationName && inc.destinationName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inc.title && inc.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inc.notes && inc.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'sos' ? inc.sosTriggered : inc.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Incident History & Safety Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Secure, user-authorized record of your safe-route walks, SOS dispatches, and evidence
          </p>
        </div>

        <Link
          to="/safety"
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition active:scale-95 w-fit"
        >
          <Navigation className="w-4 h-4" />
          <span>New Safety Walk</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative w-full md:flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by destination name, keywords, notes..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs font-bold no-scrollbar">
          {[
            { id: 'all', label: 'All Logs' },
            { id: 'completed', label: 'Completed' },
            { id: 'sos', label: 'SOS Alerted' },
            { id: 'in_progress', label: 'Active' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <p className="text-xs font-bold animate-pulse">Loading safety incident records...</p>
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <History className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="font-extrabold text-slate-800 text-base">No Matching Safety Incidents</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try changing your search term or filter status.'
              : 'You have no safety incidents recorded in your account yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => navigate(`/incidents/${incident.id}`)}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl shrink-0 ${
                    incident.sosTriggered
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {incident.sosTriggered ? (
                    <AlertOctagon className="w-5 h-5" />
                  ) : (
                    <Navigation className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {incident.destinationName || incident.title || 'Safe-Route Journey'}
                    </h3>
                    {incident.sosTriggered && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-600 text-white uppercase tracking-wider">
                        SOS Dispatched
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        incident.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : incident.status === 'in_progress'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {incident.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(incident.createdAt).toLocaleDateString()} at{' '}
                      {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {incident.durationMinutes && (
                      <span>• ~{incident.durationMinutes} min walk</span>
                    )}
                    {incident.evidence && incident.evidence.length > 0 && (
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <Camera className="w-3.5 h-3.5" />
                        {incident.evidence.length} evidence file(s)
                      </span>
                    )}
                  </p>

                  {incident.notes && (
                    <p className="text-xs text-slate-600 italic line-clamp-1 mt-1">
                      &quot;{incident.notes}&quot;
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1">
                  View Full Report <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
