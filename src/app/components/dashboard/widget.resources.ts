import nls from '../../framework/resources/nls/dashboard';

export const widgetForm = [
  {
    name: 'color',
    label: nls.color,
    options: [],
    errorMessage: [],
    defaultValue: '#450d59',
    required: false,
    id: 'color',
    type: 'color',
    model: 'color',
    pattern: ''
  },
  {
    name: 'transparency',
    label: nls.transparency,
    options: [],
    errorMessage: [],
    defaultValue: '100',
    required: false,
    id: 'transparency',
    type: 'slider',
    model: 'transparency',
    pattern: '',
    min: 0,
    max: 100
  },

  {
    name: 'title',
    label: nls.title,
    options: [],
    errorMessage: [
      {
        type: 'required',
        message: nls.titleRequired,
      },
      {
        type: 'pattern',
        message: nls.invalidTitle,
      },
    ],
    required: true,
    id: 'title',
    type: 'text',
    model: 'title',
    pattern: "^(?=.{1,18}$)[A-Za-z][A-Za-z\' \\-]*[A-Za-z]$",
    maxlength: 18
  },
  {
    name: 'target',
    label: nls.target,
    options: [],
    errorMessage: [],
    required: false,
    id: 'target',
    type: 'text',
    model: 'target',
    pattern: '',
    maxlength: 25
  },
  {
    name: 'motivation',
    label: nls.motivation,
    options: [],
    errorMessage: [
      {
        type: 'required',
        message: nls.motivationRequired,
      },
      {
        type: 'maxSize',
        message: nls.maxSizeError
      }
    ],
    required: true,
    id: 'motivation',
    type: 'file',
    model: 'motivation',
    pattern: '',
    accept: ".png,.svg,.webp,.jpg,.jpeg",
    maxSize: 500 * 1024 //500 kB
  }
]
