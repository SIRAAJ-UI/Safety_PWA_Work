import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafetyComponent } from './safety.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {  WebcamSnapshotModuleModule } from '../webcam-snapshot/webcam-snapshot.module'


@NgModule({
  declarations: [SafetyComponent],
  imports: [
    CommonModule,NgSelectModule,WebcamSnapshotModuleModule,ReactiveFormsModule,FormsModule
  ],
  exports:[SafetyComponent]
})
export class SafetyModule { }
