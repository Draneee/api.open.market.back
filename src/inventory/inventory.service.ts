import { Injectable } from '@nestjs/common';
import { Inventory, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getUsersWithInventory(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        inventories: {
          some: {},
        },
      },
    });
  }

  async getInventoryUserWithPagination(
    id: number,
    skip: number,
    limit: number,
  ): Promise<[Inventory[], number]> {
    const [inventory, total] = await Promise.all([
      this.prisma.inventory.findMany({
        where: {
          ownerId: id,
        },
        skip: skip,
        take: limit,
      }),
      this.prisma.inventory.count({
        where: {
          ownerId: id,
        },
      }),
    ]);
    return [inventory, total];
  }

  async getInventoryMarketplaceWithPagination(
    skip: number,
    limit: number,
    query: string,
    range: number,
    sellers: string[],
  ): Promise<[Inventory[], number, number]> {
    let whereCondition: any = {};

    if (query) {
      whereCondition.OR = [
        { productName: { contains: query } },
        { SKU: { contains: query } },
      ];
    }

    if (range > 0) {
      whereCondition.price = {
        lte: range,
      };
    }

    if (sellers.length > 0) {
      whereCondition.ownerId = {
        in: sellers.map(Number),
      };
    }

    const [inventory, total, maxPrice] = await Promise.all([
      this.prisma.inventory.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
      }),
      this.prisma.inventory.count(),
      this.prisma.inventory
        .aggregate({
          _max: {
            price: true,
          },
        })
        .then((result) => {
          return result._max.price;
        }),
    ]);
    return [inventory, total, maxPrice];
  }

  async getInventoryById(id: number): Promise<Inventory> {
    return this.prisma.inventory.findUnique({
      where: {
        id: id,
      },
      include: {
        owner: true,
      },
    });
  }

  async createInventory(body: Inventory, ownerId: number): Promise<Inventory> {
    return this.prisma.inventory.create({
      data: {
        ownerId,
        ...body,
      },
    });
  }

  async updateInventory(id: number, data: Inventory): Promise<Inventory> {
    return this.prisma.inventory.update({
      where: {
        id,
      },
      data,
    });
  }
  async deleteInventory(id: number): Promise<Inventory> {
    return this.prisma.inventory.delete({
      where: {
        id,
      },
    });
  }
}
