import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
/*import { MatButtonModule, MatCheckboxModule } from '@angular/material';*/
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MyspaceComponent } from './myspace/myspace.component';
import { EventComponent } from './event/event.component';
import { EventFilterPipe } from './pipes/event-filter.pipe';
import { GojsAngularModule } from 'gojs-angular';
import { MyEventComponent } from './my-event/my-event.component';

const appRoutes: Routes = [
  { path: 'signin', component: SigninComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'signout', component: SignupComponent},
  { path: 'mySpace', canActivate: [AuthGuard], component: MyspaceComponent},
  { path: 'myEvent', canActivate: [AuthGuard], component: MyEventComponent},
  { path: '', redirectTo: 'mySpace', pathMatch: 'full' },
  { path: '**', redirectTo: 'mySpace'}
];

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    MyspaceComponent,
    EventComponent,
    EventFilterPipe,
    MyEventComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    MatTabsModule,
    MatSliderModule,
    /*MatButtonModule,
    MatCheckboxModule,*/
    OrderModule,
    FilterPipeModule,
    GojsAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
