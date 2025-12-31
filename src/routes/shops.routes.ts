import { Router } from 'express';
import * as ShopsController from '../controllers/shops.controller';

const router = Router();

// --- LÍNEA NUEVA: Habilitamos la creación de tiendas ---
router.post('/', ShopsController.createShop);
// -------------------------------------------------------

router.get('/', ShopsController.getShops);
router.get('/:id', ShopsController.getShopById);
router.put('/:id', ShopsController.updateShop);
router.post('/:id/buy-stream-quota', ShopsController.buyStreamQuota);
router.post('/:id/buy-reel-quota', ShopsController.buyReelQuota);
router.post('/:id/toggle-penalty', ShopsController.togglePenalty);
router.post('/:id/activate', ShopsController.activateShop);
router.post('/:id/reject', ShopsController.rejectShop);
router.post('/:id/suspend-agenda', ShopsController.suspendAgenda);
router.post('/:id/lift-suspension', ShopsController.liftAgendaSuspension);
router.post('/:id/reset-password', ShopsController.resetShopPassword);

export default router;
