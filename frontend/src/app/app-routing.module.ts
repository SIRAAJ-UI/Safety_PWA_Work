import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SafetyComponent } from './safety/safety.component'
import { SafetyReportPageComponent } from './safety-report-page/safety-report-page.component';
import { LoginComponent } from './_components/login/login.component';
import { AuthGuard } from './_helpers';


const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: SafetyReportPageComponent, canActivate: [AuthGuard] },
    { path: 'safetyreport', component: SafetyComponent,canActivate: [AuthGuard]},
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }