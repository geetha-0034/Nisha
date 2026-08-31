import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  AlertOctagon,
  Shield,
  Camera,
  Trash2,
  CheckCircle2,
  FileText,
  Volume2,
  Radio,
  Share2,
} from 'lucide-react';
import { api } from '../services/api';
import { Incident } from '../types';
import { EvidenceCaptureModal } from '../components/safety/EvidenceCaptureModal';
import { SafetyMap } from '../components/map/SafetyMap';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchIncident = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await api.getIncidentById(id);
      setIncident(res.incident);
    } catch (err: any) {
      setError(err.message || 'Could not load incident details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await api.deleteIncident(id);
      navigate('/incidents');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p className="text-xs font-bold animate-pulse">Loading safety incident report #{id}...</p>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-md mx-auto space-y-4">
        <AlertOctagon className="w-10 h-10 mx-auto text-rose-500" />
        <h3 className="font-bold text-slate-900">Incident Not Found</h3>
        <p className="text-xs text-slate-500">{error || 'This incident record may have been deleted.'}</p>
        <Link
          to="/incidents"
          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Incidents
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/incidents"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowEvidenceModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <Camera className="w-4 h-4 text-rose-600" />
            <span>Attach Evidence</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Log</span>
          </button>
        </div>
      </div>

      {/* Main Incident Overview Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-400">ID: {incident.id}</span>
              {incident.sosTriggered && (
                <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-rose-600 text-white uppercase tracking-wider">
                  SOS Dispatched
                </span>
              )}
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {incident.destinationName || incident.title || 'Safe-Route Journey'}
            </h1>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <p className="text-xs font-bold text-slate-900 flex items-center sm:justify-end gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {new Date(incident.createdAt).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <p className="text-xs text-slate-500 flex items-center sm:justify-end gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Started at {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Target Destination</p>
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {incident.destinationName || 'Nearest Safe Haven'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 truncate">{incident.destinationAddress || 'Verified Public Hub'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Trip Duration</p>
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {incident.durationMinutes ? `${incident.durationMinutes} Minutes Walk` : 'Completed Safely'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Live GPS Tracking Active</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Preserved Evidence</p>
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {incident.evidence?.length || 0} Attached File(s)
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Explicitly authorized</p>
          </div>
        </div>

        {/* Incident User Notes */}
        {incident.notes && (
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
            <span className="font-bold">Incident Log Notes:</span> {incident.notes}
          </div>
        )}
      </div>

      {/* Preserved Evidence Gallery */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Preserved Evidence Vault</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowEvidenceModal(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700"
          >
            + Add New File
          </button>
        </div>

        {!incident.evidence || incident.evidence.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-2">
            <Camera className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-medium">No photos, audio, or notes were attached to this session.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {incident.evidence.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                    {item.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {item.type === 'image' && item.fileUrl && (
                  <div className="rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-200">
                    <img src={item.fileUrl} alt="Evidence snapshot" className="w-full h-full object-cover" />
                  </div>
                )}

                {item.type === 'audio' && item.fileUrl && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      <span>Audio Recording</span>
                    </div>
                    <audio src={item.fileUrl} controls className="w-full h-8" />
                  </div>
                )}

                {item.note && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <FileText className="w-3.5 h-3.5 text-slate-400 mb-1" />
                    {item.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chronological Event Audit Timeline */}
      {incident.timeline && incident.timeline.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Chronological Activity Audit</h3>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {incident.timeline.map((event, idx) => (
              <div key={idx} className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-white shadow-xs"></span>
                <div>
                  <p className="text-xs font-bold text-slate-900">{event.event}</p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Capture Modal */}
      <EvidenceCaptureModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        incidentId={incident.id}
        onSaved={fetchIncident}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-200 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 mb-1">Delete Incident Record?</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              This will permanently remove this safety journey and attached evidence files from your personal vault.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition active:scale-98"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
