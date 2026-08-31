import { Router, Response } from 'express';
import { db } from '../db/store.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { getRecommendedDestinations, calculateDistanceKm, calculateEtaMinutes } from '../services/rankingService.js';
import { NotificationService } from '../services/notificationService.js';
import { Incident, SafetySession } from '../types.js';

export const safetyRouter = Router();

safetyRouter.use(authenticateToken);

// Get ranked destinations based on coordinates
safetyRouter.get('/destinations', (req: AuthenticatedRequest, res: Response) => {
  const lat = parseFloat(req.query.lat as string) || 12.9716;
  const lng = parseFloat(req.query.lng as string) || 77.5946;

  const destinations = getRecommendedDestinations(lat, lng);

  res.json({
    userCoordinates: { lat, lng },
    destinations,
    count: destinations.length,
    formulaExplanation: {
      title: 'NISHA Smart Destination Scoring Engine',
      formula: 'Safety Score = Destination Type Weight (max 40) + Proximity Score (max 30) + Availability (max 20) + Verification (max 10)',
      scoringRules: [
        'Police Stations & Emergency Posts: +40 base points',
        'Hospital Emergency Rooms: +35 base points',
        'Municipal Transit Security: +30 base points',
        'Monitored Public Institutions: +25 base points',
        '24/7 Verified Retail Hubs: +20 base points',
        'Closer distances (< 0.5km) receive maximum proximity weight',
        '24/7 active staffing earns +20 availability points',
      ],
    },
  });
});

// Get active safety session
safetyRouter.get('/session/active', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const session = db.getActiveSession(req.user.id);
  let incident = null;

  if (session) {
    incident = db.getIncidentById(session.incidentId, req.user.id);
  }

  res.json({ session: session || null, incident: incident || null });
});

// Start Safety Mode Session
safetyRouter.post('/session/start', async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;

  const { latitude, longitude, destinationId, destinationName, destinationType, destinationLatitude, destinationLongitude, startAddress } = req.body;

  const lat = parseFloat(latitude) || 12.9716;
  const lng = parseFloat(longitude) || 77.5946;

  const incidentId = `INC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  const now = new Date().toISOString();

  let distanceKm = 0;
  let etaMinutes = 0;

  if (destinationLatitude && destinationLongitude) {
    distanceKm = calculateDistanceKm(lat, lng, destinationLatitude, destinationLongitude);
    etaMinutes = calculateEtaMinutes(distanceKm);
  }

  const incident: Incident = {
    id: incidentId,
    userId: req.user.id,
    startedAt: now,
    startLatitude: lat,
    startLongitude: lng,
    startAddress: startAddress || `Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    destinationId,
    destinationName,
    destinationType,
    destinationLatitude,
    destinationLongitude,
    sosTriggered: false,
    contactNotified: false,
    status: 'Active',
    evidenceCount: 0,
    timeline: [
      {
        timestamp: now,
        text: 'Safety Mode activated',
        type: 'session_start',
      },
      {
        timestamp: new Date(Date.now() + 1000).toISOString(),
        text: `GPS location acquired (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        type: 'location_detected',
      },
    ],
  };

  if (destinationName) {
    incident.timeline.push({
      timestamp: new Date(Date.now() + 2000).toISOString(),
      text: `Selected safer destination: ${destinationName} (~${distanceKm} km)`,
      type: 'destination_selected',
    });
    incident.timeline.push({
      timestamp: new Date(Date.now() + 3000).toISOString(),
      text: `Safe navigation initiated (ETA ~${etaMinutes} min)`,
      type: 'navigation_started',
    });
  }

  db.createIncident(incident);

  const session: SafetySession = {
    id: `sess_${Date.now()}`,
    userId: req.user.id,
    incidentId,
    currentLatitude: lat,
    currentLongitude: lng,
    recommendedDestination: destinationName,
    destinationType,
    destinationLatitude,
    destinationLongitude,
    distanceKm,
    estimatedMinutes: etaMinutes,
    sosActive: false,
    createdAt: now,
    updatedAt: now,
  };

  db.saveSession(session);

  // Dispatch session started notification if contacts exist and destination selected
  let notificationLogs = [];
  if (destinationName) {
    notificationLogs = await NotificationService.sendSessionStarted({
      userId: req.user.id,
      userName: req.user.name,
      latitude: lat,
      longitude: lng,
      incidentId,
      destinationName,
      etaMinutes,
    });
    if (notificationLogs.length > 0) {
      incident.contactNotified = true;
      incident.timeline.push({
        timestamp: new Date(Date.now() + 4000).toISOString(),
        text: `Alerted ${notificationLogs.length} trusted contact(s) with route details`,
        type: 'contact_notified',
      });
      db.updateIncident(incidentId, req.user.id, { contactNotified: true, timeline: incident.timeline });
    }
  }

  res.status(201).json({
    message: 'Safety session started',
    session,
    incident,
    notificationsSent: notificationLogs.length,
  });
});

// Update location during active session
safetyRouter.post('/session/update-location', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;

  const { latitude, longitude } = req.body;
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    res.status(400).json({ error: 'Valid latitude and longitude required' });
    return;
  }

  const session = db.getActiveSession(req.user.id);
  if (!session) {
    res.status(404).json({ error: 'No active safety session' });
    return;
  }

  session.currentLatitude = lat;
  session.currentLongitude = lng;

  if (session.destinationLatitude && session.destinationLongitude) {
    session.distanceKm = calculateDistanceKm(lat, lng, session.destinationLatitude, session.destinationLongitude);
    session.estimatedMinutes = calculateEtaMinutes(session.distanceKm);
  }

  db.saveSession(session);

  res.json({ session });
});

// Trigger Emergency SOS
safetyRouter.post('/sos', async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;

  const { latitude, longitude, destinationName } = req.body;
  const lat = parseFloat(latitude) || 12.9716;
  const lng = parseFloat(longitude) || 77.5946;
  const now = new Date().toISOString();

  let session = db.getActiveSession(req.user.id);
  let incident: Incident | undefined;

  if (!session) {
    // Create new incident if SOS triggered directly from dashboard
    const incidentId = `INC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    incident = {
      id: incidentId,
      userId: req.user.id,
      startedAt: now,
      startLatitude: lat,
      startLongitude: lng,
      startAddress: `Emergency SOS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      destinationName: destinationName || 'Emergency Safe Harbor',
      sosTriggered: true,
      contactNotified: true,
      status: 'Active',
      evidenceCount: 0,
      timeline: [
        {
          timestamp: now,
          text: 'EMERGENCY SOS ACTIVATED by user (Deliberate confirmation received)',
          type: 'sos_triggered',
        },
      ],
    };
    db.createIncident(incident);

    session = {
      id: `sess_${Date.now()}`,
      userId: req.user.id,
      incidentId,
      currentLatitude: lat,
      currentLongitude: lng,
      recommendedDestination: destinationName,
      sosActive: true,
      createdAt: now,
      updatedAt: now,
    };
    db.saveSession(session);
  } else {
    session.sosActive = true;
    db.saveSession(session);

    incident = db.getIncidentById(session.incidentId, req.user.id);
    if (incident) {
      incident.sosTriggered = true;
      incident.timeline.push({
        timestamp: now,
        text: 'EMERGENCY SOS ACTIVATED by user (Deliberate confirmation received)',
        type: 'sos_triggered',
      });
      db.updateIncident(incident.id, req.user.id, { sosTriggered: true, timeline: incident.timeline });
    }
  }

  // Dispatch emergency SOS notifications to contacts
  const notificationLogs = await NotificationService.sendSOSAlert({
    userId: req.user.id,
    userName: req.user.name,
    userPhone: req.user.phone,
    latitude: lat,
    longitude: lng,
    incidentId: session.incidentId,
    destinationName: session.recommendedDestination || destinationName,
  });

  if (incident && notificationLogs.length > 0) {
    incident.contactNotified = true;
    incident.timeline.push({
      timestamp: new Date().toISOString(),
      text: `Emergency alert dispatched to ${notificationLogs.length} trusted contact(s) with live coordinates`,
      type: 'contact_notified',
    });
    db.updateIncident(incident.id, req.user.id, { contactNotified: true, timeline: incident.timeline });
  }

  res.json({
    message: 'Emergency SOS activated and contacts alerted',
    session,
    incident,
    notificationLogs,
    disclaimer: 'Demo Mode: Emergency alert logged and simulated. In production, SMS/Email broadcasts occur instantly.',
  });
});

// End / Complete Safety Session
safetyRouter.post('/session/end', async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;

  const { status, notes } = req.body;
  const finalStatus = status === 'Cancelled' ? 'Cancelled' : 'Completed';
  const now = new Date().toISOString();

  const session = db.getActiveSession(req.user.id);
  if (!session) {
    res.status(404).json({ error: 'No active session found to conclude' });
    return;
  }

  const incident = db.getIncidentById(session.incidentId, req.user.id);
  if (incident) {
    incident.endedAt = now;
    incident.status = finalStatus;
    if (notes) incident.notes = notes;

    incident.timeline.push({
      timestamp: now,
      text:
        finalStatus === 'Completed'
          ? `Safety session successfully concluded. Destination reached safely.`
          : `Safety session cancelled by user.`,
      type: finalStatus === 'Completed' ? 'session_completed' : 'session_cancelled',
    });

    db.updateIncident(incident.id, req.user.id, {
      endedAt: now,
      status: finalStatus,
      notes: incident.notes,
      timeline: incident.timeline,
    });

    // Send safe arrival notification if session was completed
    if (finalStatus === 'Completed' && incident.destinationName) {
      await NotificationService.sendSafeArrival({
        userId: req.user.id,
        userName: req.user.name,
        incidentId: incident.id,
        destinationName: incident.destinationName,
      });
    }
  }

  db.clearSession(req.user.id);

  res.json({
    message: `Safety session ${finalStatus.toLowerCase()}`,
    incident,
  });
});
