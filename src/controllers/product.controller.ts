import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', search, categoryId, isFeatured, isActive } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (search) where.name = { contains: search as string, mode: 'insensitive' };
    if (categoryId) where.categoryId = categoryId;
    if (isFeatured !== undefined) where.featured = isFeatured === 'true';
    if (isActive !== undefined) where.active = isActive === 'true';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    // Transform images string to array
    const transformedProducts = products.map(p => ({
      ...p,
      images: Array.isArray(p.images) 
        ? p.images 
        : (p.images ? p.images.split(',').map(img => img.trim()) : [])
    }));

    res.json({
      data: transformedProducts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true, active: true },
      include: { category: true },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
    const transformedProducts = products.map(p => ({
      ...p,
      images: Array.isArray(p.images) 
        ? p.images 
        : (p.images ? p.images.split(',').map(img => img.trim()) : [])
    }));
    res.json(transformedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    const transformedProducts = products.map(p => ({
      ...p,
      images: Array.isArray(p.images) 
        ? p.images 
        : (p.images ? p.images.split(',').map(img => img.trim()) : [])
    }));
    res.json(transformedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
      include: { category: true }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
      include: { category: true }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 8
    });
    const transformedProducts = products.map(p => ({
      ...p,
      images: Array.isArray(p.images) 
        ? p.images 
        : (p.images ? p.images.split(',').map(img => img.trim()) : [])
    }));
    res.json(transformedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};
