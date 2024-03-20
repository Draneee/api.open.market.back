import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { AuthModule } from './authentication/auth.module';

@Module({
  imports: [InventoryModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
