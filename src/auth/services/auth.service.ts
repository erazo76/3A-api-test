import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from '../dtos/login.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { EncoderService } from './encoder.service';

@Injectable()
export class AuthService {
  logger: Logger;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private encoderService: EncoderService,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger('Reports Service');
  }

  /**
   * It takes a RegisterUserDto object, encodes the password, and then saves the user to the database
   * @param {RegisterUserDto} registerUserDto - RegisterUserDto - This is the DTO that we created
   * earlier.
   */
  async registerUser(registerUserDto: RegisterUserDto): Promise<void> {
    let { password } = registerUserDto;
    const { email, name } = registerUserDto;

    password = await this.encoderService.encodePassword(password);

    try {
      const registered = new this.userModel({ name, email, password });
      await registered.save();
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('This email is already registered');
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * It takes a loginDto object, checks if the user exists in the database, and if the user exists, it
   * checks if the password is correct. If the password is correct, it creates a JWT token and returns it
   * @param {LoginDto} loginDto - LoginDto - This is the DTO that we created earlier.
   * @returns {
   *     id: user.id,
   *     email: user.email,
   *     token: accessToken,
   *     name: user.name,
   *   }
   */
  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (
      user &&
      (await this.encoderService.checkPassword(password, user.password))
    ) {
      const payload: JwtPayload = {
        id: user.id,
        email,
        active: user.active,
        name: user.name,
      };
      const accessToken = this.jwtService.sign(payload);
      return {
        id: user.id,
        email: user.email,
        token: accessToken,
        name: user.name,
      };
    }
    throw new UnauthorizedException('Please check your credentials');
  }
}
