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
    userCode: string;

    role?: UserRole;
    isActive?: UserStatus;
    isVerified?: boolean;
    isDeleted?: false;

    lastLogin?: Date;
    refreshToken?: string;
    rtExpire: Date;


    createdAt?: Date;
    updatedAt?: Date;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}




