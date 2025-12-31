import { Router } from 'express';
import * as ReelsController from '../controllers/reels.controller';

const router = Router();

router.get('/', ReelsController.getActiveReels);
router.get('/admin', ReelsController.getAllReelsAdmin);
router.post('/', ReelsController.createReel);
router.post('/:id/hide', ReelsController.hideReel);
router.post('/:id/reactivate', ReelsController.reactivateReel);
router.post('/:id/view', ReelsController.registerView);

export default router;