import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { RegisterUsersDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './auth.guard';
import { User } from '@prisma/client';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    try {
      const result = await this.authService.login(loginDto);
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully login!',
        result: result,
      });
    } catch (err) {
      return response.status(500).json({
        status: 'Error!',
        message: 'Internal Server Error!',
      });
    }
  }

  @Post('/register')
  async register(
    @Req() request: Request,
    @Res() response: Response,
    @Body() registerDto: RegisterUsersDto,
  ): Promise<any> {
    try {
      const result = await this.authService.register(registerDto);
      return response.status(200).json({
        status: 'Ok!',
        message: 'Successfully register user!',
        result: result,
      });
    } catch (err) {
      return response.status(500).json({
        status: 'Error!',
        message: 'Internal Server Error!',
      });
    }
  }

  @Get('/validate-session')
  @UseGuards(JwtAuthGuard)
  async validateSession(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    try {
      if (request.user) {
        const user = request.user as User;
        return response.status(200).json({
          status: 'ok',
          message: 'Session is valid!',
          id: user.id,
          email: user.email,
          rol: user.rol,
          nickname: user.nickname,
        });
      } else {
        return response.status(401).json({
          status: 'Error!',
          message: 'Unauthorized: Session is not valid!',
        });
      }
    } catch (err) {
      return response.status(500).json({
        status: 'Error!',
        message: 'Internal Server Error!',
      });
    }
  }
}
