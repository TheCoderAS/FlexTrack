import { Routes } from '@angular/router';
import { AccountComponent } from '../account/account.component';
import { ReportsComponent } from '../reports/reports.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

export const routes: Routes = [
    {path:'', component:DashboardComponent},
    {path:'reports',component:ReportsComponent},
    {path:'account',component:AccountComponent}
];
