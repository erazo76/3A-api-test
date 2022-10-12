import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class LoginDto {
    @ApiProperty({description:'User Email (unique)'})
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({description:'Include at least 8 character length, a lowercase character, a uppercase character, a number and a special character (# $ @ ? * . ! % - _)'})
    @IsNotEmpty()
    @Length(8,20)
    password: string;
}