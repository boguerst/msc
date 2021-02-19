import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// import { User } from '../../models/user';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      displayName: ['', [Validators.required, Validators.maxLength(15)]],
      profile: ['', [Validators.required/*, Validators.maxLength(1), Validators.pattern(/[A-Z]/)*/]]
      });
  }

  onSubmit() {
    this.authService.SignUp(this.signupForm.value).then(
      () => {
        this.router.navigate(['/mySpace']);
      },
      (error) => {
        this.errorMessage = error;
      });
  }

}
