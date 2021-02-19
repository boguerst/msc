import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private afs: AngularFirestore) { }

  getEvents() {
    return this.afs.collection('events').snapshotChanges();
  }
}
