import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
/*import { MatButtonModule, MatCheckboxModule } from '@angular/material';*/
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MyspaceComponent } from './myspace/myspace.component';
import { EventComponent } from './event/event.component';
import { EventFilterPipe } from './pipes/event-filter.pipe';

const appRoutes: Routes = [
  { path: 'signin', component: SigninComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'mySpace', canActivate: [AuthGuard], component: MyspaceComponent},
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
    EventFilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    MatTabsModule,
    MatSliderModule/*,
    MatButtonModule,
    MatCheckboxModule*/,
    OrderModule,
    FilterPipeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
