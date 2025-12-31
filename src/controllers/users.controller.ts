import { Request, Response } from 'express';
import * as UsersService from '../services/users.service';

export const getUsers = async (req: Request, res: Response) => {
  const data = await UsersService.getUsers();
  res.json(data);
};

export const getUserById = async (req: Request, res: Response) => {
  const data = await UsersService.getUserById(req.params.id);
  res.json(data);
};

export const createUser = async (req: Request, res: Response) => {
  const data = await UsersService.createUser(req.body);
  res.json(data);
};

export const updateUser = async (req: Request, res: Response) => {
  const data = await UsersService.updateUser(req.params.id, req.body);
  res.json(data);
};

export const addFavoriteShop = async (req: Request, res: Response) => {
  const data = await UsersService.addFavoriteShop(req.params.id, req.body.shopId);
  res.json(data);
};

export const removeFavoriteShop = async (req: Request, res: Response) => {
  const data = await UsersService.removeFavoriteShop(req.params.id, req.body.shopId);
  res.json(data);
};

export const addToAgenda = async (req: Request, res: Response) => {
  const data = await UsersService.addToAgenda(req.params.id, req.body.streamId);
  res.json(data);
};

export const removeFromAgenda = async (req: Request, res: Response) => {
  const data = await UsersService.removeFromAgenda(req.params.id, req.body.streamId);
  res.json(data);
};