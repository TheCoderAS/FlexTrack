import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/components/app/app.component';
import { config } from './app/components/app/app.config.server';
import 'localstorage-polyfill';

global['localStorage']=localStorage;
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
