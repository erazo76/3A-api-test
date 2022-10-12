import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService){}

    @Post('/register')
    register(@Body()registerUserDto: RegisterUserDto): Promise<void>{
        return this.authService.registerUser(registerUserDto);
    }

    @Post('/login')
    login(@Body()loginDto: LoginDto): Promise<{ accessToken: string }>{
        return this.authService.login(loginDto);
    }  

}