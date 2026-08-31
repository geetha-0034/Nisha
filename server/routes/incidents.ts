import { Router, Response } from 'express';
import { db } from '../db/store.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { Evidence } from '../types.js';

export const incidentsRouter = Router();

incidentsRouter.use(authenticateToken);

// Get all incidents for user
incidentsRouter.get('/', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const incidents = db.getIncidentsByUserId(req.user.id);
  res.json({ incidents });
});

// Get single incident by ID
incidentsRouter.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const { id } = req.params;

  const incident = db.getIncidentById(id, req.user.id);
  if (!incident) {
    res.status(404).json({ error: 'Incident record not found' });
    return;
  }

  const evidence = db.getEvidenceByIncidentId(id, req.user.id);

  res.json({
    incident,
    evidence,
  });
});

// Delete incident by ID
incidentsRouter.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const { id } = req.params;

  const success = db.deleteIncident(id, req.user.id);
  if (!success) {
    res.status(404).json({ error: 'Incident record not found' });
    return;
  }

  res.json({ message: 'Incident record and associated evidence deleted successfully' });
});

// Attach authorized evidence to incident
incidentsRouter.post('/:id/evidence', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const { id } = req.params;

  const incident = db.getIncidentById(id, req.user.id);
  if (!incident) {
    res.status(404).json({ error: 'Incident record not found' });
    return;
  }

  const { type, dataBase64, fileUrl, caption, latitude, longitude, metadata } = req.body;

  if (!type) {
    res.status(400).json({ error: 'Evidence type is required (image, audio, or note)' });
    return;
  }

  const evidenceId = `EVD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const evidence: Evidence = {
    id: evidenceId,
    incidentId: id,
    userId: req.user.id,
    type: type || 'image',
    dataBase64,
    fileUrl: fileUrl || dataBase64,
    caption: caption ? caption.trim() : 'Authorized emergency capture',
    capturedAt: new Date().toISOString(),
    latitude: latitude !== undefined ? parseFloat(latitude) : incident.startLatitude,
    longitude: longitude !== undefined ? parseFloat(longitude) : incident.startLongitude,
    metadata: metadata || {
      device: 'User Device Authorization Flow',
      mimeType: type === 'audio' ? 'audio/webm' : 'image/jpeg',
    },
  };

  const created = db.createEvidence(evidence);

  res.status(201).json({
    message: 'Authorized evidence attached to incident record',
    evidence: created,
  });
});
