import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  // Return empty array for now - add banners later
  res.json({ data: [] });
});

export default router;
