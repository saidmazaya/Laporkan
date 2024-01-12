import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ViewReportComponent } from './view-report.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const routes: Routes = [
  { 
    path: '',
    component: ViewReportComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ViewReportModule { }
