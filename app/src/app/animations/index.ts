import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export const fadeZoomInOut = trigger('fadeZoomInOut', [
  state('void', style({ opacity: 0, transform: 'scale(0.7) translate(-70%, -70%)' })),
  state('*', style({ opacity: 1, transform: 'scale(1) translate(-50%, -50%)' })),
  transition('void => *', [animate('0.3s ease-out')]),
  transition('* => void', [animate('0.3s ease-in')]),
]);

export const slideInOut = trigger('slideInOut', [
  state('void', style({ opacity: 0, right: '-500px' })),
  state('*', style({ opacity: 1, right: '0px' })),
  transition('void => *', [animate('0.3s ease-out')]),
  transition('* => void', [animate('0.3s ease-in')]),
]);
