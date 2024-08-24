import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  AuthUserCred,
  AuthenticationService,
} from '../../services/authentication.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import nls from '../../framework/resources/nls/authentication';
import { FormFields } from '../../framework/form/form.interfaces';
import { FormComponent } from '../../framework/form/form.component';

interface FormAuthType {
  [key: string]: any;
  login: FormFields[];
  signup: FormFields[];
}
const passwordPattern: string =
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$';
const authFormFields: FormAuthType = {
  login: [
    {
      name: 'email',
      label: nls.email,
      options:[],
      errorMessage: [
        {
          type: 'required',
          message: nls.emailRequired,
        },
        {
          type: 'pattern',
          message: nls.invalidEmail,
        },
      ],
      required: true,
      id: 'email',
      type: 'email',
      model: 'email',
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}',
    },
    {
      name: 'password',
      label: nls.password,
      options:[],
      errorMessage: [
        {
          type: 'required',
          message: nls.passwordRequired,
        },
        {
          type: 'pattern',
          message: nls.invalidPassword,
        },
      ],
      required: true,
      id: 'password',
      type: 'password',
      model: 'password',
      pattern: passwordPattern,
    },
  ],
  signup: [
    {
      name: 'email',
      label: nls.email,
      options:[],
      errorMessage: [
        {
          type: 'required',
          message: nls.emailRequired,
        },
        {
          type: 'pattern',
          message: nls.invalidEmail,
        },
      ],
      required: true,
      id: 'email',
      type: 'email',
      model: 'email',
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}',
    },
    {
      name: 'password',
      label: nls.password,
      options:[],
      errorMessage: [
        {
          type: 'required',
          message: nls.passwordRequired,
        },
        {
          type: 'pattern',
          message: nls.invalidPassword,
        },
      ],
      required: true,
      id: 'password',
      type: 'password',
      model: 'password',
      pattern: passwordPattern,
    },
    {
      name: 'fname',
      label: nls.fname,
      options:[],
      errorMessage: [
        {
          type: 'required',
          message: nls.fnameRequired,
        },
      ],
      required: true,
      id: 'fname',
      type: 'text',
      model: 'fname',
      pattern: '',
    },
    {
      name: 'lname',
      label: nls.lname,
      options:[],
      errorMessage: [{ type: 'required', message: nls.lnameRequired }],
      required: true,
      id: 'lname',
      type: 'text',
      model: 'lname',
      pattern: '',
    },
    {
      name: 'gender',
      label: nls.gender,
      options: [
        {
          label: 'Male',
          value: 'MALE',
        },
        {
          label: 'Female',
          value: 'FEMALE',
        },
        {
          label: 'Other',
          value: 'OTHER',
        },
      ],
      errorMessage: [{ type: 'required', message: nls.genderRequired }],
      required: true,
      id: 'gender',
      type: 'select',
      model: 'gender',
      pattern: '',
    },
  ],
};
@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    FormComponent,
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss',
})
export class AuthenticationComponent {
  private authService:AuthenticationService=inject(AuthenticationService);

  authType: WritableSignal<string> = signal('login');

  authFields: Signal<FormFields[]> = computed(() => {
    return authFormFields[this.authType()];
  });
  nls = nls;
  creds: AuthUserCred = {
    email: '',
    password: '',
    otherDetails: {
      confirmPassword: '',
      fname: '',
      lname: '',
      phone: '',
      gender: '',
    },
  };

  changeAuthType(): void {
    this.authType.update((val) => {
      return val === 'login' ? 'signup' : 'login';
    });
  }

  loginByGoogle() {
    this.authService.loginByGoogle();
  }
  loginWithUserPass(data: any) {
    this.authService.loginWithUserPass(data);
  }
  signupWithUserPass(data:any) {
    // console.warn(data);
    this.authService.signupWithUserPass(data);
  }
  submit(data:any){
    if(this.authType()==='login'){
      this.loginWithUserPass(data);
    }else{
      this.signupWithUserPass(data);
    }
  }
}
