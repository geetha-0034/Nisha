import React, { useState } from 'react';
import { Shield, MapPin, Users, AlertOctagon, Camera, ChevronRight, Check, X } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.completeOnboarding();
      updateUser(res.user);
    } catch (err) {
      console.warn('Could not mark onboarding on server:', err);
    } finally {
      setIsSubmitting(false);
      onComplete();
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Welcome to NISHA',
      subtitle: 'Navigate to Safety.',
      icon: <Shield className="w-8 h-8 text-rose-600" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            When you feel unsafe or uneasy, NISHA provides one clear answer:
            <span className="block mt-1 font-bold text-slate-900 italic">
              “Where can I go right now to reach a safer environment?”
            </span>
          </p>
          <p>
            NISHA guides you to verified nearby emergency stations, hospital triage lobbies, security posts, and 24/7 public hubs while keeping your trusted circle alerted.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Location-Aware Safety Routes',
      subtitle: 'Finding nearby verified safe hubs',
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            NISHA calculates transparent safety scores based on proximity, facility type, 24/7 staffing, and street lighting.
          </p>
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900">
            <span className="font-bold">Privacy First:</span> Your location is only processed when you activate Safety Mode. We do not track your daily movements or log background location.
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Trusted Circle Alerts',
      subtitle: 'Instant alerts when safety walks begin',
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            Add family members or close friends as trusted contacts. When you trigger an emergency or start a night walk, NISHA automatically sends real-time coordinates and destination updates.
          </p>
          <p className="text-xs text-slate-500">
            You can manage, edit, or test your trusted contacts at any time from the Contacts tab.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Deliberate SOS Protection',
      subtitle: 'Engineered against accidental triggers',
      icon: <AlertOctagon className="w-8 h-8 text-rose-600" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            Emergency SOS uses a <strong className="text-slate-900">3-second hold or confirmation countdown</strong> so you never trigger an emergency dispatch by accident.
          </p>
          <p>
            Once activated, an emergency broadcast with your live map link is dispatched to your trusted contacts, and emergency helpline options are presented immediately.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Explicit Evidence Preservation',
      subtitle: 'User-authorized emergency records',
      icon: <Camera className="w-8 h-8 text-amber-600" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            You can capture photo, audio, or notes attached to any safety session for your personal records.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-2xl text-xs text-amber-900">
            <span className="font-bold">No Covert Surveillance:</span> NISHA never accesses your device camera or microphone without your explicit tap. You remain in complete control.
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
        {/* Step Progress indicators */}
        <div className="flex items-center justify-between gap-1 mb-6">
          <div className="flex items-center gap-1.5 flex-1">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.id === step ? 'w-8 bg-rose-600' : s.id < step ? 'w-4 bg-slate-900' : 'w-4 bg-slate-200'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleFinish}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
          >
            Skip Intro
          </button>
        </div>

        {/* Step Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 shrink-0">
            {currentStepData.icon}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-xl leading-snug">{currentStepData.title}</h3>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">{currentStepData.subtitle}</p>
          </div>
        </div>

        {/* Step Body */}
        <div className="mb-8 min-h-[140px]">{currentStepData.content}</div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < steps.length ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Finalizing...' : 'Get Started with NISHA'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
