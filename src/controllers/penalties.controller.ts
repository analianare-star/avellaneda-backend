import { Request, Response } from 'express';
import * as PenaltiesService from '../services/penalties.service';

export const getPenalties = async (req: Request, res: Response) => {
  const data = await PenaltiesService.getPenalties();
  res.json(data);
};

export const applyPenalty = async (req: Request, res: Response) => {
  const data = await PenaltiesService.applyPenalty(req.params.shopId, req.body?.reason);
  res.json(data);
};

export const removePenalty = async (req: Request, res: Response) => {
  const data = await PenaltiesService.removePenalty(req.params.shopId);
  res.json(data);
};
