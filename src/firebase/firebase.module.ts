import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Global() // Makes FirebaseService available everywhere without re-importing
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule { }