import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean, IsEnum, IsDate, ValidateIf, IsNumber } from 'class-validator';


export class UserLoginDto {

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    userCode: string;

    @IsEmail()
    @IsOptional()
    email: string;
}