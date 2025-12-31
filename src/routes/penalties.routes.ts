import { Router } from 'express';
import * as PenaltiesController from '../controllers/penalties.controller';

const router = Router();

router.get('/', PenaltiesController.getPenalties);
router.post('/:shopId/apply', PenaltiesController.applyPenalty);
router.post('/:shopId/remove', PenaltiesController.removePenalty);

export default router;