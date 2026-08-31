import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Shield,
  MapPin,
  Camera,
  Mic,
  Bell,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Eye,
  FileJson,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { NotificationLog } from '../types';

export const SettingsPage: React.FC = () => {
  const { locationPermission, requestLocationPermission } = useSafety();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [prefSOS, setPrefSOS] = useState<boolean>(true);
  const [prefStart, setPrefStart] = useState<boolean>(true);
  const [prefArrival, setPrefArrival] = useState<boolean>(true);

  const [showClearModal, setShowClearModal] = useState<boolean>(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.getNotificationLogs();
        setNotificationLogs(res.logs || []);
      } catch (err) {
        console.warn('Error fetching notification logs:', err);
      }
    };
    fetchLogs();
  }, []);

  const handleExportData = async () => {
    try {
      const data = await api.exportUserData();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nisha-safety-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setStatusMessage('Personal safety data exported successfully.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to export data');
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.clearIncidentHistory();
      setShowClearModal(false);
      setStatusMessage('All incident logs and evidence safely cleared.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to clear history');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.deleteAccount();
      logout();
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Failed to delete account');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Privacy, Permissions & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Device hardware authorization status, dispatch logs, and data sovereignty
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 1. Device Hardware Permissions Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Shield className="w-5 h-5 text-slate-900" />
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Hardware Permissions Auditor</h3>
            <p className="text-xs text-slate-500">NISHA operates strictly under explicit user authorization</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Location (GPS)</p>
                <p className="text-[11px] text-slate-500">
                  Used during Safety Mode to rank nearest safe hubs & alert contacts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  locationPermission === 'granted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {locationPermission === 'granted' ? 'Calibrated' : 'Needs Tap'}
              </span>
              {locationPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={requestLocationPermission}
                  className="px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Authorize
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Camera Access</p>
                <p className="text-[11px] text-slate-500">
                  Authorized strictly per-snapshot in the Evidence Preservation modal
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
              On-Demand Only
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Microphone Access</p>
                <p className="text-[11px] text-slate-500">
                  Authorized strictly when user taps &quot;Record Audio Evidence&quot;
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
              On-Demand Only
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Zero Covert Capture:</span> NISHA will never access your camera or audio in the background. All capture requires an active user click.
        </div>
      </div>

      {/* 2. Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Bell className="w-5 h-5 text-slate-900" />
          <h3 className="font-extrabold text-slate-900 text-base">Alert & Notification Dispatches</h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Emergency SOS Broadcasts</p>
              <p className="text-[11px] text-slate-500">
                Immediately send SMS & live map link to trusted contacts when SOS is triggered
              </p>
            </div>
            <input
              type="checkbox"
              checked={prefSOS}
              onChange={(e) => setPrefSOS(e.target.checked)}
              className="h-4 w-4 text-rose-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Safety Walk Departures</p>
              <p className="text-[11px] text-slate-500">
                Notify circle when you start an active night walk to a safe destination
              </p>
            </div>
            <input
              type="checkbox"
              checked={prefStart}
              onChange={(e) => setPrefStart(e.target.checked)}
              className="h-4 w-4 text-rose-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900">Safe Arrival Confirmations</p>
              <p className="text-[11px] text-slate-500">
                Send an automated reassurance message when you reach your destination
              </p>
            </div>
            <input
              type="checkbox"
              checked={prefArrival}
              onChange={(e) => setPrefArrival(e.target.checked)}
              className="h-4 w-4 text-rose-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* 3. Dispatched Notification Logs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Dispatched Notification Log</h3>
            <p className="text-xs text-slate-500">Transparent audit of all SMS/alerts sent on your behalf</p>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {notificationLogs.length} Dispatched
          </span>
        </div>

        {notificationLogs.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No alerts have been dispatched yet.</p>
        ) : (
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {notificationLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">To: {log.recipientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({log.recipientAddress})</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-slate-200 text-slate-800">
                      {log.type}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] italic leading-tight">&quot;{log.message}&quot;</p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Data Sovereignty & Account Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
          Data Sovereignty & Account Privacy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleExportData}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left space-y-1 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 group-hover:text-rose-600">
                Export Safety Data (JSON)
              </span>
              <Download className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-500">
              Download your complete incident logs, coordinates, and contact settings.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-left space-y-1 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 group-hover:text-rose-700">
                Clear Incident History
              </span>
              <Trash2 className="w-4 h-4 text-slate-500 group-hover:text-rose-600" />
            </div>
            <p className="text-[11px] text-slate-500">
              Purge all past walks and preserved evidence while retaining account credentials.
            </p>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-700">Delete NISHA Account</p>
            <p className="text-[11px] text-slate-500">Permanently erase your account and all associated records.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteAccountModal(true)}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Clear Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center">
            <h3 className="text-base font-extrabold text-slate-900 mb-2">Clear All Incident History?</h3>
            <p className="text-xs text-slate-600 mb-6">
              This will permanently delete all recorded safe-walks and evidence files.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleClearHistory}
                className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Clear History
              </button>
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center">
            <h3 className="text-base font-extrabold text-slate-900 mb-2">Delete Entire Account?</h3>
            <p className="text-xs text-slate-600 mb-6">
              This action is permanent and cannot be undone. All your contacts and incidents will be erased.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Permanently Delete Account
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteAccountModal(false)}
                className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
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
