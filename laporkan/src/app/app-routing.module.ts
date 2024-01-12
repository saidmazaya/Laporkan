import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',  redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import ('./pages/login/login.module')
      .then(m => m.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import ('./user/home/home.module')
      .then(m => m.HomeModule)
  },
  {
    path: 'register',
    loadChildren: () => import ('./pages/register/register.module')
      .then(m => m.RegisterModule)
  },
  {
    path: 'create-report',
    loadChildren: () => import ('./user/create-report/create-report.module')
      .then(m => m.CreateReportModule)
  },
  {
    path: 'view/:id',
    loadChildren: () => import ('./user/view-report/view-report.module')
      .then(m => m.ViewReportModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
