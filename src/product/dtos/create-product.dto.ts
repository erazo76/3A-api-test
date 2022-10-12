import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'User name capitalized' })
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Poduct price is a number betwen 0.00 and 9999999999.99',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.0)
  @Max(9999999999.99)
  price?: number;

  @ApiProperty({
    description: 'Owner reference to User Id in mongoId format (24 characters)',
  })
  @IsOptional()
  @IsMongoId()
  owner: string;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}
