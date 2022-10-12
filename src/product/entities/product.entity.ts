import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/entities/user.entity';

@Schema({ timestamps: true, versionKey: false })
export class Product extends Document {
  @Prop({ required: false, length: 50 })
  name: string;

  @Prop({ required: false, length: 20 })
  price: number;

  @Prop({ type: Types.ObjectId, ref: User.name }) // user ID reference
  owner: User | Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
