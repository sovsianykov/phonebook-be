import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthGuard } from './guards/auth.guard.js';
import { AdminGuard } from './guards/admin.guard.js';
import { UpdateDto } from './dto/update.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @ApiOperation({ summary: 'Login and receive auth cookie' })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.login(
      dto.email,
      dto.password,
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return user;
  }

  @ApiOperation({ summary: 'Logout and clear auth cookie' })
  @ApiCookieAuth()
  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    return { message: 'Logged out successfully' };
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiCookieAuth()
  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() req: Request) {
    const user = req['user'] as { sub: number };
    return this.authService.getProfile(user.sub);
  }

  @ApiOperation({ summary: 'Delete a user (admin only)' })
  @ApiCookieAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, AdminGuard)
  async deleteProfile(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.authService.deleteProfile(id);
  }

  @ApiOperation({ summary: 'Update current user profile' })
  @ApiCookieAuth()
  @Put('me')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Req() req: Request,
    @Body() dto: UpdateDto,
  ): Promise<void> {
    const user = req['user'] as { sub: number };
    await this.authService.updateProfile(user.sub, dto);
  }

  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiCookieAuth()
  @Get('')
  @UseGuards(AuthGuard, AdminGuard)
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
}
