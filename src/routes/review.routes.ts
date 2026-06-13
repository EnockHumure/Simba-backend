import { Router } from 'express';
import * as reviewController from '../controllers/review.controller.js';

const router = Router();

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/', reviewController.createReview);
router.delete('/:id', reviewController.deleteReview);

export default router;
