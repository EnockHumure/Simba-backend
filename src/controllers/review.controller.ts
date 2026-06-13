import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId as string;
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true, image: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    const review = await prisma.review.create({
      data: { userId, productId, rating, comment },
      include: { user: { select: { id: true, name: true, image: true } } }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.review.delete({ where: { id } });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
