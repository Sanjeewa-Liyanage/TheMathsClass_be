import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean, IsEnum, IsDate, ValidateIf, IsNumber } from 'class-validator';
import { UserRole } from '../enum/userrole.enum';
import { CATEGORY } from '../enum/category.enum';
import { AcademicRecord } from '../schema/academic-record.schema';
import { UserStatus } from '../enum/userstatus.enum';

export class UserRegDto {


    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsOptional()
    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsEnum(UserStatus)
    isActive: UserStatus

    @IsOptional()
    @IsDate()
    dateOfBirth: Date

    @IsOptional()
    @IsString()
    gender: string;

    @IsOptional()
    @IsEnum(CATEGORY)
    category: CATEGORY



    @IsOptional()
    @IsString()
    guardianName: string;

    @IsOptional()
    @IsString()
    guardianWhatsappNo: string;

    @IsOptional()
    @IsString()
    guardianContactNo: string;


    @IsOptional()
    academicHistory: AcademicRecord[];

    @ValidateIf((o) => o.category === CATEGORY.ADVANCEDLEVEL)
    @IsNotEmpty()
    @IsNumber()
    alyear: number



}