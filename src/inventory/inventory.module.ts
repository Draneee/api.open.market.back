import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Prismamodule } from 'src/prisma/prisma.module';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService],
  imports: [Prismamodule],
})
export class InventoryModule {}
