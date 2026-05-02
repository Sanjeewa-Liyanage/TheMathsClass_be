import { EnrollmentStatus } from "../enum/enrollment-status.enum";

export class AcademicRecord {
    id: string;
    academicYear: number;
    gradeLevel: number;
    enrollmentStatus: EnrollmentStatus;

}