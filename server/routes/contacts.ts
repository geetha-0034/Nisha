import { Router, Response } from 'express';
import { db } from '../db/store.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { TrustedContact } from '../types.js';
import { NotificationService } from '../services/notificationService.js';

export const contactsRouter = Router();

contactsRouter.use(authenticateToken);

// List user's contacts
contactsRouter.get('/', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const contacts = db.getContactsByUserId(req.user.id);
  res.json({ contacts });
});

// Create new contact
contactsRouter.post('/', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;

  const { name, phone, email, relationship, isPrimary, notificationMethod, notifyOnSOS, notifyOnSessionStart } = req.body;

  if (!name || !phone) {
    res.status(400).json({ error: 'Contact name and phone number are required.' });
    return;
  }

  const existingContacts = db.getContactsByUserId(req.user.id);
  const shouldBePrimary = isPrimary !== undefined ? isPrimary : existingContacts.length === 0;

  const newContact: TrustedContact = {
    id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    userId: req.user.id,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '',
    relationship: relationship ? relationship.trim() : 'Trusted Contact',
    isPrimary: Boolean(shouldBePrimary),
    notificationMethod: notificationMethod || 'sms',
    notifyOnSOS: notifyOnSOS !== undefined ? Boolean(notifyOnSOS) : true,
    notifyOnSessionStart: notifyOnSessionStart !== undefined ? Boolean(notifyOnSessionStart) : false,
    createdAt: new Date().toISOString(),
  };

  const created = db.createContact(newContact);
  res.status(201).json({ message: 'Trusted contact added', contact: created });
});

// Update contact
contactsRouter.put('/:id', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const { id } = req.params;

  const updated = db.updateContact(id, req.user.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Contact not found' });
    return;
  }

  res.json({ message: 'Contact updated', contact: updated });
});

// Delete contact
contactsRouter.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const { id } = req.params;

  const success = db.deleteContact(id, req.user.id);
  if (!success) {
    res.status(404).json({ error: 'Contact not found' });
    return;
  }

  res.json({ message: 'Contact removed successfully' });
});

// Send test alert to a contact
contactsRouter.post('/:id/test-alert', async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return;
  const { id } = req.params;

  const contact = db.getContactById(id, req.user.id);
  if (!contact) {
    res.status(404).json({ error: 'Contact not found' });
    return;
  }

  const log = await NotificationService.sendTestAlert(req.user.id, req.user.name, contact);

  res.json({
    message: `Test notification generated for ${contact.name}`,
    notification: log,
    disclaimer: 'Demo mode: Notification logged internally with simulated transmission payload.',
  });
});
