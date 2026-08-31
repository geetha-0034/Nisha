import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/store.js';
import { authenticateToken, generateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { User } from '../types.js';

export const authRouter = Router();

// Register new user
authRouter.post('/register', (req: Request, res: Response) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    return;
  }

  if (confirmPassword && password !== confirmPassword) {
    res.status(400).json({ error: 'Passwords do not match.' });
    return;
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    res.status(409).json({ error: 'An account with this email address already exists.' });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  const newUser: User = {
    id: userId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : '',
    passwordHash,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hasCompletedOnboarding: false,
  };

  db.createUser(newUser);
  const token = generateToken(newUser);

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: safeUser,
  });
});

// Login
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const token = generateToken(user);
  const { passwordHash: _, ...safeUser } = user;

  res.json({
    message: 'Signed in successfully',
    token,
    user: safeUser,
  });
});

// Quick Demo Login
authRouter.post('/demo-login', (_req: Request, res: Response) => {
  const demoUser = db.findUserByEmail('demo@nisha.app');
  if (!demoUser) {
    res.status(500).json({ error: 'Demo user not seeded' });
    return;
  }

  const token = generateToken(demoUser);
  const { passwordHash: _, ...safeUser } = demoUser;

  res.json({
    message: 'Logged in as Demo User',
    token,
    user: safeUser,
  });
});

// Get current user profile
authRouter.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }
  const { passwordHash: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// Update Profile
authRouter.put('/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const { name, phone, avatar } = req.body;
  const updates: Partial<User> = {};

  if (name) updates.name = name.trim();
  if (phone !== undefined) updates.phone = phone.trim();
  if (avatar !== undefined) updates.avatar = avatar;

  const updatedUser = db.updateUser(req.user.id, updates);
  if (!updatedUser) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { passwordHash: _, ...safeUser } = updatedUser;
  res.json({ message: 'Profile updated', user: safeUser });
});

// Change Password
authRouter.put('/change-password', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current password and new password are required.' });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    return;
  }

  const isMatch = bcrypt.compareSync(currentPassword, req.user.passwordHash);
  if (!isMatch) {
    res.status(400).json({ error: 'Current password does not match our records.' });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(newPassword, salt);
  db.updateUser(req.user.id, { passwordHash });

  res.json({ message: 'Password updated successfully' });
});

// Complete Onboarding
authRouter.post('/complete-onboarding', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const updatedUser = db.updateUser(req.user.id, { hasCompletedOnboarding: true });
  const { passwordHash: _, ...safeUser } = updatedUser!;
  res.json({ message: 'Onboarding completed', user: safeUser });
});

// Forgot Password (Demo flow)
authRouter.post('/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email address is required.' });
    return;
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    // For security, still return success message
    res.json({
      message: 'If an account exists with this email, reset instructions have been dispatched.',
      demoNote: 'Demo mode: Reset token simulated.',
    });
    return;
  }

  res.json({
    message: 'If an account exists with this email, reset instructions have been dispatched.',
    demoNote: 'Demo mode: In production, a secure one-time link is sent to your email. For this prototype, you can reset below.',
    resetToken: `rst_${Date.now()}`,
  });
});

// Reset Password
authRouter.post('/reset-password', (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    res.status(400).json({ error: 'Email and new password are required.' });
    return;
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(newPassword, salt);
  db.updateUser(user.id, { passwordHash });

  res.json({ message: 'Password has been reset successfully. You may now log in.' });
});
