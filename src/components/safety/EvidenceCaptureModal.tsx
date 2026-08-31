import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, FileText, Check, RotateCcw, AlertTriangle, ShieldCheck, X, Volume2, Square } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

interface EvidenceCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId?: string;
  onSaved?: () => void;
}

export const EvidenceCaptureModal: React.FC<EvidenceCaptureModalProps> = ({
  isOpen,
  onClose,
  incidentId,
  onSaved,
}) => {
  const { attachEvidence, coords } = useSafety();

  const [mode, setMode] = useState<'photo' | 'audio' | 'note'>('photo');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // Photo state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Audio state
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const audioTimerRef = useRef<any>(null);

  // Note state
  const [noteText, setNoteText] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Clean up media streams
  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioTimerRef.current) {
      clearInterval(audioTimerRef.current);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopMediaStream();
      setPhotoPreview(null);
      setAudioBlobUrl(null);
      setSaveSuccess(false);
      setPermissionError(null);
    }
  }, [isOpen]);

  // Request Camera Stream
  const initCamera = async () => {
    stopMediaStream();
    setPermissionError(null);
    setPhotoPreview(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device access is not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access denied or failed:', err);
      setHasPermission(false);
      setPermissionError(err.message || 'Camera permission denied or unavailable.');
    }
  };

  // Switch modes
  const handleModeChange = (newMode: 'photo' | 'audio' | 'note') => {
    stopMediaStream();
    setMode(newMode);
    setPhotoPreview(null);
    setAudioBlobUrl(null);
    setPermissionError(null);
    setHasPermission(null);
  };

  // Capture photo from video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.85);
      setPhotoPreview(base64);
      stopMediaStream();
    }
  };

  // Start Audio Recording
  const startAudioRecording = async () => {
    stopMediaStream();
    audioChunksRef.current = [];
    setAudioBlobUrl(null);
    setRecordingDuration(0);
    setPermissionError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioBlobUrl(reader.result as string);
        };
      };

      recorder.start();
      setIsRecordingAudio(true);

      audioTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone permission denied:', err);
      setHasPermission(false);
      setPermissionError('Microphone permission denied or unavailable.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
      stopMediaStream();
    }
  };

  // Save evidence
  const handleSaveEvidence = async () => {
    setIsSaving(true);
    try {
      if (mode === 'photo' && photoPreview) {
        await attachEvidence('image', photoPreview, caption || 'Authorized photo capture');
      } else if (mode === 'audio' && audioBlobUrl) {
        await attachEvidence('audio', audioBlobUrl, caption || 'Authorized audio recording');
      } else if (mode === 'note' && noteText) {
        await attachEvidence('note', undefined, noteText);
      }

      setSaveSuccess(true);
      if (onSaved) onSaved();

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setPermissionError(err.message || 'Failed to save evidence to incident');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Preserve Emergency Evidence</h3>
              <p className="text-xs text-slate-500">Incident #{incidentId || 'ACTIVE-SESSION'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explicit Authorization Banner */}
        <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Explicit Authorization:</span> NISHA only accesses your camera or microphone with your explicit tap. No covert recording is performed.
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleModeChange('photo')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              mode === 'photo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" /> Camera
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('audio')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              mode === 'audio' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-4 h-4" /> Audio
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('note')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              mode === 'note' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" /> Text Note
          </button>
        </div>

        {/* Content By Mode */}
        {mode === 'photo' && (
          <div className="space-y-4">
            {!photoPreview ? (
              <div className="relative rounded-2xl bg-slate-900 overflow-hidden aspect-video flex flex-col items-center justify-center text-white">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${!hasPermission ? 'hidden' : ''}`}
                />
                {!hasPermission && (
                  <div className="text-center p-6 space-y-3">
                    <Camera className="w-10 h-10 mx-auto text-slate-400" />
                    <p className="text-sm text-slate-300 font-medium">Camera access required to capture emergency photo</p>
                    <button
                      type="button"
                      onClick={initCamera}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow"
                    >
                      Authorize & Open Camera
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200">
                  <img src={photoPreview} alt="Captured Evidence" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={initCamera}
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Retake Photo
                  </button>
                </div>
              </div>
            )}

            {hasPermission && !photoPreview && (
              <button
                type="button"
                onClick={capturePhoto}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-600/20"
              >
                <Camera className="w-5 h-5" /> Snap Photo Evidence
              </button>
            )}
          </div>
        )}

        {mode === 'audio' && (
          <div className="space-y-4 py-4 text-center">
            {!isRecordingAudio && !audioBlobUrl && (
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                <Mic className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-medium text-slate-700">Record ambient audio or verbal statement</p>
                <button
                  type="button"
                  onClick={startAudioRecording}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow"
                >
                  Start Audio Recording
                </button>
              </div>
            )}

            {isRecordingAudio && (
              <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-center gap-2 text-rose-600 font-bold animate-pulse">
                  <span className="w-3 h-3 rounded-full bg-rose-600"></span>
                  <span>RECORDING AUDIO ({recordingDuration}s)</span>
                </div>
                <button
                  type="button"
                  onClick={stopAudioRecording}
                  className="px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-md"
                >
                  <Square className="w-4 h-4 fill-white" /> Stop & Save Clip
                </button>
              </div>
            )}

            {audioBlobUrl && !isRecordingAudio && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-emerald-600" /> Recorded Audio Clip ({recordingDuration}s)
                  </span>
                  <button
                    type="button"
                    onClick={startAudioRecording}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Re-record
                  </button>
                </div>
                <audio src={audioBlobUrl} controls className="w-full h-10" />
              </div>
            )}
          </div>
        )}

        {mode === 'note' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">Detailed Incident Note</label>
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Describe vehicles, individuals, license plates, physical descriptions, or surrounding landmarks..."
              className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
            />
          </div>
        )}

        {/* Optional Caption Field for Photo/Audio */}
        {(photoPreview || audioBlobUrl) && (
          <div className="mt-3">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add optional caption / context (e.g. Blue sedan parked outside)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
        )}

        {/* Error / Feedback */}
        {permissionError && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {permissionError}
          </div>
        )}

        {/* Save Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveEvidence}
            disabled={isSaving || (!photoPreview && !audioBlobUrl && !noteText)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white flex items-center gap-2 shadow-md transition ${
              saveSuccess
                ? 'bg-emerald-600'
                : !photoPreview && !audioBlobUrl && !noteText
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" /> Evidence Preserved
              </>
            ) : isSaving ? (
              'Saving to Incident...'
            ) : (
              'Attach & Preserve Evidence'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
