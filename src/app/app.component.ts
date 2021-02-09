import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';

import { User } from './models/user';

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

  constructor(private authService: AuthService) {
    /*const firebaseConfig = {
      apiKey: 'AIzaSyDjXmABWsHaf069HqxkfqEtf7RHW4dDdsc',
      authDomain: 'mscdb-3dcc4.firebaseapp.com',
      databaseURL: 'https://mscdb-3dcc4.firebaseio.com',
      projectId: 'mscdb-3dcc4',
      storageBucket: 'mscdb-3dcc4.appspot.com',
      messagingSenderId: '937692415291',
      appId: '1:937692415291:web:afbbed639607d0523ba31e'
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);*/
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        this.pseudo = user.getPseudo();
      });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
