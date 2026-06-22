import { Router } from 'express';

const router = Router();

router.get('/get-session', async (req, res) => {
  // Return null session for now - implement auth later
  res.json({ user: null, session: null });
});

router.post('/sign-in', async (req, res) => {
  res.json({ error: 'Not implemented yet' });
});

router.post('/sign-up', async (req, res) => {
  res.json({ error: 'Not implemented yet' });
});

export default router;
