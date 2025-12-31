import { Request, Response } from 'express';
import * as AgendaService from '../services/agenda.service';

export const getAgendaByUser = async (req: Request, res: Response) => {
  const data = await AgendaService.getAgendaByUser(req.params.userId);
  res.json(data);
};

export const addToAgenda = async (req: Request, res: Response) => {
  const data = await AgendaService.addToAgenda(req.params.userId, req.body.streamId);
  res.json(data);
};

export const removeFromAgenda = async (req: Request, res: Response) => {
  const data = await AgendaService.removeFromAgenda(req.params.userId, req.body.streamId);
  res.json(data);
};