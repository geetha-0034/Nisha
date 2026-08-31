import React from 'react';
import { Shield, Lock, EyeOff, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to NISHA Home
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Privacy Policy & Ethical Security Standard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last updated: August 2026 • Our ironclad commitment to user consent and data sovereignty
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        {/* Core summary pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <EyeOff className="w-6 h-6 text-rose-600" />
            <h4 className="font-extrabold text-xs text-slate-900">Zero Covert Surveillance</h4>
            <p className="text-xs text-slate-600">
              No hidden audio recording or background camera capture. Camera and mic are accessed strictly upon an explicit tap.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <Lock className="w-6 h-6 text-blue-600" />
            <h4 className="font-extrabold text-xs text-slate-900">No Location Brokering</h4>
            <p className="text-xs text-slate-600">
              We never monetize, sell, or advertise against your location logs. Coordinates are used solely for real-time safety routing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <h4 className="font-extrabold text-xs text-slate-900">Complete Data Sovereignty</h4>
            <p className="text-xs text-slate-600">
              Export your full incident records as JSON at any time or purge your historical logs with one click in Settings.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900">1. Information We Collect</h3>
          <p>
            When you register for NISHA, we collect your name, email, and optional phone number. During an active Safety Mode session, we query your device geolocation to calculate nearby verified public shelters, police posts, and lighted facilities.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900">2. Emergency Dispatch & Trusted Contacts</h3>
          <p>
            If you trigger an Emergency SOS or start an active night walk, NISHA dispatches simulated alerts and live coordinates directly to the contacts you explicitly designate. You retain full control to add, edit, or delete contacts at any moment.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900">3. Device Permissions Policy</h3>
          <p>
            NISHA requests standard browser permissions with transparent explanations. In compliance with security standards:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Geolocation:</strong> Only requested during active navigation queries and SOS dispatches.</li>
            <li><strong>Camera & Microphone:</strong> Only enabled while the Evidence Preservation modal is open.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900">4. Data Deletion & Export</h3>
          <p>
            Under GDPR and CCPA principles, you have the right to erase all incident history or delete your entire account permanently from the Settings page.
          </p>
        </div>
      </div>
    </div>
  );
};
