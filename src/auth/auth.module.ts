import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { User, UserSchema } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { EncoderService } from './services/encoder.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { Product, ProductSchema } from '../product/entities/product.entity';


@Module({
  imports:[
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
        }
      }
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, EncoderService,JwtStrategy],
  exports: [JwtStrategy,PassportModule],
})
export class AuthModule {}
