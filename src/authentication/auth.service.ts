import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterUsersDto } from './dto/register-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/users.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const users = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!users) {
      throw new NotFoundException('user not found');
    }

    const validatePassword = await bcrypt.compare(password, users.password);

    if (!validatePassword) {
      throw new NotFoundException('Invalid password');
    }

    return {
      token: this.jwtService.sign({ email }),
    };
  }

  async register(createDto: RegisterUsersDto): Promise<any> {
    const createUser = new User();
    createUser.email = createDto.email;
    createUser.nickname = createDto.nickname;
    createUser.password = await bcrypt.hash(createDto.password, 10);

    const user = await this.usersService.createUser(createUser);

    return {
      token: this.jwtService.sign({ nickname: user.nickname }),
    };
  }
}
