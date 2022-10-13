import { LoginDto } from '../dtos/login.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';

export const AUTH_SERVICE = 'AUTH SERVICE';

export interface IAuthService {
  registerUser(registerUserDto: RegisterUserDto): Promise<any>;
  login(loginDto: LoginDto): Promise<any>;
}
