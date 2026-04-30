import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../config/serviceAccountKey.json';
import { getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseService implements OnModuleInit {

    onModuleInit() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            });
            console.log('✅ Firebase initialized!');
        }
    }

    getFirestore() {
        return getFirestore(admin.app(), 'the-maths-class')
    }
    get storage() { return admin.storage(); }
    get auth() { return admin.auth(); }
}