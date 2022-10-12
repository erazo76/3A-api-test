
import { IsMongoId, IsNumber, IsOptional, Max, Min } from "class-validator";

export class CreateProductDto{ 

    @IsOptional()         
    name: string;
       
    @IsOptional()     
    @IsNumber({ maxDecimalPlaces: 2 })   
    @Min(0.00)
    @Max(9999999999.99)   
    price?: number;

    @IsOptional()
    @IsMongoId()    
    owner: string;

}