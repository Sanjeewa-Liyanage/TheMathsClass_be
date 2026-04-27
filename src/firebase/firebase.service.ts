import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../config/serviceAccountKey.json';

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

    get firestore() { return admin.firestore(); }
    get storage() { return admin.storage(); }
    get auth() { return admin.auth(); }
}