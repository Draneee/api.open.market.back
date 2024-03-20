import { Prisma } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
  nickname: string;
  password: string;
  email: string;
  rol: string;
}
