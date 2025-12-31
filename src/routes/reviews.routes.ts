import { Router } from 'express';
import * as ReviewsController from '../controllers/reviews.controller';

const router = Router();

router.get('/:streamId', ReviewsController.getReviewsByStream);
router.post('/:streamId', ReviewsController.createReview);

export default router;