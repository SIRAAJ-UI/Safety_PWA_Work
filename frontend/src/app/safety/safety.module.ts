import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafetyComponent } from './safety.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { WebcamSnapshotComponent } from '@app/webcam-snapshot/webcam-snapshot.component';
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [SafetyComponent, WebcamSnapshotComponent],
  imports: [
    CommonModule, NgSelectModule, RouterModule, ReactiveFormsModule, FormsModule
  ],
  exports: [SafetyComponent]
})
export class SafetyModule { }
