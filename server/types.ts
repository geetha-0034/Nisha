export type DestinationType = 'police' | 'hospital' | 'security' | 'institution' | 'public_establishment';

export interface Destination {
  id: string;
  name: string;
  type: DestinationType;
  typeLabel: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  isOpen24_7: boolean;
  openingHours: string;
  distanceKm: number;
  etaMinutes: number;
  safetyScore: number;
  scoreBreakdown: {
    typeWeight: number; // e.g., max 40
    distanceScore: number; // e.g., max 30
    availabilityScore: number; // e.g., max 20
    accessibilityScore: number; // e.g., max 10
  };
  reason: string;
  verified: boolean;
  facilities: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  hasCompletedOnboarding?: boolean;
}

export interface TrustedContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  isPrimary: boolean;
  notificationMethod: 'sms' | 'email' | 'both';
  notifyOnSOS: boolean;
  notifyOnSessionStart: boolean;
  createdAt: string;
}

export interface IncidentTimelineEvent {
  timestamp: string;
  text: string;
  type: 'session_start' | 'location_detected' | 'destination_selected' | 'navigation_started' | 'sos_triggered' | 'contact_notified' | 'evidence_attached' | 'session_completed' | 'session_cancelled';
  details?: string;
}

export interface Incident {
  id: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  startLatitude: number;
  startLongitude: number;
  startAddress?: string;
  destinationId?: string;
  destinationName?: string;
  destinationType?: DestinationType;
  destinationLatitude?: number;
  destinationLongitude?: number;
  sosTriggered: boolean;
  contactNotified: boolean;
  status: 'Active' | 'Completed' | 'Cancelled';
  timeline: IncidentTimelineEvent[];
  notes?: string;
  evidenceCount: number;
}

export interface Evidence {
  id: string;
  incidentId: string;
  userId: string;
  type: 'image' | 'audio' | 'note';
  fileUrl?: string;
  dataBase64?: string;
  caption?: string;
  capturedAt: string;
  latitude?: number;
  longitude?: number;
  metadata?: {
    device?: string;
    fileSize?: number;
    mimeType?: string;
    durationSeconds?: number;
  };
}

export interface SafetySession {
  id: string;
  userId: string;
  incidentId: string;
  currentLatitude: number;
  currentLongitude: number;
  recommendedDestination?: string;
  destinationType?: DestinationType;
  destinationLatitude?: number;
  destinationLongitude?: number;
  distanceKm?: number;
  estimatedMinutes?: number;
  sosActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationLog {
  id: string;
  userId: string;
  contactId?: string;
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  method: 'sms' | 'email' | 'both';
  type: 'sos' | 'safe_arrival' | 'session_started' | 'test';
  status: 'sent_demo' | 'sent_live' | 'failed';
  title: string;
  message: string;
  timestamp: string;
  incidentId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
