import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormFields } from './form.interfaces';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSelectModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  @Input('form-fields') formFields!: FormFields[];
  @Output('on-submit') onSubmit = new EventEmitter();
  @Output('on-cancel') onCancel = new EventEmitter();
  @Input('submit-button-title') subButtonTitle!: string;
  @Input('cancel-button-title') canButtonTitle!: string;

  formState: any = {};
  ngOnInit(): void {
    this.formFields.forEach((item) => {
      this.formState[item.name] = '';
    });
  }
  submitForm(event: SubmitEvent): void {
    event.preventDefault();
    this.onSubmit.emit(this.formState);
  }
  cancelForm() {
    this.onCancel.emit(false);
  }
  getPasswordStrength(): string[] {
    let password = this.formState.password;

    const failedCriteria: string[] = [];
    if (!/(?=.*[a-z])/.test(password)) {
      failedCriteria.push('At least one lowercase letter (a-z)');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      failedCriteria.push('At least one uppercase letter (A-Z)');
    }
    if (!/(?=.*\d)/.test(password)) {
      failedCriteria.push('At least one digit (0-9)');
    }
    if (!/(?=.*[^a-zA-Z\d\s])/.test(password)) {
      failedCriteria.push('At least one special character');
    }
    if (password.length < 8) {
      failedCriteria.push('Minimum 8 characters');
    }

    return failedCriteria;
  }
  getPasswordStrengthNum(): number {
    let failures = this.getPasswordStrength();
    return (1 - failures.length / 5) * 100;
    // if(failures.length){
    //   return 100/(failures.length+1);
    // }else{
    //   return 100;
    // }
  }
  getPasswordProgressColor(): string {
    let failpercent = this.getPasswordStrengthNum();
    if (failpercent <= 80) return 'warn';
    else return 'primary';
  }
}
