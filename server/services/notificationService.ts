import { db } from '../db/store.js';
import { TrustedContact, NotificationLog } from '../types.js';

export interface DispatchSOSParams {
  userId: string;
  userName: string;
  userPhone?: string;
  latitude: number;
  longitude: number;
  incidentId: string;
  destinationName?: string;
}

export interface DispatchSessionStartParams {
  userId: string;
  userName: string;
  latitude: number;
  longitude: number;
  incidentId: string;
  destinationName: string;
  etaMinutes?: number;
}

export interface DispatchSafeArrivalParams {
  userId: string;
  userName: string;
  incidentId: string;
  destinationName: string;
}

export class NotificationService {
  /**
   * Dispatch Emergency SOS Alert to all eligible trusted contacts
   */
  static async sendSOSAlert(params: DispatchSOSParams): Promise<NotificationLog[]> {
    const contacts = db.getContactsByUserId(params.userId).filter((c) => c.notifyOnSOS !== false);
    const logs: NotificationLog[] = [];
    const mapsLink = `https://maps.google.com/?q=${params.latitude},${params.longitude}`;
    const timestamp = new Date().toISOString();

    for (const contact of contacts) {
      const message = `🚨 EMERGENCY ALERT via NISHA: ${params.userName} has triggered an SOS alert.
Current Location: ${mapsLink} (Lat: ${params.latitude.toFixed(4)}, Lng: ${params.longitude.toFixed(4)})
${params.destinationName ? `Navigating toward: ${params.destinationName}` : 'Seeking safer location'}
Incident ID: #${params.incidentId}
Timestamp: ${new Date().toLocaleTimeString()}
Please check in immediately.`;

      const log: NotificationLog = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId: params.userId,
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phone,
        contactEmail: contact.email,
        method: contact.notificationMethod,
        type: 'sos',
        status: 'sent_demo', // Clearly marks demo notification mode
        title: `EMERGENCY SOS: ${params.userName} needs assistance`,
        message,
        timestamp,
        incidentId: params.incidentId,
        coordinates: {
          lat: params.latitude,
          lng: params.longitude,
        },
      };

      db.addNotificationLog(log);
      logs.push(log);
    }

    return logs;
  }

  /**
   * Dispatch notification when a safe walk/session starts
   */
  static async sendSessionStarted(params: DispatchSessionStartParams): Promise<NotificationLog[]> {
    const contacts = db
      .getContactsByUserId(params.userId)
      .filter((c) => c.notifyOnSessionStart === true || c.isPrimary);

    const logs: NotificationLog[] = [];
    const mapsLink = `https://maps.google.com/?q=${params.latitude},${params.longitude}`;
    const timestamp = new Date().toISOString();

    for (const contact of contacts) {
      const message = `🛡️ NISHA Safety Walk: ${params.userName} activated a safe route to ${params.destinationName}${
        params.etaMinutes ? ` (~${params.etaMinutes} min away)` : ''
      }.
Start Location: ${mapsLink}`;

      const log: NotificationLog = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId: params.userId,
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phone,
        contactEmail: contact.email,
        method: contact.notificationMethod,
        type: 'session_started',
        status: 'sent_demo',
        title: `Safety Route: ${params.userName} is heading to ${params.destinationName}`,
        message,
        timestamp,
        incidentId: params.incidentId,
        coordinates: {
          lat: params.latitude,
          lng: params.longitude,
        },
      };

      db.addNotificationLog(log);
      logs.push(log);
    }

    return logs;
  }

  /**
   * Dispatch safe arrival confirmation
   */
  static async sendSafeArrival(params: DispatchSafeArrivalParams): Promise<NotificationLog[]> {
    const contacts = db.getContactsByUserId(params.userId).filter((c) => c.isPrimary || c.notifyOnSOS);
    const logs: NotificationLog[] = [];
    const timestamp = new Date().toISOString();

    for (const contact of contacts) {
      const message = `✅ NISHA Update: ${params.userName} has safely arrived at ${params.destinationName} and completed their safety session.`;

      const log: NotificationLog = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId: params.userId,
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phone,
        contactEmail: contact.email,
        method: contact.notificationMethod,
        type: 'safe_arrival',
        status: 'sent_demo',
        title: `Safe Arrival: ${params.userName} is safe`,
        message,
        timestamp,
        incidentId: params.incidentId,
      };

      db.addNotificationLog(log);
      logs.push(log);
    }

    return logs;
  }

  /**
   * Test notification for a single contact
   */
  static async sendTestAlert(userId: string, userName: string, contact: TrustedContact): Promise<NotificationLog> {
    const timestamp = new Date().toISOString();
    const message = `🔔 NISHA Contact Verification: This is a test alert from ${userName} confirming that ${contact.name} is set up as a trusted safety contact.`;

    const log: NotificationLog = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      contactId: contact.id,
      contactName: contact.name,
      contactPhone: contact.phone,
      contactEmail: contact.email,
      method: contact.notificationMethod,
      type: 'test',
      status: 'sent_demo',
      title: `Test Verification Alert for ${contact.name}`,
      message,
      timestamp,
    };

    db.addNotificationLog(log);
    return log;
  }
}
