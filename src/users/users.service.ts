import { PrismaService } from 'src/prisma/prisma.service';

import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUser(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser(data: User): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: {
        nickname: data.nickname,
      },
    });

    if (existing) {
      throw new ConflictException('username already exists');
    }

    return this.prisma.user.create({
      data: {
        ...data,
        rol: data.nickname === 'admin' ? 'admin' : 'user',
      },
    });
  }
}
