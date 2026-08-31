import { Destination, User, TrustedContact, Incident, Evidence, SafetySession, NotificationLog } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('nisha_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
  }
  return data as T;
}

export const api = {
  // Auth API
  async register(body: { name: string; email: string; phone?: string; password: string; confirmPassword?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse<{ message: string; token: string; user: User }>(res);
  },

  async login(body: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse<{ message: string; token: string; user: User }>(res);
  },

  async demoLogin() {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<{ message: string; token: string; user: User }>(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ user: User }>(res);
  },

  async updateProfile(body: { name?: string; phone?: string; avatar?: string; medicalNotes?: string }) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<{ message: string; user: User }>(res);
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse<{ message: string }>(res);
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse<{ message: string; demoNote?: string; resetToken?: string }>(res);
  },

  async resetPassword(body: { email: string; newPassword: string; resetToken?: string }) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse<{ message: string }>(res);
  },

  async completeOnboarding() {
    const res = await fetch(`${API_BASE}/auth/complete-onboarding`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string; user: User }>(res);
  },

  // Contacts API
  async getContacts() {
    const res = await fetch(`${API_BASE}/contacts`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ contacts: TrustedContact[] }>(res);
  },

  async createContact(body: Partial<TrustedContact>) {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<{ message: string; contact: TrustedContact }>(res);
  },

  async updateContact(id: string, body: Partial<TrustedContact>) {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<{ message: string; contact: TrustedContact }>(res);
  },

  async deleteContact(id: string) {
    const res = await fetch(`${API_BASE}/contacts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  async testContactAlert(id: string) {
    const res = await fetch(`${API_BASE}/contacts/${id}/test-alert`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string; notification: NotificationLog; disclaimer: string }>(res);
  },

  // Safety API
  async getDestinations(lat: number, lng: number) {
    const res = await fetch(`${API_BASE}/safety/destinations?lat=${lat}&lng=${lng}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{
      userCoordinates: { lat: number; lng: number };
      destinations: Destination[];
      count: number;
      formulaExplanation: { title: string; formula: string; scoringRules: string[] };
    }>(res);
  },

  async getActiveSession() {
    const res = await fetch(`${API_BASE}/safety/session/active`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ session: SafetySession | null; incident: Incident | null }>(res);
  },

  async startSafetySession(body: {
    latitude: number;
    longitude: number;
    destinationId?: string;
    destinationName?: string;
    destinationType?: string;
    destinationLatitude?: number;
    destinationLongitude?: number;
    startAddress?: string;
  }) {
    const res = await fetch(`${API_BASE}/safety/session/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<{ message: string; session: SafetySession; incident: Incident; notificationsSent: number }>(res);
  },

  async updateSessionLocation(latitude: number, longitude: number) {
    const res = await fetch(`${API_BASE}/safety/session/update-location`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ latitude, longitude }),
    });
    return handleResponse<{ session: SafetySession }>(res);
  },

  async triggerSOS(body: { latitude: number; longitude: number; destinationName?: string }) {
    const res = await fetch(`${API_BASE}/safety/sos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<{
      message: string;
      session: SafetySession;
      incident: Incident;
      notificationLogs: NotificationLog[];
      disclaimer: string;
    }>(res);
  },

  async endSafetySession(body: { status?: 'Completed' | 'Cancelled'; notes?: string }) {
    const res = await fetch(`${API_BASE}/safety/session/end`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<{ message: string; incident: Incident }>(res);
  },

  // Incidents API
  async getIncidents() {
    const res = await fetch(`${API_BASE}/incidents`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ incidents: Incident[] }>(res);
  },

  async getIncident(id: string) {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ incident: Incident; evidence: Evidence[] }>(res);
  },

  async getIncidentById(id: string) {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ incident: Incident; evidence: Evidence[] }>(res);
  },

  async deleteIncident(id: string) {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  async attachEvidence(
    incidentId: string,
    body: {
      type: 'image' | 'audio' | 'note';
      dataBase64?: string;
      fileUrl?: string;
      caption?: string;
      latitude?: number;
      longitude?: number;
      metadata?: Record<string, any>;
    }
  ) {
    const res = await fetch(`${API_BASE}/incidents/${incidentId}/evidence`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<{ message: string; evidence: Evidence }>(res);
  },

  // Settings & Privacy API
  async getNotificationLogs() {
    const res = await fetch(`${API_BASE}/settings/notifications`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ logs: NotificationLog[] }>(res);
  },

  async purgeIncidentHistory() {
    const res = await fetch(`${API_BASE}/settings/purge-history`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  async clearIncidentHistory() {
    const res = await fetch(`${API_BASE}/settings/purge-history`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  async exportUserData() {
    const res = await fetch(`${API_BASE}/settings/export-data`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      // Fallback: build an export object from individual endpoints if export-data is not custom
      const [userRes, incRes, contactsRes, logsRes] = await Promise.all([
        fetch(`${API_BASE}/auth/me`, { headers: getAuthHeaders() }).then((r) => r.json()),
        fetch(`${API_BASE}/incidents`, { headers: getAuthHeaders() }).then((r) => r.json()),
        fetch(`${API_BASE}/contacts`, { headers: getAuthHeaders() }).then((r) => r.json()),
        fetch(`${API_BASE}/settings/notifications`, { headers: getAuthHeaders() }).then((r) => r.json()),
      ]);
      return {
        exportedAt: new Date().toISOString(),
        user: userRes.user,
        incidents: incRes.incidents,
        contacts: contactsRes.contacts,
        notificationLogs: logsRes.logs,
      };
    }
    return handleResponse<any>(res);
  },

  async deleteAccount() {
    const res = await fetch(`${API_BASE}/settings/account`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  getExportDataUrl() {
    const token = localStorage.getItem('nisha_auth_token') || '';
    return `${API_BASE}/settings/export?token=${encodeURIComponent(token)}`;
  },
};
