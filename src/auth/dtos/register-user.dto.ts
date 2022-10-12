import { IsEmail, IsNotEmpty, IsOptional, Length, Matches } from "class-validator";

export class RegisterUserDto{
    
    @IsNotEmpty()    
    @Length(2,50)
    @Matches(/^(\b[A-Z][a-zñáéíóú]+['\-]{0,1}[a-zñáéíóú]+)(\s+(\b[A-Z][a-zñáéíóú]+['\-]{0,1}[a-zñáéíóú]+))*$/, {message: 'Invalid name'}) 
    name: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()  
    @Length(8,20)
    @Matches(/(?![.\n])(?=.*[a-z]).*$/, {message:'Include at least a lowercase character'})//lower    
    @Matches(/(?![.\n])(?=.*[A-Z]).*$/, {message:'Include at least a uppercase character'})//upper    
    @Matches(/((?=.*\d)|(?=.*\W+)).*$/, {message:'Include at least a number'})//number
    @Matches(/(?=(?:.*[@#$?*.!%\-_])).*$/, {message:'Include at least a special character (# $ @ ? * . ! % - _)'})//special
    password?: string;

}