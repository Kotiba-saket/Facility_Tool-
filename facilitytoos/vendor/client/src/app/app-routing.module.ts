import { NotFoundComponent } from './not-found/not-found.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { OverzichtComponent } from './overzicht/overzicht.component';
import { MijnMeldingenComponent } from './mijn-meldingen/mijn-meldingen.component';
import { MijnTakenComponent } from './mijn-taken/mijn-taken.component';
import { ArchiefComponent } from './archief/archief.component';
import { NotificatiesComponent } from './notificaties/notificaties.component';
import { NoodgevalComponent } from './noodgeval/noodgeval.component';
import { InstellingenComponent } from './instellingen/instellingen.component';
import { DefectMeldenComponent } from './defect-melden/defect-melden.component';
import { CreateDefectComponent } from './create-defect/create-defect.component';
import { MsalGuard } from '@azure/msal-angular';
import { CreateTaskComponent } from './create-task/create-task.component';
import { AuthGuard } from './auth-service/auth-guard';
import { MeldingDetailComponent } from './melding-detail/melding-detail.component';
import { TaskMeldenComponent } from './task-melden/task-melden.component';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { AdminGuard } from './auth-service/admin-guard';
import { MijnTakenGuard } from './auth-service/mijn-taken-guard';
import { CategoryComponent } from './category/category.component';

export const routes: Routes = [

{
    path: 'login',
    component: AuthComponent,
    pathMatch: 'full',
},
{
    path: '',
    component: OverzichtComponent,
      canActivate: [AuthGuard]
  },
{
  //iedereen
    path: 'mijn-meldingen',
    component: MijnMeldingenComponent,
    canActivate: [AuthGuard]
},
{
  //opleingshoof , admin, mederwerker, maar medewerker kan alleen de toegewezen aan mij zien
  //admin en opleidingshoofd kan alleen mijn taken zien.
    path: 'mijn-taken',
    component: MijnTakenComponent,
    canActivate: [AuthGuard, MijnTakenGuard]
},
{
  //iedereen
    path: 'archief',
    component: ArchiefComponent,
    canActivate: [AuthGuard]
},
{
  //iedereen
    path: 'notificaties',
    component: NotificatiesComponent,
    canActivate: [AuthGuard]
},
{
  //iedereen maar update enkel door admin
    path: 'noodgeval',
    component: NoodgevalComponent,
    canActivate: [AuthGuard]
},
{
  //iedereen
    path: 'instellingen',
    component: InstellingenComponent,
    canActivate: [AuthGuard]
},
{
  //iedereen
    path: 'meldingen/defectMelden',
    component: DefectMeldenComponent,
    canActivate: [AuthGuard]
},
{
  //iedereen
    path: 'meldingen/createDefect',
    component: CreateDefectComponent,
    canActivate: [AuthGuard]
},
{
  //opleidingshoofd en admin alleen
    path: 'tasks/createTask',
    component: CreateTaskComponent,
    canActivate: [AuthGuard]
},
{
  //iedereen
  path: 'meldingen/detail/:id',
  component: MeldingDetailComponent,
  canActivate: [AuthGuard]
},
{
  //iedereen
  path: 'tasks/detail/:id',
  component: TaskDetailComponent,
  canActivate: [AuthGuard]
},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
