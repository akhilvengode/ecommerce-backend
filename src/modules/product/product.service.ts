import { prisma } from "../../config/prisma";

class ProductService {
  async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
  }) {
    return prisma.product.create({
      data,
    });
  }

  async getProducts() {
    return prisma.product.findMany();
  }

  async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
    });
  }
}

export const productService = new ProductService();
