import { Request, Response } from 'express';
import { asyncHandler } from "../../common/utils/asyncHandler";
import { checkoutService } from './checkout.services';

export const checkout = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    await checkoutService.checkout(userId);

    res.json({
        success: true
    })
    
});