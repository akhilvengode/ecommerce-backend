import { Prisma } from "@prisma/client";
import { AppError } from "../../common/errors/appError";
import { prisma } from "../../config/prisma";

class CheckoutService {
    async checkout(userId: string) {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart) {
            throw new AppError("Cart not found", 404);
        }

        if (cart.items.length <= 0) {
            throw new AppError("Cart is empty", 400);
        }

        const checkoutIssues = cart.items.reduce((acc, cartItem) => {
            const {
                productId,
                quantity,
                price,
                product: { isActive, stock, name, price: currentPrice },
            } = cartItem;
            const issues: Record<string, unknown> = {};

            if (!isActive) {
                issues.isActive = false;
            }

            if (quantity > stock) {
                issues.quantity = {
                    required: quantity,
                    current: stock
                };
            }

            if (!price.equals(currentPrice)) {
                issues.price = {
                    previous: price,
                    current: currentPrice,
                };
            }

            if (Object.keys(issues).length > 0) {
                issues.id = productId;
                issues.productName = name;
                acc.push(issues);
            }

            return acc;
        }, [] as Record<string, unknown>[]);

        if (checkoutIssues.length > 0) {
            throw new AppError("Cart has changed", 409, { issues: checkoutIssues })
        }

        const totalAmount = cart.items.reduce((acc, cartItem) => {
            const { quantity, price } = cartItem;
            
            return acc.add(
                price.mul(quantity)
            );
        }, new Prisma.Decimal(0));

        await prisma.$transaction(async (tx) => {
            for (const { productId, quantity } of cart.items) {
                const result = await tx.product.updateMany({
                    where: {
                        id: productId,
                        stock: {
                            gte: quantity
                        }
                    },
                    data: {
                        stock: {
                            decrement: quantity
                        }
                    }
                });

                if (result.count !== 1) {
                    throw new AppError("Stock changed while processing checkout", 409);
                }
            }

            const order = await tx.order.create({
                data: { userId, total: totalAmount }
            });

            for (const cartItem of cart.items) {
                const { quantity, productId, price } = cartItem;
                await tx.orderItem.create({
                    data: { orderId: order.id, productId, quantity, price }
                });
            }

            await tx.cart.delete({
                where: { userId }
            });
        });
    }
}

export const checkoutService = new CheckoutService();
