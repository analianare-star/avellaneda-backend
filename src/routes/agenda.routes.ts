import { Router } from 'express';
import * as AgendaController from '../controllers/agenda.controller';

const router = Router();

router.get('/:userId', AgendaController.getAgendaByUser);
router.post('/:userId/add', AgendaController.addToAgenda);
router.post('/:userId/remove', AgendaController.removeFromAgenda);

export default router;