import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger: Logger;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,    
  ) {      
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });    
    this.logger = new Logger('Reports Service');     
  }
  async validate(payload: JwtPayload): Promise<User> { 
    const { email } = payload;
    const user = await this.userModel.findOne({email});  
    
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}