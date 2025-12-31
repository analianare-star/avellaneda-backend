import { Router } from 'express';
import * as StreamsController from '../controllers/streams.controller';

const router = Router();

router.get('/', StreamsController.getStreams);
router.get('/:id', StreamsController.getStreamById);
router.post('/', StreamsController.createStream);
router.put('/:id', StreamsController.updateStream);
router.delete('/:id', StreamsController.deleteStream);
router.post('/:id/live', StreamsController.goLive);
router.post('/:id/continue', StreamsController.continueLive);
router.post('/:id/finish', StreamsController.finishStream);
router.post('/:id/report', StreamsController.reportStream);
router.post('/:id/rate', StreamsController.rateStream);
router.post('/:id/hide', StreamsController.hideStream);
router.post('/:id/show', StreamsController.showStream);
router.post('/:id/cancel', StreamsController.cancelStream);
router.post('/:id/ban', StreamsController.banStream);

export default router;
