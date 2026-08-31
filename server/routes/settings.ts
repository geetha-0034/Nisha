import { Router, Response } from 'express';
import { db } from '../db/store.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

export const settingsRouter = Router();

settingsRouter.use(authenticateToken);

// Get notification logs
settingsRouter.get('/notifications', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const logs = db.getNotificationsByUserId(req.user.id);
  res.json({ logs });
});

// Export personal data
settingsRouter.get('/export', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const exportData = db.exportUserData(req.user.id);
  if (!exportData) {
    res.status(404).json({ error: 'User data not found' });
    return;
  }
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=nisha-safety-export-${req.user.id}.json`);
  res.json(exportData);
});

// Purge incident history
settingsRouter.post('/purge-history', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const count = db.purgeIncidentsByUserId(req.user.id);
  res.json({ message: `Successfully purged ${count} incident record(s) and associated evidence.` });
});

// Delete user account
settingsRouter.delete('/account', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const success = db.deleteUser(req.user.id);
  if (!success) {
    res.status(404).json({ error: 'Failed to delete user account' });
    return;
  }
  res.json({ message: 'User account and all associated personal safety data deleted permanently.' });
});
