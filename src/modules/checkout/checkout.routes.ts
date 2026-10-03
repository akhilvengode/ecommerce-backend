import { Router } from 'express';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { checkout } from './checkout.controller';

export const checkoutRouter = Router();

checkoutRouter.post('/', authMiddleware, checkout);
