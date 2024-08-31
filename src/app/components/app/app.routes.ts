import { Routes } from '@angular/router';
import { AccountComponent } from '../account/account.component';
import { ReportsComponent } from '../reports/reports.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoggingComponent } from '../logging/logging.component';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { TasksComponent } from '../tasks/tasks.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'add-tasks', component: TasksComponent },
    { path: 'account', component: AccountComponent },
    { path: 'logging/:log_type', component: LoggingComponent },
    { path: 'auth', component: AuthenticationComponent }
];
