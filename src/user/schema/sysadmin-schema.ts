import { User } from "./user.schema";
import { UserRole } from "../enum/userrole.enum";

export class SysAdmin extends User {
    gender?: string;
    contactNo?: string;
    whatsAppNo?: string;

    constructor(partial: Partial<SysAdmin>) {
        super(partial);
        Object.assign(this, partial);
        this.role = UserRole.SYSTEMADMIN;
    }
}