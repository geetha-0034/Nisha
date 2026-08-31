export type DestinationType = 'police' | 'hospital' | 'security' | 'institution' | 'public_establishment';

export interface ScoreBreakdown {
  typeWeight: number;
  distanceScore: number;
  availabilityScore: number;
  accessibilityScore: number;
}

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
  scoreBreakdown: ScoreBreakdown;
  reason: string;
  verified: boolean;
  facilities: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  medicalNotes?: string;
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
  notificationMethod?: 'sms' | 'email' | 'both';
  notifyOnSOS: boolean;
  notifyOnSessionStart: boolean;
  createdAt: string;
}

export interface IncidentTimelineEvent {
  timestamp: string;
  event?: string;
  text?: string;
  type?: string;
  details?: string;
}

export interface Evidence {
  id: string;
  incidentId: string;
  userId?: string;
  type: 'image' | 'audio' | 'note';
  fileUrl?: string;
  dataBase64?: string;
  caption?: string;
  note?: string;
  capturedAt: string;
  timestamp?: string;
  latitude?: number;
  longitude?: number;
  metadata?: {
    device?: string;
    fileSize?: number;
    mimeType?: string;
    durationSeconds?: number;
  };
}

export interface Incident {
  id: string;
  userId: string;
  title?: string;
  startedAt: string;
  endedAt?: string;
  createdAt: string;
  durationMinutes?: number;
  startLatitude: number;
  startLongitude: number;
  startAddress?: string;
  destinationId?: string;
  destinationName?: string;
  destinationAddress?: string;
  destinationType?: DestinationType;
  destinationLatitude?: number;
  destinationLongitude?: number;
  sosTriggered: boolean;
  contactNotified: boolean;
  status: 'Active' | 'Completed' | 'Cancelled' | 'in_progress' | 'completed' | 'cancelled';
  timeline: IncidentTimelineEvent[];
  notes?: string;
  evidenceCount: number;
  evidence?: Evidence[];
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
  userId?: string;
  contactId?: string;
  contactName?: string;
  recipientName?: string;
  recipientAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  method?: 'sms' | 'email' | 'both';
  type: string;
  status: string;
  title?: string;
  message: string;
  timestamp: string;
  incidentId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
