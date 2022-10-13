import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dtos/login.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { AUTH_SERVICE, IAuthService } from '../interfaces/auth.interface';

@ApiTags('User Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService, //private authService: AuthService
  ) {}

  @Post('/register')
  @ApiResponse({ type: RegisterUserDto, status: 201 })
  @ApiOperation({ summary: 'Register a user by name, email and password' })
  async register(
    @Res() res: Response,
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<any> {
    const response = await this.authService.registerUser(registerUserDto);
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Post('/login')
  @ApiResponse({ type: LoginDto, status: 200 })
  @ApiOperation({ summary: 'Login a user by email and password' })
  async login(@Res() res: Response, @Body() loginDto: LoginDto): Promise<any> {
    const response = await this.authService.login(loginDto);
    res.status(HttpStatus.OK).json(response);
  }
}
