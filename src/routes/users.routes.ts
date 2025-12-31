import { Router } from 'express';
import * as UsersController from '../controllers/users.controller';

const router = Router();

router.get('/', UsersController.getUsers);
router.get('/:id', UsersController.getUserById);
router.post('/', UsersController.createUser);
router.put('/:id', UsersController.updateUser);
router.post('/:id/favorites/add', UsersController.addFavoriteShop);
router.post('/:id/favorites/remove', UsersController.removeFavoriteShop);
router.post('/:id/agenda/add', UsersController.addToAgenda);
router.post('/:id/agenda/remove', UsersController.removeFromAgenda);

export default router;