import nls from '../../framework/resources/nls/authentication';
import { FormFields } from '../../framework/form/form.interfaces';

export interface FormAuthType {
  [key: string]: any;
  login: FormFields[];
  signup: FormFields[];
}
export const passwordPattern: string =
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$';
export const emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
export const phonePattern: string = '^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$';

export const authFormFields: FormAuthType = {
  login: [
    {
      name: 'email',
      label: nls.email,
      options: [],
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
      pattern: emailPattern,
    },
    {
      name: 'password',
      label: nls.password,
      options: [],
      errorMessage: [
        {
          type: 'required',
          message: nls.passwordRequired,
        }
      ],
      required: true,
      id: 'password',
      type: 'password',
      model: 'password',
      pattern: '',
    },
  ],
  signup: [
    {
      name: 'first_name',
      label: nls.fname,
      options: [],
      errorMessage: [
        {
          type: 'required',
          message: nls.fnameRequired,
        },
      ],
      required: true,
      id: 'first_name',
      type: 'text',
      model: 'first_name',
      pattern: '',
    },
    {
      name: 'last_name',
      label: nls.lname,
      options: [],
      errorMessage: [{ type: 'required', message: nls.lnameRequired }],
      required: true,
      id: 'last_name',
      type: 'text',
      model: 'last_name',
      pattern: '',
    },
    {
      name: 'email',
      label: nls.email,
      options: [],
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
      pattern: emailPattern,
    },
    {
      name: 'phone',
      label: nls.phone,
      options: [],
      errorMessage: [
        {
          type: 'required',
          message: nls.phoneRequired,
        },
        {
          type: 'pattern',
          message: nls.invalidMobileFormat,
        },
      ],
      required: true,
      id: 'phone',
      type: 'text',
      model: 'phone',
      pattern: phonePattern,
    },

    {
      name: 'password',
      label: nls.password,
      options: [],
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
      name: 'confirm_password',
      label: nls.confirmpassword,
      options: [],
      errorMessage: [
        {
          type: 'required',
          message: nls.passwordMatchError,
        }
      ],
      required: true,
      id: 'confirm_password',
      type: 'password',
      model: 'confirm_password',
      pattern: '',
      matching: true
    },
    // {
    //   name: 'gender',
    //   label: nls.gender,
    //   options: [
    //     {
    //       label: 'Male',
    //       value: 'MALE',
    //     },
    //     {
    //       label: 'Female',
    //       value: 'FEMALE',
    //     },
    //     {
    //       label: 'Other',
    //       value: 'OTHER',
    //     },
    //   ],
    //   errorMessage: [{ type: 'required', message: nls.genderRequired }],
    //   required: true,
    //   id: 'gender',
    //   type: 'select',
    //   model: 'gender',
    //   pattern: '',
    // },
  ],
};
