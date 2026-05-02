import { IsEnum, IsNotEmpty } from 'class-validator';
import { EnrollmentStatus } from '../enum/enrollment-status.enum';

export class UpdateAcademicRecordDto {

    @IsEnum(EnrollmentStatus)
    @IsNotEmpty()
    enrollmentStatus: EnrollmentStatus;
}
