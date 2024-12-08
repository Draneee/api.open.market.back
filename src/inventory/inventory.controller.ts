import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from '@prisma/client';
import { JwtAuthGuard } from 'src/authentication/auth.guard';
import { Console } from 'console';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly Inventory: InventoryService) {}

  @Get('marketplace')
  async getInventoryMarketplace(
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 12,
    @Query('query') query: string = '',
    @Query('range') range: number = 0,
    @Query('sellers') sellers: string,
  ) {
    let sellersArray: string[] = [];
    if (sellers) {
      sellersArray = sellers.split(',');
    }
    const [inventory, total, maxPrice] =
      await this.Inventory.getInventoryMarketplaceWithPagination(
        Number(skip),
        Number(limit),
        query,
        Number(range),
        sellersArray,
      );
    return { total, inventory, maxPrice };
  }

  @Get('sellers')
  @UseGuards(JwtAuthGuard)
  async getSellers(@Req() req) {
    const admin = req?.user?.rol === 'admin';

    try {
      if (!admin) throw new Error('Only admins can get the sellers.');
      const data = await this.Inventory.getUsersWithInventory();
      return data.map((itm) => {
        return {
          id: itm.id,
          email: itm.email,
          nickname: itm.nickname,
        };
      });
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getInventoryUser(
    @Req() req,
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 12,
  ) {
    console.log(req);
    const [inventory, total] =
      await this.Inventory.getInventoryUserWithPagination(
        req.user.id,
        Number(skip),
        Number(limit),
      );
    return { total, inventory };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createInventory(@Req() req, @Body() data: Inventory) {
    try {
      return await this.Inventory.createInventory(data, req.user.id);
    } catch (err) {
      const test = await err;
      if (err.code === 'P2002') {
        throw new BadRequestException(
          `The field ${err.meta.target?.[0]} cant be repeat`,
        );
      }
    }
  }

  @Get(':id')
  async getTaskById(@Param('id') id: number) {
    const inventoryFound = await this.Inventory.getInventoryById(Number(id));
    if (!inventoryFound)
      throw new NotFoundException('Inventory does not exist');

    return inventoryFound;
  }

  @Delete(':id')
  async deleteInventoryById(@Param('id') id: string) {
    try {
      return await this.Inventory.deleteInventory(Number(id));
    } catch (err) {
      throw new NotFoundException('Inventory does not exist');
    }
  }

  @Put(':id')
  async updateInventory(@Param('id') id: string, @Body() data: Inventory) {
    try {
      return await this.Inventory.updateInventory(Number(id), data);
    } catch (err) {
      throw new NotFoundException('Inventory does not exist');
    }
  }
}
