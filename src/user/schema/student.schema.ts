import { EnrollmentStatus } from "../enum/enrollment-status.enum";
import { AcademicRecord } from "./academic-record.schema";
import { User } from "./user.schema";
import { UserRole } from "../enum/userrole.enum";
import { CATEGORY } from "../enum/category.enum";

export class Student extends User {
    studentCode?: string;
    dateOfBirth?: Date;
    gender?: String;
    category?: CATEGORY;


    guardianName?: string;
    guardianWhatsappNo?: string;
    guardianContactNo?: string;

    academicHistory?: AcademicRecord[];

    alyear?: number

    constructor(partial: Partial<Student>) {
        super(partial);
        Object.assign(this, partial);
        this.role = UserRole.STUDENT;
    }

    getCurrentGrade(): number | null {
        if (!this.academicHistory || this.academicHistory.length === 0) {
            return null;
        }
        const currentYear = new Date().getFullYear();
        const currentRecord = this.academicHistory.find(record =>
            record.academicYear === currentYear &&
            record.enrollmentStatus === EnrollmentStatus.ONGOING
        );
        return currentRecord ? currentRecord.gradeLevel : null;
    }

}