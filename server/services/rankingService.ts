import { Destination, DestinationType } from '../types.js';

// Calculate distance in KM using Haversine formula
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

// Estimate walking/transit ETA in minutes
export function calculateEtaMinutes(distanceKm: number): number {
  // Average brisk walking speed: 4.8 km/h => ~12.5 min per km
  const walkingMin = Math.ceil(distanceKm * 12.5);
  return Math.max(1, walkingMin);
}

// Calculate transparent safety score
export function computeSafetyScore(
  type: DestinationType,
  distanceKm: number,
  isOpen24_7: boolean,
  verified: boolean
): { score: number; breakdown: Destination['scoreBreakdown']; reason: string } {
  // 1. Type Weight (Max 40)
  let typeWeight = 20;
  let typeReason = 'Verified public establishment';

  switch (type) {
    case 'police':
      typeWeight = 40;
      typeReason = 'Emergency law enforcement station with active personnel';
      break;
    case 'hospital':
      typeWeight = 35;
      typeReason = 'Emergency medical facility with staffed triage & security';
      break;
    case 'security':
      typeWeight = 30;
      typeReason = 'Dedicated transit / municipal security command center';
      break;
    case 'institution':
      typeWeight = 25;
      typeReason = 'Monitored public civil building with security desk';
      break;
    case 'public_establishment':
      typeWeight = 20;
      typeReason = 'High-traffic verified 24/7 public establishment with staff';
      break;
  }

  // 2. Distance Score (Max 30)
  let distanceScore = 30;
  if (distanceKm <= 0.4) {
    distanceScore = 30;
  } else if (distanceKm <= 0.8) {
    distanceScore = 26;
  } else if (distanceKm <= 1.5) {
    distanceScore = 20;
  } else if (distanceKm <= 3.0) {
    distanceScore = 14;
  } else {
    distanceScore = Math.max(5, Math.round(30 - distanceKm * 4));
  }

  // 3. Availability Score (Max 20)
  const availabilityScore = isOpen24_7 ? 20 : 10;

  // 4. Accessibility & Verification (Max 10)
  const accessibilityScore = verified ? 10 : 6;

  const totalScore = typeWeight + distanceScore + availabilityScore + accessibilityScore;

  const reason = `Recommended because it is ${distanceKm} km away (${calculateEtaMinutes(
    distanceKm
  )} min walk), ${isOpen24_7 ? 'open 24/7' : 'currently open'}, and classified as a ${typeReason}.`;

  return {
    score: Math.min(100, totalScore),
    breakdown: {
      typeWeight,
      distanceScore,
      availabilityScore,
      accessibilityScore,
    },
    reason,
  };
}

// Generate dynamic recommended destinations synthesized around the user's specific lat/lng
export function getRecommendedDestinations(userLat: number, userLng: number): Destination[] {
  // Pre-configured templates relative to user position
  const templates = [
    {
      offsetLat: 0.0035,
      offsetLng: 0.0028,
      nameSuffix: 'Koramangala Police Station & Women Safety Post',
      type: 'police' as DestinationType,
      typeLabel: 'Police Station (Thana)',
      phone: '112 / 080-22942222',
      addressSuffix: '80 Feet Rd, 4th Block, Koramangala',
      isOpen24_7: true,
      openingHours: 'Open 24 Hours / 7 Days (Staffed)',
      verified: true,
      facilities: ['24/7 Station Duty Officer', 'Women Help Desk (1091)', 'CCTV Monitored Perimeter', 'High-Mast Streetlights'],
    },
    {
      offsetLat: -0.0042,
      offsetLng: 0.0051,
      nameSuffix: 'Apollo Hospitals 24/7 Emergency & Trauma Centre',
      type: 'hospital' as DestinationType,
      typeLabel: 'Hospital Emergency Room',
      phone: '1066 / 080-26304050',
      addressSuffix: 'Bannerghatta Main Rd / Indiranagar Ext',
      isOpen24_7: true,
      openingHours: 'Open 24 Hours Emergency Triage',
      verified: true,
      facilities: ['24/7 Staffed ER Lobby', 'Hospital Security Guards', 'Ambulance Bay', 'Protected Waiting Lounge'],
    },
    {
      offsetLat: 0.0062,
      offsetLng: -0.0038,
      nameSuffix: 'Namma Metro Station Security & Helpdesk',
      type: 'security' as DestinationType,
      typeLabel: 'Metro Transit Security Hub',
      phone: '1800-425-12345 / 080-25191091',
      addressSuffix: 'MG Road Metro Concourse',
      isOpen24_7: true,
      openingHours: 'Open with 24/7 Security Personnel',
      verified: true,
      facilities: ['Armed Security Guard', 'Emergency Assistance Button', 'High-Definition CCTV Zone', 'Women Special Helpline'],
    },
    {
      offsetLat: -0.0025,
      offsetLng: -0.0045,
      nameSuffix: 'BBMP Municipal Citizen Service & Women Resource Center',
      type: 'institution' as DestinationType,
      typeLabel: 'Public Institution Desk',
      phone: '080-22975555',
      addressSuffix: 'Corporation Complex, Residency Rd',
      isOpen24_7: false,
      openingHours: 'Open until 10:30 PM (Security Staffed)',
      verified: true,
      facilities: ['Public Helpdesk', 'Well-Lit Walkway', 'Security Guard on Duty', 'Active Footfall Zone'],
    },
    {
      offsetLat: 0.0018,
      offsetLng: -0.0022,
      nameSuffix: 'Apollo 24/7 Pharmacy & Chai Point Safe Haven',
      type: 'public_establishment' as DestinationType,
      typeLabel: 'Verified 24/7 Retail Safe Hub',
      phone: '080-24442222 / 1860-500-0101',
      addressSuffix: '100 Feet Rd, Indiranagar',
      isOpen24_7: true,
      openingHours: 'Open 24 Hours (Staffed & Monitored)',
      verified: true,
      facilities: ['24/7 Staff on Site', 'Bright Exterior Floodlights', 'Emergency Phone Access', 'Safe Indoor Seating'],
    },
  ];

  const destinations: Destination[] = templates.map((tmpl, idx) => {
    const lat = userLat + tmpl.offsetLat;
    const lng = userLng + tmpl.offsetLng;
    const distanceKm = calculateDistanceKm(userLat, userLng, lat, lng);
    const etaMinutes = calculateEtaMinutes(distanceKm);
    const { score, breakdown, reason } = computeSafetyScore(tmpl.type, distanceKm, tmpl.isOpen24_7, tmpl.verified);

    return {
      id: `dest_${tmpl.type}_${idx + 1}`,
      name: tmpl.nameSuffix,
      type: tmpl.type,
      typeLabel: tmpl.typeLabel,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      address: `${Math.floor(100 + idx * 85)} ${tmpl.addressSuffix}`,
      phone: tmpl.phone,
      isOpen24_7: tmpl.isOpen24_7,
      openingHours: tmpl.openingHours,
      distanceKm,
      etaMinutes,
      safetyScore: score,
      scoreBreakdown: breakdown,
      reason,
      verified: tmpl.verified,
      facilities: tmpl.facilities,
    };
  });

  // Sort by highest Safety Score first
  return destinations.sort((a, b) => b.safetyScore - a.safetyScore);
}
