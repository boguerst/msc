import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().onAuthStateChanged(
        (user) => {
          if(user) {
            this.authService.emitUser(new User(user.email, user.email, ''));
            resolve(true);
          } else {
            this.router.navigate(['/auth', 'signin']);
            resolve(false);
          }
        });
        /*if(this.authService.isLogged()) {
          resolve(true);
        } else {
          this.router.navigate(['/auth', 'signin']);
          resolve(false);
        }*/
      });
  }
  
}
