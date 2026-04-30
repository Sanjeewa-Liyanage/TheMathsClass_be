import { User } from "./user.schema";
import { UserRole } from "../enum/userrole.enum";

export class SuperAdmin extends User {
    adminCode?: string;
    gender?: string;
    contactNo?: string;
    whatsAppNo?: string;

    constructor(partial: Partial<SuperAdmin>) {
        super(partial);
        this.role = UserRole.SUPERADMIN;
    }
}