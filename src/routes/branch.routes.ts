import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  const branches = await prisma.branch.findMany({ where: { active: true } });
  res.json({ data: branches });
});

router.get('/:slug', async (req, res) => {
  const branch = await prisma.branch.findUnique({ where: { slug: req.params.slug } });
  if (!branch) return res.status(404).json({ error: 'Branch not found' });
  res.json({ data: branch });
});

export default router;
