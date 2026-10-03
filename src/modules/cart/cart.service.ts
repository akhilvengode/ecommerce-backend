import { AppError } from "../../common/errors/appError";
import { prisma } from "../../config/prisma";

class CartService {
  async addToCart({
    userId,
    productId,
    quantity,
  }: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    return prisma.$transaction(async (tx) => {

      // 1️⃣ Check product
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product || !product.isActive) {
        throw new AppError("Product not available", 404);
      }

      if (product.stock < quantity) {
        throw new AppError("Insufficient stock", 400);
      }

      // 2️⃣ Find or create cart
      let cart = await tx.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: { userId },
        });
      }

      // 3️⃣ Check if item already exists
      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      // 4️⃣ Update quantity
      if (existingItem) {
        return tx.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        });
      }

      // 5️⃣ Create new item
      return tx.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price,
        },
      });
    });
  }

  async getCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(cart, 'cart');

    if (!cart) {
      return {
        items: [],
        cartTotal: 0,
      };
    }

    const items = cart.items.map((item) => {
      // item.price will be in decimal, we have to convert it into js number
      const total = Number(item.price) * item.quantity;

      return {
        productId: item.productId,
        name: item.product.name,
        price: Number(item.price),
        quantity: item.quantity,
        total,
      };
    });

    const cartTotal = items.reduce((sum, item) => sum + item.total, 0);

    return {
      items,
      cartTotal,
    };
  }

  async updateCartItem({
    userId,
    productId,
    quantity,
  }: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    // 1️⃣ Find cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    // 2️⃣ Find item
    const item = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!item) {
      throw new AppError("Item not found in cart", 404);
    }

    // 3️⃣ If quantity = 0 → delete
    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      return { message: "Item removed from cart" };
    }

    // 4️⃣ Update quantity
    return prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      data: {
        quantity,
      },
    });
  }
}

export const cartService = new CartService();
