import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', userId, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: true } },
          user: { select: { id: true, name: true, email: true } }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } }
      }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items, deliveryFee = 0, notes, fulfillmentType, ...deliveryInfo } = req.body;

    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const subtotal = items.reduce((sum: number, item: any) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber: `ORD-${Date.now()}`,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        notes,
        fulfillmentType,
        ...deliveryInfo,
        items: {
          create: items.map((item: any) => {
            const product = products.find(p => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product?.price || 0,
              name: product?.name || '',
              image: product?.images || ''
            };
          })
        }
      },
      include: { items: true }
    });

    await Promise.all(
      items.map((item: any) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      )
    );

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(status === 'delivered' && { deliveredAt: new Date() })
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { paymentStatus } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus,
        ...(paymentStatus === 'paid' && { paidAt: new Date() })
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};
