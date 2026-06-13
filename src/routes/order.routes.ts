import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';

const router = Router();

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.post('/', orderController.createOrder);
router.put('/:id/status', orderController.updateOrderStatus);
router.put('/:id/payment', orderController.updatePaymentStatus);

export default router;
