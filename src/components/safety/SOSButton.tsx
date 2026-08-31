import React, { useState, useEffect, useRef } from 'react';
import { AlertOctagon, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SOSButtonProps {
  onTrigger: () => Promise<void> | void;
  isActive?: boolean;
  size?: 'normal' | 'large' | 'compact';
  className?: string;
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  onTrigger,
  isActive = false,
  size = 'normal',
  className = '',
}) => {
  const [holding, setHolding] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [showCountdownModal, setShowCountdownModal] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(3);

  const holdTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const countdownTimerRef = useRef<any>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(holdTimerRef.current);
      clearInterval(progressIntervalRef.current);
      clearInterval(countdownTimerRef.current);
    };
  }, []);

  // Handle Press-and-Hold Start
  const startHold = () => {
    if (isActive || isTriggering) return;
    setHolding(true);
    setProgress(0);

    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds hold for deliberate trigger

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, (elapsed / duration) * 100);
      setProgress(currentPct);

      if (currentPct >= 100) {
        clearInterval(progressIntervalRef.current);
        executeSOSTrigger();
      }
    }, 40);
  };

  // Handle Press-and-Hold Cancel
  const cancelHold = () => {
    if (progress >= 100) return;
    setHolding(false);
    setProgress(0);
    clearInterval(progressIntervalRef.current);
    clearTimeout(holdTimerRef.current);
  };

  const executeSOSTrigger = async () => {
    setIsTriggering(true);
    setHolding(false);
    setShowCountdownModal(false);
    clearInterval(countdownTimerRef.current);

    try {
      await onTrigger();
    } catch (err) {
      console.error('SOS trigger error:', err);
    } finally {
      setIsTriggering(false);
      setProgress(0);
    }
  };

  // Open Quick Click Fallback with 3-Second Confirmation Countdown
  const handleClickFallback = () => {
    if (isActive) return;
    setShowCountdownModal(true);
    setCountdownSeconds(3);

    let sec = 3;
    countdownTimerRef.current = setInterval(() => {
      sec -= 1;
      setCountdownSeconds(sec);
      if (sec <= 0) {
        clearInterval(countdownTimerRef.current);
        executeSOSTrigger();
      }
    }, 1000);
  };

  const cancelCountdownModal = () => {
    clearInterval(countdownTimerRef.current);
    setShowCountdownModal(false);
    setCountdownSeconds(3);
  };

  if (isActive) {
    return (
      <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-rose-600 text-white font-bold tracking-wide shadow-lg shadow-rose-500/25 animate-pulse ${className}`}>
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <span className="text-sm uppercase tracking-wider">SOS Alert Active</span>
      </div>
    );
  }

  const isLarge = size === 'large';
  const isCompact = size === 'compact';

  return (
    <>
      <div className="relative inline-flex flex-col items-center">
        <button
          type="button"
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          onClick={(e) => {
            // If user clicked quickly without holding, provide countdown dialog
            if (progress < 50) {
              handleClickFallback();
            }
          }}
          disabled={isTriggering}
          className={`relative group select-none transition-all duration-200 active:scale-95 flex items-center justify-center font-bold tracking-wide text-white overflow-hidden rounded-full shadow-lg ${
            isLarge
              ? 'w-24 h-24 sm:w-28 sm:h-28 bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
              : isCompact
              ? 'px-4 py-2 text-xs rounded-xl bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              : 'px-6 py-3.5 text-sm rounded-2xl bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
          } ${holding ? 'ring-4 ring-rose-300 ring-offset-2 scale-95' : ''} ${className}`}
        >
          {/* Circular SVG Progress fill for hold interaction */}
          {holding && (
            <div
              className="absolute inset-0 bg-rose-950/40 pointer-events-none transition-all"
              style={{
                clipPath: `inset(${100 - progress}% 0 0 0)`,
              }}
            />
          )}

          <div className="relative z-10 flex items-center gap-2">
            <AlertOctagon className={isLarge ? 'w-8 h-8 sm:w-10 sm:h-10 text-white' : 'w-5 h-5 text-white'} />
            {!isLarge && <span className="font-extrabold tracking-wider uppercase">SOS</span>}
          </div>
        </button>

        {isLarge && (
          <span className="mt-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">
            {holding ? `Hold to activate (${Math.round(progress)}%)` : 'Hold for 3s or Tap'}
          </span>
        )}
      </div>

      {/* Confirmation Countdown Modal if clicked directly */}
      {showCountdownModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-rose-100">
            <div className="mx-auto w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4 animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Activating Emergency SOS</h3>
            <p className="text-sm text-slate-600 mb-6">
              Dispatching your emergency location and alerting trusted contacts in:
            </p>

            <div className="text-5xl font-black text-rose-600 mb-6 font-mono">{countdownSeconds}s</div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={executeSOSTrigger}
                className="w-full py-3.5 px-4 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition shadow-md shadow-rose-600/20 active:scale-98"
              >
                Send SOS Immediately
              </button>
              <button
                type="button"
                onClick={cancelCountdownModal}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
              >
                Cancel SOS
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
