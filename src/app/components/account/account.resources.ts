import { FormFields } from "../../framework/form/form.interfaces";
import nls from "../../framework/resources/nls/accounts";
import { passwordPattern, phonePattern } from "../authentication/auth.resources";

export const chnagePasswordFields: FormFields[] = [
  {
    name: "old_password",
    label: "Current Password",
    errorMessage: [
      {
        type: 'required',
        message: nls.ChangePasswordRequired
      }
    ],
    required: true,
    id: "old_password",
    type: "password",
    model: "old_password",
    pattern: "",
    options: []
  }, {
    name: "new_password",
    label: "New Password",
    errorMessage: [
      {
        type: 'required',
        message: nls.ChangePasswordRequiredNew,
      },
      {
        type: 'pattern',
        message: nls.invalidPassword,
      },
    ],
    required: true,
    id: "new_password",
    type: "password",
    model: "new_password",
    pattern: passwordPattern,
    options: []
  }
]
export const accountItems = [
  { id: 'view-profile', label: nls.ViewProfile },
  { id: 'edit-profile', label: nls.EditProfile },
  { id: 'change-password', label: nls.ChangePassword },
  // { id: 'my-plan', label: nls.MyPlan, disabled: true },
  { id: 'reset-account', label: nls.resetAccount },
  { id: 'backup-data', label: nls.backupData },
  { id: 'help', label: nls.HelpSupport },
  { id: 'about', label: nls.About },
  { id: 'biometric', label: nls.BiometricSettings },
  { id: 'theme', label: nls.SwitchTheme },
]
export const editProfileFields: FormFields[] = [
  {
    name: "first_name",
    label: nls.fname,
    errorMessage: [
      {
        type: 'required',
        message: nls.fnameRequired
      }
    ],
    required: true,
    id: "first_name",
    type: "text",
    model: "first_name",
    pattern: "",
    options: []
  },
  {
    name: "last_name",
    label: nls.lname,
    errorMessage: [
      {
        type: 'required',
        message: nls.lnameRequired
      }
    ],
    required: true,
    id: "last_name",
    type: "text",
    model: "last_name",
    pattern: "",
    options: []
  },
  {
    name: "email",
    label: nls.email,
    errorMessage: [
      {
        type: 'required',
        message: nls.emailRequired
      }
    ],
    disabled: true,
    required: true,
    id: "email",
    type: "email",
    model: "email",
    pattern: "",
    options: []
  },
  {
    name: "phone",
    label: nls.phone,
    errorMessage: [
      {
        type: 'required',
        message: nls.phoneRequired
      }, {
        type: 'pattern',
        message: nls.invlaidPhone
      }
    ],
    disabled: false,
    required: true,
    id: "phone",
    type: "tel",
    model: "phone",
    pattern: phonePattern,
    options: []
  }


]

export const backupDataFormFields: FormFields[] = [
  {
    name: 'backup-file',
    label: `${nls.backupFile} (${nls.backupFileName})`,
    options: [],
    errorMessage: [
      {
        type: 'required',
        message: nls.backupFileIsRequired,
      }
    ],
    required: true,
    id: 'backup-file',
    type: 'file',
    model: 'backup-file',
    pattern: '',
    accept: ".bak",
  }
]