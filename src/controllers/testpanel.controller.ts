import { Request, Response } from 'express';
import * as TestPanelService from '../services/testpanel.service';

export const getTestPanelData = async (req: Request, res: Response) => {
  const data = await TestPanelService.getTestPanelData();
  res.json(data);
};

export const resetTestPanel = async (req: Request, res: Response) => {
  const data = await TestPanelService.resetTestPanel();
  res.json(data);
};