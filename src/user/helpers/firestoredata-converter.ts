import { DocumentData, QueryDocumentSnapshot, FirestoreDataConverter } from 'firebase-admin/firestore';
import { UserRole } from '../enum/userrole.enum';
import { User } from '../schema/user.schema';
import { Student } from '../schema/student.schema';
import { SysAdmin } from '../schema/sysadmin-schema';
import { SuperAdmin } from '../schema/super-admin.schema';


export const userConverter: FirestoreDataConverter<User> = {
    toFirestore(user: User): DocumentData {
        const data = { ...user };
        Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
        return data;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): User {
        const data = snapshot.data();
        const registeredAt = (data.registeredAt as any)?.toDate ? (data.registeredAt as any).toDate() : data.registeredAt;
        const baseData = { ...data, id: snapshot.id, registeredAt };

        switch (data.role) {
            case UserRole.STUDENT:
                return new Student(baseData);
            case UserRole.SUPERADMIN:
                return new SuperAdmin(baseData);
            case UserRole.SYSTEMADMIN:
                return new SysAdmin(baseData);
            default:
                return new User(baseData);
        }
    }
};