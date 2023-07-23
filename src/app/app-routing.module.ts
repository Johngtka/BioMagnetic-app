import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { VisitComponent } from './visit/visit.component';
import { HistoryComponent } from './history/history.component';
import { PatientTableComponent } from './patient-table/patient-table.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'about',
        component: AboutComponent,
    },
    {
        path: 'visit',
        component: VisitComponent,
    },
    {
        path: 'history',
        component: HistoryComponent,
    },
    {
        path: 'patient',
        component: PatientTableComponent,
    },
    {
        path: 'patient/details',
        component: PatientDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
