import { Router } from 'express';
import * as NotificationsController from '../controllers/notifications.controller';

const router = Router();

router.get('/:userId', NotificationsController.getNotificationsByUser);
router.post('/:userId/read-all', NotificationsController.markAllAsRead);
router.post('/:id/read', NotificationsController.markAsRead);

export default router;