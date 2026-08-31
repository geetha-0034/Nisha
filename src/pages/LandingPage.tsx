import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  MapPin,
  Users,
  AlertOctagon,
  Camera,
  Navigation,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Radio,
  EyeOff,
  PhoneCall,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoAccess = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-rose-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-600/20">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 leading-none">NISHA</span>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-none mt-0.5">
                Navigate to Safety
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleDemoAccess}
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Quick Demo Access
                </button>
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold tracking-wide">
                <Radio className="w-3.5 h-3.5 animate-pulse text-rose-600" />
                <span>Personal Safety & Smart Safe-Route Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                NISHA <br />
                <span className="text-rose-600">Navigate to Safety.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                A location-aware personal safety assistant that helps you find safer destinations, navigate toward them, alert trusted contacts, and preserve emergency evidence.
              </p>

              {/* Core Idea Quote Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs max-w-xl mx-auto lg:mx-0 text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Core Mission</p>
                <p className="text-sm font-semibold text-slate-800 italic">
                  “When you feel unsafe, NISHA helps you answer: Where can I go right now to reach a safer environment?”
                </p>
              </div>

              {/* CTA Group */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/25 transition active:scale-95"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 shadow-xs transition"
                >
                  How NISHA Works
                </a>

                <button
                  type="button"
                  onClick={handleDemoAccess}
                  className="px-4 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition"
                >
                  Try Live Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Transparent Scoring
                </span>
                <span className="flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-blue-600" /> Zero Covert Tracking
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-700" /> Explicit Device Permission
                </span>
              </div>
            </div>

            {/* Right Interactive Mockup Simulation */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-200">
                {/* Mock Phone App Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-rose-600 flex items-center justify-center text-white text-xs font-black">
                      N
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">NISHA Active Safety Mode</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                    Live GPS Active
                  </span>
                </div>

                {/* Simulated Map Visual */}
                <div className="relative h-48 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden mb-4 p-3 flex flex-col justify-between">
                  {/* Map Grid Patterns */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Route Visual SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 200">
                    <path
                      d="M 60 140 Q 150 110 230 50"
                      fill="none"
                      stroke="#e11d48"
                      strokeWidth="4"
                      strokeDasharray="6 4"
                    />
                  </svg>

                  {/* Top Destination Pin */}
                  <div className="relative z-10 self-end flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-xl shadow-md text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Koramangala Police Post (0.4 km)</span>
                  </div>

                  {/* Bottom User Pin */}
                  <div className="relative z-10 self-start flex items-center gap-2 bg-white text-slate-900 px-2.5 py-1 rounded-xl shadow-md border border-slate-200 text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
                    <span>Your Current Location</span>
                  </div>
                </div>

                {/* Recommended Destination Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-blue-100 text-blue-800">
                      Police Station (Thana)
                    </span>
                    <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                      Score: 94/100
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900">Koramangala Police Station & Women Safety Post</h4>
                  <p className="text-[11px] text-slate-500">
                    Recommended: 24/7 staffed duty officer, Women Helpdesk (1091), high street lighting, ~4 min walk.
                  </p>
                </div>

                {/* Bottom Actions Mockup */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900 text-white text-center text-xs font-bold">
                    Navigate Here (~4 min)
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-600 text-white text-center text-xs font-bold">
                    SOS (Hold 3s)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step How NISHA Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold tracking-wider uppercase">
              The Safety Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">How NISHA Works</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              NISHA is structured around six deliberate stages: Detect, Recommend, Navigate, Alert, Preserve, and Review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Feel Unsafe',
                desc: 'Whenever you feel uneasy on a dark street, transit stop, or walking route, open NISHA instantly.',
                icon: <Radio className="w-5 h-5 text-rose-600" />,
              },
              {
                step: '02',
                title: 'Activate Safety Mode',
                desc: 'One prominent tap launches active GPS calibration to assess your immediate surroundings.',
                icon: <Shield className="w-5 h-5 text-blue-600" />,
              },
              {
                step: '03',
                title: 'Find a Safer Destination',
                desc: 'NISHA ranks nearby emergency posts, hospital emergency rooms, transit desks, and 24/7 public hubs.',
                icon: <MapPin className="w-5 h-5 text-emerald-600" />,
              },
              {
                step: '04',
                title: 'Navigate Step-by-Step',
                desc: 'Follow the shortest illuminated route with live distance and ETA calculations until you arrive safely.',
                icon: <Navigation className="w-5 h-5 text-indigo-600" />,
              },
              {
                step: '05',
                title: 'Alert Trusted Contacts',
                desc: 'Your emergency circle receives real-time coordinates, destination updates, and urgent SOS alerts if needed.',
                icon: <Users className="w-5 h-5 text-amber-600" />,
              },
              {
                step: '06',
                title: 'Preserve Evidence & Review',
                desc: 'Explicitly capture photo, audio, or notes tied securely to the incident timestamp for your personal records.',
                icon: <Camera className="w-5 h-5 text-rose-600" />,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-white shadow-xs border border-slate-200">{item.icon}</div>
                  <span className="text-xs font-black text-slate-400 font-mono">STEP {item.step}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Engineered for Real Safety</h2>
            <p className="text-sm text-slate-600">
              NISHA is designed as a calm, trustworthy personal assistant without fearmongering or generic cyber clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 w-fit">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Smart Destination Scoring</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Objective scoring engine incorporating facility category, 24/7 active personnel, distance, and lighting.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 w-fit">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Deliberate SOS Hold</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prevents panic mistakes via 3-second deliberate hold confirmation, immediately broadcasting live map coordinates.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 w-fit">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Trusted Contacts Hub</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage your primary safety circle with custom SMS/email preferences and instant verification testing.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 w-fit">
                <Camera className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Authorized Evidence Vault</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Store authorized snapshots, voice recordings, and notes chronologically attached to your safety incident history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explicit Privacy & Trust Statement */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-slate-100 text-slate-800">
            <Lock className="w-6 h-6 text-rose-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">Privacy & Transparency Guarantee</h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            NISHA only accesses location, camera, or microphone when you grant explicit permission. We do not perform background surveillance, we never sell location logs, and you can export or delete your personal safety history at any moment.
          </p>
          <div className="pt-2">
            <Link
              to="/privacy"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline underline-offset-4"
            >
              Read our full Privacy Policy & Ethics Standard &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-900 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-500" />
            <span className="font-bold tracking-tight">NISHA Safety Platform</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Navigate to Safety</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400 font-medium">
            <Link to="/help" className="hover:text-white transition">
              Emergency Helplines
            </Link>
            <Link to="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/login" className="hover:text-white transition">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
