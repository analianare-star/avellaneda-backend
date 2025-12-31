import { Request, Response } from 'express';
import * as ReviewsService from '../services/reviews.service';

export const getReviewsByStream = async (req: Request, res: Response) => {
  const data = await ReviewsService.getReviewsByStream(req.params.streamId);
  res.json(data);
};

export const createReview = async (req: Request, res: Response) => {
  const data = await ReviewsService.createReview(req.params.streamId, req.body);
  res.json(data);
};
