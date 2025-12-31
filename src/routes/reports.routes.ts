import { Router } from 'express';
import * as ReportsController from '../controllers/reports.controller';

const router = Router();

router.get('/', ReportsController.getReports);
router.post('/:id/resolve', ReportsController.resolveReport);

export default router;