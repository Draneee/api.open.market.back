import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// PrismaService is like a injectable service that i wanna inject in others class/modules, in wich i want create a db connection for this i need import
@Injectable()
// onModuleInit is to execute code when i call the class
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
