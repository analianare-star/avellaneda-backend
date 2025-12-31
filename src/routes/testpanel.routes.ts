import { Router } from 'express';
import * as TestPanelController from '../controllers/testpanel.controller';

const router = Router();

router.get('/', TestPanelController.getTestPanelData);
router.post('/reset', TestPanelController.resetTestPanel);

export default router;