import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as firebase from 'firebase';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: User = null;
  userSubject = new Subject<User>();

  constructor() { }

  emitUser(u?) {
    this.userSubject.next(u ? u : this.user);
  }

  signin(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          () => {
            this.user = new User(email, email, password);
            this.emitUser();
            resolve();
          },
          (error) => {
            reject(error);
          });
      });
  }

  signup(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          });
      });
  }

  signout() {
    this.user = null;
    firebase.auth().signOut();
  }

  isLogged() {
    return this.user != null;
    // firebase.auth().isSignInWithEmailLink();
  }
}
