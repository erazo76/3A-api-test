import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Product } from "../../product/entities/product.entity";

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  
    @Prop({required:true, length: 50 })
    name: string;
  
    @Prop({required:true, length: 100, unique: true })
    email: string;
  
    @Prop({ length: 100 })
    password: string;
  
    @Prop({ type: 'boolean', default: true })
    active: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);