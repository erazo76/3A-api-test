import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AUTH_SERVICE } from 'src/auth/interfaces/auth.interface';
import { AuthService } from 'src/auth/services/auth.service';
import { EncoderService } from 'src/auth/services/encoder.service';
import { User, UserSchema } from '../auth/entities/user.entity';
import { ProductController } from './controllers/product.controller';
import { Product, ProductSchema } from './entities/product.entity';
import { PRODUCT_SERVICE } from './interfaces/product.interface';
import { ProductService } from './services/product.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: configService.get<string>('EXPIRES_IN') },
        };
      },
    }),
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    {
      useClass: ProductService,
      provide: PRODUCT_SERVICE,
    },
    {
      useClass: AuthService,
      provide: AUTH_SERVICE,
    },
    EncoderService,
  ],
})
export class ProductModule {}
