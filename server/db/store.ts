import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, TrustedContact, Incident, Evidence, SafetySession, NotificationLog } from '../types.js';

interface DatabaseSchema {
  users: User[];
  contacts: TrustedContact[];
  incidents: Incident[];
  evidence: Evidence[];
  sessions: SafetySession[];
  notifications: NotificationLog[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'nisha-db.json');

class DatabaseStore {
  private data: DatabaseSchema = {
    users: [],
    contacts: [],
    incidents: [],
    evidence: [],
    sessions: [],
    notifications: [],
  };

  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.seedInitialData();
        this.persist();
      }
    } catch (err) {
      console.warn('Could not load database file, creating fresh seed memory store:', err);
      this.seedInitialData();
    }

    this.isInitialized = true;
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  private seedInitialData() {
    const demoUserId = 'user_demo_001';
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('Password123!', salt);

    const demoUser: User = {
      id: demoUserId,
      name: 'Priya Sharma',
      email: 'demo@nisha.app',
      phone: '+91 98765 43210',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-08-15T18:30:00.000Z',
      updatedAt: '2026-08-31T09:00:00.000Z',
      hasCompletedOnboarding: true,
    };

    const contacts: TrustedContact[] = [
      {
        id: 'contact_001',
        userId: demoUserId,
        name: 'Aanya Patel',
        phone: '+91 98450 12345',
        email: 'aanya.patel@example.com',
        relationship: 'Sister',
        isPrimary: true,
        notificationMethod: 'both',
        notifyOnSOS: true,
        notifyOnSessionStart: true,
        createdAt: '2026-08-16T10:00:00.000Z',
      },
      {
        id: 'contact_002',
        userId: demoUserId,
        name: 'Rohan Verma',
        phone: '+91 98110 23456',
        email: 'rohan.verma@example.com',
        relationship: 'Friend',
        isPrimary: false,
        notificationMethod: 'sms',
        notifyOnSOS: true,
        notifyOnSessionStart: false,
        createdAt: '2026-08-16T10:05:00.000Z',
      },
    ];

    const incident1Id = 'INC-2026-0828-01';
    const incident2Id = 'INC-2026-0830-02';
    const incident3Id = 'INC-2026-0831-03';

    const incidents: Incident[] = [
      {
        id: incident1Id,
        userId: demoUserId,
        startedAt: '2026-08-28T22:15:00.000Z',
        endedAt: '2026-08-28T22:32:00.000Z',
        startLatitude: 12.9716,
        startLongitude: 77.5946,
        startAddress: 'MG Road & Brigade Rd, Bengaluru, KA',
        destinationId: 'dest_police_central',
        destinationName: 'Koramangala Police Station & Women Safety Post',
        destinationType: 'police',
        destinationLatitude: 12.9352,
        destinationLongitude: 77.6245,
        sosTriggered: false,
        contactNotified: true,
        status: 'Completed',
        evidenceCount: 0,
        notes: 'Walked back from metro transit station; noticed suspicious auto following slowly. Successfully navigated to the Koramangala police post entrance and met up with sister.',
        timeline: [
          { timestamp: '2026-08-28T22:15:00.000Z', text: 'Safety Mode activated by user', type: 'session_start' },
          { timestamp: '2026-08-28T22:15:15.000Z', text: 'Live GPS location calibrated (12.9716, 77.5946)', type: 'location_detected' },
          { timestamp: '2026-08-28T22:16:00.000Z', text: 'Koramangala Police Station recommended (Safety Score 94/100)', type: 'destination_selected' },
          { timestamp: '2026-08-28T22:16:30.000Z', text: 'Safe route guidance initiated (0.8 km, ~8 min ETA)', type: 'navigation_started' },
          { timestamp: '2026-08-28T22:17:00.000Z', text: 'Primary contact Aanya Patel notified of active safe route', type: 'contact_notified' },
          { timestamp: '2026-08-28T22:32:00.000Z', text: 'User arrived safely at station reception. Session concluded.', type: 'session_completed' },
        ],
      },
      {
        id: incident2Id,
        userId: demoUserId,
        startedAt: '2026-08-30T21:40:00.000Z',
        endedAt: '2026-08-30T22:05:00.000Z',
        startLatitude: 12.9784,
        startLongitude: 77.6408,
        startAddress: '100 Feet Rd, Indiranagar, Bengaluru, KA',
        destinationId: 'dest_hospital_er',
        destinationName: 'Apollo Hospitals 24/7 Emergency & Trauma Centre',
        destinationType: 'hospital',
        destinationLatitude: 12.9810,
        destinationLongitude: 77.6430,
        sosTriggered: true,
        contactNotified: true,
        status: 'Completed',
        evidenceCount: 1,
        notes: 'Emergency SOS triggered after aggressive individual blocked pathway near unlit corner. Verified hospital security staff was at the triage entrance and assisted.',
        timeline: [
          { timestamp: '2026-08-30T21:40:00.000Z', text: 'Safety Mode activated', type: 'session_start' },
          { timestamp: '2026-08-30T21:41:00.000Z', text: 'Apollo Emergency Centre selected (Open 24/7, high lighting)', type: 'destination_selected' },
          { timestamp: '2026-08-30T21:42:15.000Z', text: 'EMERGENCY SOS Triggered (3-second hold verified)', type: 'sos_triggered' },
          { timestamp: '2026-08-30T21:42:20.000Z', text: 'Emergency alert dispatched to 2 trusted contacts with live GPS link', type: 'contact_notified' },
          { timestamp: '2026-08-30T21:45:00.000Z', text: 'User captured 1 authorized photo evidence entry', type: 'evidence_attached' },
          { timestamp: '2026-08-30T22:05:00.000Z', text: 'Safely inside facility. Emergency session closed.', type: 'session_completed' },
        ],
      },
      {
        id: incident3Id,
        userId: demoUserId,
        startedAt: '2026-08-31T08:10:00.000Z',
        endedAt: '2026-08-31T08:16:00.000Z',
        startLatitude: 12.9345,
        startLongitude: 77.6189,
        startAddress: 'Koramangala 5th Block, Bengaluru, KA',
        destinationId: 'dest_lib_public',
        destinationName: 'BBMP Municipal Citizen Service & Women Resource Center',
        destinationType: 'institution',
        destinationLatitude: 12.9360,
        destinationLongitude: 77.6210,
        sosTriggered: false,
        contactNotified: false,
        status: 'Cancelled',
        evidenceCount: 0,
        notes: 'Felt uneasy about sudden rowdy group near corner; situation quickly cleared. User safely joined friends and cancelled session.',
        timeline: [
          { timestamp: '2026-08-31T08:10:00.000Z', text: 'Safety Mode preview launched', type: 'session_start' },
          { timestamp: '2026-08-31T08:16:00.000Z', text: 'User confirmed safe status and cancelled session', type: 'session_cancelled' },
        ],
      },
    ];

    const evidence: Evidence[] = [
      {
        id: 'EVD-2026-0830-01',
        incidentId: incident2Id,
        userId: demoUserId,
        type: 'image',
        fileUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
        caption: 'Street signage and surroundings along 100 Feet Rd before entering hospital triage corridor',
        capturedAt: '2026-08-30T21:45:00.000Z',
        latitude: 12.9785,
        longitude: 77.6410,
        metadata: {
          device: 'Browser Camera / WebRTC Client',
          mimeType: 'image/jpeg',
          fileSize: 248102,
        },
      },
    ];

    const notifications: NotificationLog[] = [
      {
        id: 'notif_001',
        userId: demoUserId,
        contactId: 'contact_001',
        contactName: 'Aanya Patel',
        contactPhone: '+91 98450 12345',
        contactEmail: 'aanya.patel@example.com',
        method: 'both',
        type: 'sos',
        status: 'sent_demo',
        title: 'EMERGENCY SOS: Priya Sharma triggered an alert',
        message: 'URGENT: Priya Sharma activated SOS via NISHA. Current Location: https://maps.google.com/?q=12.9784,77.6408. Headed toward Apollo Hospitals ER.',
        timestamp: '2026-08-30T21:42:20.000Z',
        incidentId: incident2Id,
        coordinates: { lat: 12.9784, lng: 77.6408 },
      },
      {
        id: 'notif_002',
        userId: demoUserId,
        contactId: 'contact_002',
        contactName: 'Rohan Verma',
        contactPhone: '+91 98110 23456',
        method: 'sms',
        type: 'sos',
        status: 'sent_demo',
        title: 'EMERGENCY SOS: Priya Sharma triggered an alert',
        message: 'URGENT: Priya Sharma activated SOS via NISHA. Current Location: https://maps.google.com/?q=12.9784,77.6408. Headed toward Apollo Hospitals ER.',
        timestamp: '2026-08-30T21:42:20.000Z',
        incidentId: incident2Id,
        coordinates: { lat: 12.9784, lng: 77.6408 },
      },
      {
        id: 'notif_003',
        userId: demoUserId,
        contactId: 'contact_001',
        contactName: 'Aanya Patel',
        contactPhone: '+91 98450 12345',
        method: 'sms',
        type: 'session_started',
        status: 'sent_demo',
        title: 'Safety Walk Started',
        message: 'Priya started a safe route to Koramangala Police Station on NISHA.',
        timestamp: '2026-08-28T22:17:00.000Z',
        incidentId: incident1Id,
        coordinates: { lat: 12.9716, lng: 77.5946 },
      },
    ];

    this.data = {
      users: [demoUser],
      contacts,
      incidents,
      evidence,
      sessions: [],
      notifications,
    };
  }

  // User Operations
  findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.users[idx];
  }

  deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u.id !== id);
    this.data.contacts = this.data.contacts.filter((c) => c.userId !== id);
    this.data.incidents = this.data.incidents.filter((i) => i.userId !== id);
    this.data.evidence = this.data.evidence.filter((e) => e.userId !== id);
    this.data.sessions = this.data.sessions.filter((s) => s.userId !== id);
    this.data.notifications = this.data.notifications.filter((n) => n.userId !== id);
    this.persist();
    return this.data.users.length < initialLen;
  }

  // Trusted Contacts Operations
  getContactsByUserId(userId: string): TrustedContact[] {
    return this.data.contacts.filter((c) => c.userId === userId);
  }

  getContactById(id: string, userId: string): TrustedContact | undefined {
    return this.data.contacts.find((c) => c.id === id && c.userId === userId);
  }

  createContact(contact: TrustedContact): TrustedContact {
    if (contact.isPrimary) {
      // Clear other primary contacts
      this.data.contacts.forEach((c) => {
        if (c.userId === contact.userId) {
          c.isPrimary = false;
        }
      });
    }
    this.data.contacts.push(contact);
    this.persist();
    return contact;
  }

  updateContact(id: string, userId: string, updates: Partial<TrustedContact>): TrustedContact | undefined {
    const idx = this.data.contacts.findIndex((c) => c.id === id && c.userId === userId);
    if (idx === -1) return undefined;

    if (updates.isPrimary) {
      this.data.contacts.forEach((c) => {
        if (c.userId === userId && c.id !== id) {
          c.isPrimary = false;
        }
      });
    }

    this.data.contacts[idx] = { ...this.data.contacts[idx], ...updates };
    this.persist();
    return this.data.contacts[idx];
  }

  deleteContact(id: string, userId: string): boolean {
    const initialLen = this.data.contacts.length;
    this.data.contacts = this.data.contacts.filter((c) => !(c.id === id && c.userId === userId));
    this.persist();
    return this.data.contacts.length < initialLen;
  }

  // Incident Operations
  getIncidentsByUserId(userId: string): Incident[] {
    return this.data.incidents
      .filter((i) => i.userId === userId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }

  getIncidentById(id: string, userId: string): Incident | undefined {
    return this.data.incidents.find((i) => i.id === id && i.userId === userId);
  }

  createIncident(incident: Incident): Incident {
    this.data.incidents.unshift(incident);
    this.persist();
    return incident;
  }

  updateIncident(id: string, userId: string, updates: Partial<Incident>): Incident | undefined {
    const idx = this.data.incidents.findIndex((i) => i.id === id && i.userId === userId);
    if (idx === -1) return undefined;

    this.data.incidents[idx] = {
      ...this.data.incidents[idx],
      ...updates,
    };
    this.persist();
    return this.data.incidents[idx];
  }

  addIncidentTimelineEvent(id: string, userId: string, event: Incident['timeline'][0]): Incident | undefined {
    const incident = this.getIncidentById(id, userId);
    if (!incident) return undefined;
    incident.timeline.push(event);
    this.persist();
    return incident;
  }

  deleteIncident(id: string, userId: string): boolean {
    const initialLen = this.data.incidents.length;
    this.data.incidents = this.data.incidents.filter((i) => !(i.id === id && i.userId === userId));
    this.data.evidence = this.data.evidence.filter((e) => !(e.incidentId === id && e.userId === userId));
    this.persist();
    return this.data.incidents.length < initialLen;
  }

  purgeIncidentsByUserId(userId: string): number {
    const count = this.data.incidents.filter((i) => i.userId === userId).length;
    this.data.incidents = this.data.incidents.filter((i) => i.userId !== userId);
    this.data.evidence = this.data.evidence.filter((e) => e.userId !== userId);
    this.data.sessions = this.data.sessions.filter((s) => s.userId !== userId);
    this.persist();
    return count;
  }

  // Evidence Operations
  getEvidenceByIncidentId(incidentId: string, userId: string): Evidence[] {
    return this.data.evidence.filter((e) => e.incidentId === incidentId && e.userId === userId);
  }

  getEvidenceById(id: string, userId: string): Evidence | undefined {
    return this.data.evidence.find((e) => e.id === id && e.userId === userId);
  }

  createEvidence(evidence: Evidence): Evidence {
    this.data.evidence.push(evidence);
    // Update incident evidence count
    const incident = this.getIncidentById(evidence.incidentId, evidence.userId);
    if (incident) {
      incident.evidenceCount = (incident.evidenceCount || 0) + 1;
      incident.timeline.push({
        timestamp: evidence.capturedAt,
        text: `Preserved authorized ${evidence.type} evidence (${evidence.id})`,
        type: 'evidence_attached',
      });
    }
    this.persist();
    return evidence;
  }

  // Safety Session Operations
  getActiveSession(userId: string): SafetySession | undefined {
    return this.data.sessions.find((s) => s.userId === userId);
  }

  saveSession(session: SafetySession): SafetySession {
    const idx = this.data.sessions.findIndex((s) => s.userId === session.userId);
    if (idx >= 0) {
      this.data.sessions[idx] = { ...session, updatedAt: new Date().toISOString() };
    } else {
      this.data.sessions.push(session);
    }
    this.persist();
    return session;
  }

  clearSession(userId: string): boolean {
    const initialLen = this.data.sessions.length;
    this.data.sessions = this.data.sessions.filter((s) => s.userId !== userId);
    this.persist();
    return this.data.sessions.length < initialLen;
  }

  // Notification Operations
  addNotificationLog(log: NotificationLog): NotificationLog {
    this.data.notifications.unshift(log);
    this.persist();
    return log;
  }

  getNotificationsByUserId(userId: string): NotificationLog[] {
    return this.data.notifications.filter((n) => n.userId === userId);
  }

  // Full Export
  exportUserData(userId: string) {
    const user = this.findUserById(userId);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return {
      user: safeUser,
      contacts: this.getContactsByUserId(userId),
      incidents: this.getIncidentsByUserId(userId),
      evidence: this.data.evidence.filter((e) => e.userId === userId),
      notifications: this.getNotificationsByUserId(userId),
      exportedAt: new Date().toISOString(),
      platform: 'NISHA Personal Safety Platform',
    };
  }
}

export const db = new DatabaseStore();
