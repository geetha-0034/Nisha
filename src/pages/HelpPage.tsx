import React from 'react';
import { PhoneCall, Shield, HeartPulse, MessageSquare, AlertTriangle, CheckCircle2, ArrowRight, PhoneForwarded } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HelpPage: React.FC = () => {
  const nationalHelplines = [
    {
      title: 'National Emergency (ERSS)',
      number: '112',
      badge: 'All-in-One 24/7',
      desc: 'Single unified emergency number across India for Police, Fire, and Ambulance services.',
      isPrimary: true,
    },
    {
      title: 'Women in Distress Helpline',
      number: '1091',
      badge: '24/7 Dedicated',
      desc: 'Direct nationwide women emergency assistance for immediate physical threats or harassment.',
      isPrimary: true,
    },
    {
      title: 'National Commission for Women (NCW)',
      number: '7827170170 / 181',
      badge: '24/7 Helpline',
      desc: 'Toll-free emergency helpline for women facing domestic abuse, violence, or stalking.',
      isPrimary: false,
    },
    {
      title: 'Police Control Room',
      number: '100',
      badge: 'Direct Police',
      desc: 'Direct dispatch to the nearest police patrol vehicle (PCR van) and local station.',
      isPrimary: false,
    },
    {
      title: 'Ambulance & Medical Trauma',
      number: '108 / 102',
      badge: 'Medical ER',
      desc: 'Government emergency medical response service & trauma ambulance dispatch.',
      isPrimary: false,
    },
    {
      title: 'National Cyber Crime Helpline',
      number: '1930',
      badge: 'Cyber Safety',
      desc: 'Official portal for reporting online harassment, cyber stalking, non-consensual media, or fraud.',
      isPrimary: false,
    },
  ];

  const regionalTeams = [
    {
      region: 'Bengaluru & Karnataka',
      emergency: '112 / 1091',
      specialSquad: 'Suraksha City Police App / 080-22942222',
      details: 'City Police Command Centre with active patrol dispatch and women safety kiosks.',
    },
    {
      region: 'Delhi NCR',
      emergency: '112 / 1091',
      specialSquad: 'Himmat Plus / Women Safety Desk: 011-27894455',
      details: 'Special Police Unit for Women & Children (SPUWAC) with quick QR-coded cab monitoring.',
    },
    {
      region: 'Mumbai & Maharashtra',
      emergency: '112 / 103',
      specialSquad: 'Damini Squad Patrol / 022-22633333',
      details: 'Dedicated anti-harassment squads stationed across transit hubs and metro stations.',
    },
    {
      region: 'Hyderabad & Telangana',
      emergency: '100 / 112',
      specialSquad: 'SHE Teams WhatsApp: 9490616555',
      details: 'Specialized undercover surveillance and rapid crisis response teams in public spots.',
    },
    {
      region: 'Chennai & Tamil Nadu',
      emergency: '112 / 1091',
      specialSquad: 'Kavalan SOS / Women Helpline: 181',
      details: 'Integrated GPS tracking with Tamil Nadu police emergency command center.',
    },
    {
      region: 'Kolkata & West Bengal',
      emergency: '112 / 100',
      specialSquad: 'Winners All-Women Patrol / 1090',
      details: 'Special motorized women officers patrolling college campuses and transit corridors.',
    },
  ];

  const safetyTips = [
    {
      title: 'Trust Your Intuition Early',
      desc: 'If an auto-rickshaw, cab, or unfamiliar individual makes you uncomfortable, do not rationalize. Activate NISHA Safety Mode immediately and start navigating to a verified safe hub.',
    },
    {
      title: 'Head Toward Verified Public Points',
      desc: 'Never isolate yourself in deserted dark shortcuts or unlit service roads. Local Police Stations (Thana), hospital 24/7 ERs, Metro Station security booths, and 24/7 Apollo/MedPlus pharmacies are the safest interim sanctuaries.',
    },
    {
      title: 'Share Live Route with Trusted Contacts',
      desc: 'Use NISHA’s Night-Walk tracking or hold SOS for 3 seconds to broadcast your real-time GPS coordinates directly to your family or emergency circle with one tap.',
    },
    {
      title: 'Preserve Information Deliberately',
      desc: 'From inside a secure, lighted facility, capture vehicle registration numbers, auto permits, or incident notes using NISHA’s Evidence Preservation tool for police reporting.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Emergency Helplines & Safety Directory (India)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Direct emergency hotlines, dedicated women safety squads across Indian cities, and safe navigation protocols
        </p>
      </div>

      {/* Immediate Emergency Callout */}
      <div className="p-6 rounded-3xl bg-rose-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-200" />
            <h3 className="font-black text-lg">In Immediate Danger or Harassment?</h3>
          </div>
          <p className="text-xs text-rose-100 max-w-xl">
            If you are in immediate physical danger or facing urgent threat, connect to Indian police and emergency response services right away.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="tel:112"
            className="px-5 py-3 rounded-2xl bg-white text-rose-700 font-black text-xs hover:bg-rose-50 shadow transition active:scale-95 whitespace-nowrap flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 112 (National ERSS)</span>
          </a>
          <a
            href="tel:1091"
            className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 shadow transition active:scale-95 whitespace-nowrap flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 1091 (Women Helpline)</span>
          </a>
        </div>
      </div>

      {/* National Helplines Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-slate-900" />
            <h3 className="font-extrabold text-slate-900 text-base">All-India Official Emergency Directory</h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500">24/7 Toll-Free</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nationalHelplines.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between ${
                item.isPrimary ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-slate-200/70'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-slate-900 text-white">
                    {item.badge}
                  </span>
                  <a
                    href={`tel:${item.number.split('/')[0].trim()}`}
                    className="text-rose-600 hover:text-rose-700 font-black text-sm flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{item.number}</span>
                  </a>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
              </div>

              <a
                href={`tel:${item.number.split('/')[0].trim()}`}
                className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-rose-300 text-slate-800 hover:text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <PhoneForwarded className="w-3.5 h-3.5" />
                <span>Quick Call {item.number.split('/')[0].trim()}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* State & City Specialized Teams */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Shield className="w-5 h-5 text-rose-600" />
          <h3 className="font-extrabold text-slate-900 text-base">City & State Women Safety Units (India)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regionalTeams.map((team, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center justify-between">
                <span>{team.region}</span>
                <span className="text-rose-600 font-black">{team.emergency}</span>
              </h4>
              <p className="text-[11px] font-bold text-slate-800">{team.specialSquad}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">{team.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Best Practices */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Shield className="w-5 h-5 text-slate-900" />
          <h3 className="font-extrabold text-slate-900 text-base">Indian City Navigation: Recommended Safety Protocols</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {safetyTips.map((tip, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tip.title}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick link to Safety mode */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-sm">Need active route guidance in your locality?</h4>
          <p className="text-xs text-slate-400">NISHA dynamically ranks the closest police stations, 24/7 hospital ERs, and staffed metro booths in real-time.</p>
        </div>
        <Link
          to="/safety"
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition shrink-0"
        >
          <span>Launch Safety Console</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

