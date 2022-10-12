import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dtos/login.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('User Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiResponse({ type: RegisterUserDto, status: 200 })
  @ApiOperation({ summary: 'Register a user by name, email and password' })
  register(@Body() registerUserDto: RegisterUserDto): Promise<void> {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('/login')
  @ApiResponse({ type: LoginDto, status: 200 })
  @ApiOperation({ summary: 'Login a user by email and password' })
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
}
