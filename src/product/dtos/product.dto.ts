import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsMongoId()
  owner: string;
}
