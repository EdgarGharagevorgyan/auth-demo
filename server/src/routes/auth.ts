import { Router } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel } from '../models/User';
import { ENV } from '../config/env';
import { auth, AuthedRequest } from '../middleware/auth';
import { registerSchema, loginSchema, refreshSchema, forgotSchema, resetSchema } from '../validation/auth';
import { ZodError } from 'zod';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already in use' });

    const user = await UserModel.create({ email, password });
    return res.status(201).json({ id: user.id, email: user.email, createdAt: user.createdAt });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: err.issues });
    }
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await UserModel.findOne({ email });
    if (!user || !(await user.compare(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user.id }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES });
    const refreshToken = jwt.sign({ id: user.id }, ENV.REFRESH_SECRET, { expiresIn: ENV.REFRESH_EXPIRES });

    user.refreshToken = refreshToken;
    await user.save();

    return res.json({ token: accessToken, accessToken, refreshToken, user: { id: user.id, email: user.email } });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: err.issues });
    }
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/account', auth, async (req: AuthedRequest, res) => {
  const user = await UserModel.findById(req.userId).select('email createdAt');
  return res.json({ user });
});

router.post('/refresh', async (req, res) => {
  try {
    const { token } = refreshSchema.parse(req.body);

    const payload = jwt.verify(token, ENV.REFRESH_SECRET) as { id: string };
    const user = await UserModel.findById(payload.id);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign({ id: user.id }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES });
    const newRefresh = jwt.sign({ id: user.id }, ENV.REFRESH_SECRET, { expiresIn: ENV.REFRESH_EXPIRES });
    user.refreshToken = newRefresh;
    await user.save();

    return res.json({ accessToken, refreshToken: newRefresh });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: err.issues });
    }
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

router.post('/logout', auth, async (req: AuthedRequest, res) => {
  await UserModel.findByIdAndUpdate(req.userId, { $unset: { refreshToken: 1 } });
  return res.json({ message: 'Logged out' });
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = forgotSchema.parse(req.body);

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If user exists, reset link sent' });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetTokenHash = hash;
    user.resetTokenExp = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const devPayload: Record<string, any> = { message: 'Reset link generated' };
    if (process.env.NODE_ENV !== 'production') {
      devPayload.resetToken = rawToken;
    }

    return res.json(devPayload);
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: err.issues });
    }
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = resetSchema.parse(req.body);

    const hash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserModel.findOne({
      resetTokenHash: hash,
      resetTokenExp: { $gt: new Date() }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    user.password = newPassword; 
    user.resetTokenHash = null;
    user.resetTokenExp = null;
    await user.save();

    return res.json({ message: 'Password reset successful' });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: err.issues });
    }
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
