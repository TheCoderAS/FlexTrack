import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormFields } from './form.interfaces';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BehaviorSubject } from 'rxjs';
import { ModalWindowComponent } from "../modal-window/modal-window.component";
import nls from '../resources/nls/generic';
import { addFieldFormFields } from './form.resources';
import { MatIconModule } from '@angular/material/icon';

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
    MatSelectModule,
    MatSliderModule,
    ModalWindowComponent,
    MatIconModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private cdRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  @Input('form-fields') formFields: FormFields[] = [];
  @Input('dynamic-form-fields') dynamicFormFields = new BehaviorSubject<FormFields[]>([]);
  @Output('on-submit') onSubmit = new EventEmitter();
  @Output('on-cancel') onCancel = new EventEmitter();
  @Input('submit-button-title') subButtonTitle!: string;
  @Input('cancel-button-title') canButtonTitle!: string;
  @Output('on-change') onChange = new EventEmitter();
  @Input('type') formType: 'dynamic' | 'static' = 'static';

  thumbLabel(value: number): string {
    return `${value}%`;
  }
  inputFileField: any = {};
  inputFileMaxSizeError: any = {};
  appForm!: FormGroup;
  appAddFormFieldForm!: FormGroup;
  uploadedFile: any = {};
  isModalOpen: WritableSignal<boolean> = signal(false);
  nls = nls;
  addFieldFormFields: FormFields[] = addFieldFormFields;

  ngOnInit(): void {
    this.subscribeDynamicForm();
    this.buildAddFormFieldForm();
    this.cdRef.detectChanges();
    this.subscribeValueChanges();
  }
  buildAddFormFieldForm() {
    let formGroupItems: any = {};
    addFieldFormFields.forEach((item) => {
      formGroupItems[item.name] = item.defaultValue ? item.defaultValue : '';
    });

    this.appAddFormFieldForm = this.fb.group(formGroupItems);
  }
  subscribeDynamicForm() {
    if (this.formFields.length) {
      this.buildForm(this.formFields);
      return;
    }
    this.dynamicFormFields.subscribe((value) => {
      this.formFields = value;
      this.buildForm(value);
      return;
    })
  }
  buildForm(formFields: FormFields[]) {
    let formGroupItems: any = {};
    formFields.forEach((item) => {
      if (item.type === 'file') {
        formGroupItems[item.name] = '';
        this.uploadedFile[item.name] = item.defaultValue;
      } else {
        formGroupItems[item.name] = [{ value: item.defaultValue ? item.defaultValue : '', disabled: item.disabled ? true : false }];
      }
      if (item.type === 'file') {
        this.inputFileField[item.name] = item;
      }
      if (item.type === 'file') {
        this.inputFileField[item.name] = item;
      }
    });

    this.appForm = this.fb.group(formGroupItems);
  }
  subscribeValueChanges() {
    this.onChange.emit({ ...this.appForm.value, ...this.uploadedFile });
    this.appForm.valueChanges.subscribe((value) => {
      if (value.password && value.confirmpassword) {
        this.passwordMatching(value.password, value.confirmpassword)
      }
      this.onChange.emit({ ...value, ...this.uploadedFile });
    });
  }
  passwordMatching(password: string, confirmpassword: string) {
    // console.log(this.appForm.controls['confirmpassword'])
    if (password === confirmpassword) {
      this.appForm.controls['confirmpassword'].setErrors(null);
    } else {
      this.appForm.controls['confirmpassword'].setErrors({ required: true });
    }
  }
  onFileSelected(event: Event): void {
    let inputFile = this.inputFileField[(event as any).target.name];

    const input = event.target as HTMLInputElement;
    if (inputFile && input.files && input.files.length) {
      const file = input.files[0];
      if (inputFile?.maxSize) {
        if (file.size <= inputFile?.maxSize) {
          this.uploadedFile[inputFile.name] = file;
          this.appForm.controls[inputFile.name].updateValueAndValidity();
          this.inputFileMaxSizeError[inputFile.name] = '';

        } else {
          this.appForm.controls[inputFile.name].setValue('');
          let errMsg = inputFile.errorMessage.find((item: any) => item.type === 'maxSize').message;
          this.inputFileMaxSizeError[inputFile.name] = errMsg + (inputFile.maxSize / 1024) + "kB.";
          this.appForm.controls[inputFile.name].setErrors({ maxSize: true });
        }
      } else {
        this.uploadedFile[inputFile.name] = file;
      }
    }
  }

  submitForm(event: SubmitEvent): void {
    event.preventDefault();
    let data = {
      ...this.appForm.value,
      ...this.uploadedFile
    }
    this.onSubmit.emit(data);
  }
  cancelForm() {
    this.onCancel.emit(false);
  }
  getPasswordStrength(password: string): string[] {
    // let password = 'Aalok@123';

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
  getPasswordStrengthNum(name: string): number {
    let failures = this.getPasswordStrength(this.appForm.controls[name].value);
    return (1 - failures.length / 5) * 100;
    // if(failures.length){
    //   return 100/(failures.length+1);
    // }else{
    //   return 100;
    // }
  }
  getPasswordProgressColor(name: string): string {
    let failpercent = this.getPasswordStrengthNum(name);
    if (failpercent <= 80) return 'warn';
    else return 'primary';
  }

  //dynamic form implemetation
  toggleModal(state: boolean) {
    this.isModalOpen.set(state);
    if (state) {
      this.buildAddFormFieldForm()
    }
  }
  onSubmitAddField(event: SubmitEvent): void {
    event.preventDefault();
    this.toggleModal(false);
    let data = this.appAddFormFieldForm.value;
    let prevFields = this.dynamicFormFields.getValue();
    prevFields.push({
      name: data.fieldName.replace(' ', '-').toLowerCase().trim(),
      label: data.fieldName.trim(),
      type: data.fieldType.toLowerCase(),
      required: true
    });
    prevFields.map((item: any) => {
      item.defaultValue = this.appForm.value[item.name]
      return item;
    })
    this.dynamicFormFields.next(prevFields);
  }
}
