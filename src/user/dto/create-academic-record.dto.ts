import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { EnrollmentStatus } from '../enum/enrollment-status.enum';

export class CreateAcademicRecordDto {

    @IsNumber()
    @IsNotEmpty()
    academicYear: number;

    @IsNumber()
    @IsNotEmpty()
    gradeLevel: number;

    @IsOptional()
    @IsEnum(EnrollmentStatus)
    enrollmentStatus?: EnrollmentStatus;
}
