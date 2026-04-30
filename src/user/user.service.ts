import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { userConverter } from './helpers/firestoredata-converter';
import { randomBytes } from 'crypto';
import { UserRegDto } from './dto/user-reg.dto';
import { UserRole } from './enum/userrole.enum';
import { Student } from './schema/student.schema';
import { CATEGORY } from './enum/category.enum';
import * as bcrypt from 'bcrypt';
import { User } from './schema/user.schema';
import { UserStatus } from './enum/userstatus.enum';

@Injectable()
export class UserService {
    constructor(private firebaseService: FirebaseService) {

    }

    private getUsersCollection() {
        return this.firebaseService.getFirestore()
            .collection('users')
            .withConverter(userConverter)
            ;
    }
    // private generateVerificationToken():string{
    //     return randomBytes(32).toString('hex')
    // }

    async findByEmail(email: string) {
        const querySnapshot = await this.getUsersCollection()
            .where('email', '==', email).get();
        if (querySnapshot.empty) return null;
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() }
    }


    private async generateStudentCode(category?: CATEGORY, alyear?: number): Promise<string> {
        if (!category) {
            throw new BadRequestException("Category is required for student code generation")
        }
        const firestore = this.firebaseService.getFirestore();

        let prefix: string;
        let counterKey: string;

        if (category === CATEGORY.SECONDARY) {
            prefix = 'ST-SEC-'
            counterKey = 'ST';
        }
        else if (category === CATEGORY.ADVANCEDLEVEL) {
            if (!alyear) {
                throw new BadRequestException("Al Year needed for al student registration")
            }
            const yearSuffix = String(alyear).slice(-2);
            prefix = `ST-AL-${yearSuffix}`;
            counterKey = `AL-${yearSuffix}`;
        } else {
            throw new BadRequestException(`Invalid category ${category}`)
        }
        const counterRef = firestore.collection('counters').doc(counterKey);

        const nextSeq = await firestore.runTransaction(async (tx) => {
            const snap = await tx.get(counterRef);

            if (!snap.exists) {
                tx.set(counterRef, { seq: 1 });
                return 1;
            }

            const next = (snap.data()!.seq as number) + 1;
            tx.update(counterRef, { seq: next });
            return next;
        });

        const paddedSeq = String(nextSeq).padStart(6, '0')

        return `${prefix}${paddedSeq}`;
    }

    async createUser(dto: UserRegDto) {
        const collection = this.getUsersCollection();

        if (await this.findByEmail(dto.email)) {
            throw new ConflictException('Email already exists');
        }

        const role = dto.role || UserRole.STUDENT;
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        let userData: User | Student;

        if (role === UserRole.STUDENT) {
            if (!dto.category) {
                throw new BadRequestException('Category is required for student registration');
            }
            if (dto.category === CATEGORY.ADVANCEDLEVEL && !dto.alyear) {
                throw new BadRequestException('AL Year is required for advanced level student registration');
            }

            const studentCode = await this.generateStudentCode(dto.category, dto.alyear);

            userData = new Student({
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                studentCode: studentCode,
                passwordHash: hashedPassword,
                username: dto.username,
                contactNumber: dto.phoneNumber,
                dateOfBirth: dto.dateOfBirth,
                gender: dto.gender,
                category: dto.category,
                alyear: dto.alyear,
                guardianName: dto.guardianName,
                guardianWhatsappNo: dto.guardianWhatsappNo,
                guardianContactNo: dto.guardianContactNo,
                academicHistory: [],
                role: role,
                isActive: UserStatus.PENDING,
                isVerified: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

        } else {
            throw new BadRequestException(`Registration for role "${role}" is not yet supported`);
        }

        const docRef = await collection.add({ ...userData });
        userData.id = docRef.id;

        const { passwordHash, ...safeUser } = { ...userData };
        return safeUser;
    }

    async updateRefreshTokenHash(id: string, refreshToken: string) {
        let hashedRefreshToken: string | null = null;
        if (refreshToken) {
            const salt = await bcrypt.genSalt(10);
            hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        }

        await this.firebaseService.getFirestore()
            .collection('users')
            .doc(id)
            .update({ refreshToken: hashedRefreshToken });
    }








}
