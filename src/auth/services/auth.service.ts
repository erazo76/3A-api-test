import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from '../dtos/login.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { EncoderService } from './encoder.service';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
    logger: Logger;
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private encoderService: EncoderService,
        private jwtService: JwtService,
    ){ this.logger = new Logger('Reports Service'); }

    async registerUser(registerUserDto: RegisterUserDto): Promise<void> {
        let { name, email, password } = registerUserDto;
        password = await  this.encoderService.encodePassword(password);
        const activationToken = v4();
        try { 
            const registered = new this.userModel({name,email,password});            
            await registered.save();
        } catch (e) {           
            if (e.code === 11000) {
              throw new ConflictException('This email is already registered');
            }
            throw new InternalServerErrorException();
        }       
    } 

    async login(loginDto: LoginDto): Promise<any> {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });    
        if (
          user &&
          (await this.encoderService.checkPassword(password, user.password))
        ) {
          const payload: JwtPayload = { id: user.id, email, active: user.active };
          const accessToken = this.jwtService.sign(payload);    
          return { 
            id: user.id,
            email: user.email,
            token: accessToken
          };
        }
        throw new UnauthorizedException('Please check your credentials');
    }     

}
