import { UserStatus } from "../enum/userstatus.enum";
import { UserRole } from "../enum/userrole.enum";

export class User {
    id?: string;
    username?: string;
    email?: string;
    passwordHash?: string;
    firstName?: string;
    lastName?: string;
    profileUrl?: string;
    contactNumber?: string;

    role?: UserRole;
    isActive?: UserStatus;
    isVerified?: boolean;
    isDeleted?: boolean;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}




