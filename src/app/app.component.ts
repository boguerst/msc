import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

// import { User } from './models/user';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'msc';
  pseudo: string;
  userSubscription: Subscription;

  constructor(private authService: AuthService) {}

  /*ngOnInit() {
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        // this.pseudo = user.getPseudo();
      });
  }*/

  /*ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }*/

  signOut() {
    this.authService.SignOut();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn;
  }
}
