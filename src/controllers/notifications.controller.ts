import { Request, Response } from 'express';
import * as NotificationsService from '../services/notifications.service';

export const getNotificationsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await NotificationsService.getNotificationsByUser(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await NotificationsService.markAsRead(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error marking notification as read' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updated = await NotificationsService.markAllAsRead(userId);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error marking all notifications as read' });
  }
};